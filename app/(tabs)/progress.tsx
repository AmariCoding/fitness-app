import { useAuth } from "@/lib/auth-context";
import {
  deleteProgressPhoto,
  getUserProgressPhotos,
  ProgressPhoto,
  testFileAccess,
  uploadProgressPhoto,
} from "@/lib/database";
import { useAppTheme } from "@/lib/theme-context";
import { Oswald_700Bold, useFonts } from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  FAB,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const imageSize = (width - 48) / 2; // 2 columns with padding

// Custom Image component with error handling and debug
const ProgressImage = ({
  uri,
  style,
  fileId,
}: {
  uri: string;
  style: any;
  fileId: string;
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Debug: Log URL for inspection
    console.log(`📷 Loading image for ${fileId} with URL:`, uri);

    // Test file accessibility if fileId exists (skip for preview images)
    if (fileId) {
      testFileAccess(fileId)
        .then((result: any) => {
          console.log(`🔍 File ${fileId} accessibility test:`, result);
          if (!result.accessible && result.error) {
            console.error(`❌ File ${fileId} access error:`, result.error);
          }
        })
        .catch((error: any) => {
          console.error(`❌ Failed to test file ${fileId}:`, error);
        });
    }
  }, [fileId, uri]);

  const handleImageError = (error: any) => {
    console.error(
      `❌ Image load error for ${fileId}:`,
      error.nativeEvent?.error || error
    );
    console.log(`🔍 Failed URL: ${uri}`);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully for ${fileId || "preview"}`);
    setImageError(false);
  };

  if (imageError) {
    return (
      <View
        style={[
          style,
          {
            backgroundColor: "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text
          style={{
            color: "#666",
            textAlign: "center",
            fontSize: 12,
            padding: 8,
          }}
        >
          Image failed to load
        </Text>
        <Text
          style={{
            color: "#999",
            textAlign: "center",
            fontSize: 10,
            padding: 4,
          }}
        >
          {fileId || "Preview"}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      onError={handleImageError}
      onLoad={handleImageLoad}
      onLoadStart={() =>
        console.log(`📷 Starting to load image ${fileId || "preview"}`)
      }
    />
  );
};

export default function ProgressScreen() {
  const { user } = useAuth();
  const { theme } = useAppTheme();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyPart, setBodyPart] = useState<"front" | "side" | "back" | "other">(
    "front"
  );

  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  useEffect(() => {
    loadProgressPhotos();
  }, [user]);

  const loadProgressPhotos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userPhotos = await getUserProgressPhotos(user.$id);

      // Debug: Log the fetched photos and their URLs
      console.log(
        `📷 Loaded ${userPhotos.length} progress photos for user ${user.$id}`
      );
      userPhotos.forEach((photo, index) => {
        console.log(`📷 Photo ${index + 1}:`, {
          id: photo.$id,
          fileId: photo.fileId,
          title: photo.title,
          fileUrl: photo.fileUrl,
          uploadedAt: photo.uploadedAt,
        });
      });

      setPhotos(userPhotos);
    } catch (error) {
      console.error("Error loading progress photos:", error);
      Alert.alert("Error", "Failed to load progress photos");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgressPhotos();
    setRefreshing(false);
  };

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "Camera and photo library access are needed to upload progress photos."
      );
      return false;
    }
    return true;
  };

  const showImageSourceOptions = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    Alert.alert(
      "Select Image Source",
      "Choose how you'd like to add your progress photo",
      [
        {
          text: "Camera",
          onPress: takePhoto,
        },
        {
          text: "Photo Library",
          onPress: pickFromLibrary,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setUploadModalVisible(true);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const pickFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setUploadModalVisible(true);
      }
    } catch (error) {
      console.error("Error picking from library:", error);
      Alert.alert("Error", "Failed to select photo");
    }
  };

  const uploadPhoto = async () => {
    if (!selectedImage || !user || !title.trim()) {
      Alert.alert("Error", "Please fill in the title field");
      return;
    }

    try {
      setUploading(true);

      const progressData = {
        userId: user.$id,
        title: title.trim(),
        description: description.trim() || undefined,
        weight: weight ? parseFloat(weight) : undefined,
        bodyPart,
        uploadedAt: new Date().toISOString(),
      };

      await uploadProgressPhoto(selectedImage, progressData);

      // Reset form and reload photos
      setTitle("");
      setDescription("");
      setWeight("");
      setBodyPart("front");
      setSelectedImage(null);
      setUploadModalVisible(false);

      await loadProgressPhotos();

      Alert.alert("Success", "Progress photo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Error", "Failed to upload progress photo");
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (photo: ProgressPhoto) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this progress photo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProgressPhoto(photo.$id, photo.fileId);
              await loadProgressPhotos();
              Alert.alert("Success", "Progress photo deleted successfully!");
            } catch (error) {
              console.error("Error deleting photo:", error);
              Alert.alert("Error", "Failed to delete progress photo");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Debug function to test URLs manually
  const testAllPhotoUrls = async () => {
    if (photos.length === 0) {
      Alert.alert("No Photos", "No photos to test");
      return;
    }

    Alert.alert(
      "URL Test",
      `Testing ${photos.length} photo URLs. Check console for results.`,
      [
        {
          text: "OK",
          onPress: async () => {
            for (const photo of photos) {
              try {
                const result = await testFileAccess(photo.fileId);
                console.log(`🧪 Test result for ${photo.title}:`, result);

                // Try to fetch the URL directly
                try {
                  const response = await fetch(photo.fileUrl, {
                    method: "HEAD",
                  });
                  console.log(
                    `🌐 Direct fetch test for ${photo.title}: ${response.status}`
                  );
                } catch (fetchError) {
                  console.log(
                    `🌐 Direct fetch failed for ${photo.title}:`,
                    fetchError
                  );
                }
              } catch (error) {
                console.error(`❌ Test failed for ${photo.title}:`, error);
              }
            }
          },
        },
      ]
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  const styles = createStyles(theme);

  const renderPhotoItem = ({ item }: { item: ProgressPhoto }) => (
    <Card style={[styles.photoCard, { backgroundColor: theme.colors.card }]}>
      <TouchableOpacity
        onPress={() => {
          // Could implement full screen view here
        }}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <ProgressImage
            uri={item.fileUrl}
            style={styles.photoImage}
            fileId={item.fileId}
          />
          <View style={styles.imageOverlay}>
            <IconButton
              icon="delete"
              size={20}
              iconColor="white"
              style={[
                styles.deleteButton,
                { backgroundColor: "rgba(255, 0, 0, 0.8)" },
              ]}
              onPress={() => deletePhoto(item)}
            />
            <View style={styles.dateOverlay}>
              <Text style={styles.overlayDate}>
                {formatDate(item.uploadedAt)}
              </Text>
            </View>
          </View>
        </View>

        <Card.Content style={styles.photoContent}>
          <Text
            style={[styles.photoTitle, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <View style={styles.photoMeta}>
            <View style={styles.metaRow}>
              <Chip
                mode="flat"
                style={[
                  styles.bodyPartChip,
                  { backgroundColor: `${theme.colors.primary}15` },
                ]}
                textStyle={{
                  color: theme.colors.primary,
                  fontSize: 10,
                  fontWeight: "600",
                }}
              >
                📍 {item.bodyPart}
              </Chip>
              {item.weight && (
                <View
                  style={[
                    styles.weightContainer,
                    { backgroundColor: `${theme.colors.primary}10` },
                  ]}
                >
                  <Text
                    style={[styles.weightText, { color: theme.colors.primary }]}
                  >
                    ⚖️ {item.weight} lbs
                  </Text>
                </View>
              )}
            </View>
          </View>

          {item.description && (
            <Text
              style={[
                styles.photoDescription,
                { color: theme.colors.textSecondary },
              ]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}

          <View style={styles.cardFooter}>
            <View style={styles.progressIndicator}>
              <View
                style={[
                  styles.progressDot,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
              <Text
                style={[
                  styles.progressText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Progress Photo
              </Text>
            </View>
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Progress Photos</Text>
            <Text style={styles.subtitle}>Track your fitness journey</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Loading your progress photos...
            </Text>
          </View>
        ) : photos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No Progress Photos Yet
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Start documenting your fitness journey by taking your first
              progress photo!
            </Text>
            <Button
              mode="contained"
              style={[
                styles.firstPhotoButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={showImageSourceOptions}
            >
              Take First Photo
            </Button>
          </View>
        ) : (
          <FlatList
            data={photos}
            renderItem={renderPhotoItem}
            keyExtractor={(item) => item.$id}
            numColumns={2}
            contentContainerStyle={styles.photosList}
            columnWrapperStyle={styles.photosRow}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <FAB
        icon="camera"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={showImageSourceOptions}
      />

      <Portal>
        <Modal
          visible={uploadModalVisible}
          onDismiss={() => setUploadModalVisible(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              size={14}
              iconColor={theme.colors.textSecondary}
              onPress={() => setUploadModalVisible(false)}
              style={styles.closeButton}
            />
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              📸 Add Progress Photo
            </Text>
          </View>

          {selectedImage ? (
            <View style={styles.imagePreviewSection}>
              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
                Preview
              </Text>
              <View style={styles.previewContainer}>
                <ProgressImage
                  uri={selectedImage}
                  style={styles.previewImage}
                  fileId=""
                />
                <View style={styles.imageActions}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    iconColor="white"
                    style={[
                      styles.editImageButton,
                      { backgroundColor: theme.colors.primary },
                    ]}
                    onPress={showImageSourceOptions}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.imagePickerSection}>
              <TouchableOpacity
                style={[
                  styles.imagePicker,
                  { borderColor: theme.colors.primary },
                ]}
                onPress={showImageSourceOptions}
              >
                <IconButton
                  icon="camera-plus"
                  size={32}
                  iconColor={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.imagePickerText,
                    { color: theme.colors.primary },
                  ]}
                >
                  Tap to add photo
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.formSection}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
              Details
            </Text>

            <View style={styles.inputGroup}>
              <TextInput
                label="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                mode="outlined"
                placeholder="e.g., 3 Month Progress"
                left={<TextInput.Icon icon="format-title" />}
                error={!title.trim() && title.length > 0}
              />
              {!title.trim() && title.length > 0 && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  Title is required
                </Text>
              )}
            </View>

            <TextInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={2}
              placeholder="Share your thoughts about this progress..."
              left={<TextInput.Icon icon="text" />}
            />

            <View style={styles.metaInputsRow}>
              <TextInput
                label="Weight"
                value={weight}
                onChangeText={setWeight}
                style={[styles.input, styles.halfInput]}
                mode="outlined"
                keyboardType="numeric"
                placeholder="lbs"
                left={<TextInput.Icon icon="scale" />}
              />

              <View style={[styles.halfInput, styles.bodyPartSelector]}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Body Part
                </Text>
                <View style={styles.bodyPartGrid}>
                  {(["front", "side", "back", "other"] as const).map((part) => (
                    <Chip
                      key={part}
                      mode={bodyPart === part ? "flat" : "outlined"}
                      selected={bodyPart === part}
                      onPress={() => setBodyPart(part)}
                      style={[
                        styles.bodyPartChipNew,
                        bodyPart === part && {
                          backgroundColor: theme.colors.primary,
                        },
                      ]}
                      textStyle={{
                        color: bodyPart === part ? "white" : theme.colors.text,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {part === "front"
                        ? "👤"
                        : part === "side"
                        ? "🔄"
                        : part === "back"
                        ? "🔙"
                        : "📍"}{" "}
                      {part}
                    </Chip>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <Button
              mode="outlined"
              onPress={() => setUploadModalVisible(false)}
              style={[styles.modalButton, styles.cancelButton]}
              labelStyle={styles.buttonLabel}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={uploadPhoto}
              style={[
                styles.modalButton,
                styles.uploadButton,
                { backgroundColor: theme.colors.primary },
              ]}
              labelStyle={[styles.buttonLabel, styles.uploadButtonLabel]}
              loading={uploading}
              disabled={uploading || !title.trim() || !selectedImage}
              icon={uploading ? undefined : "upload"}
            >
              {uploading ? "Uploading..." : "Upload Photo"}
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.primary,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerText: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    title: {
      fontFamily: "Oswald_700Bold",
      fontSize: 28,
      color: "white",
      marginBottom: 4,
    },
    subtitle: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    loadingText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      marginTop: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 24,
      marginBottom: 12,
      textAlign: "center",
    },
    emptySubtitle: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 24,
    },
    firstPhotoButton: {
      paddingHorizontal: 20,
    },
    photosList: {
      padding: 16,
    },
    photosRow: {
      justifyContent: "space-between",
    },
    photoCard: {
      width: imageSize,
      marginBottom: 16,
      elevation: 4,
      borderRadius: 12,
      overflow: "hidden",
    },
    photoImage: {
      width: "100%",
      height: imageSize * 1.2,
      resizeMode: "cover",
    },
    photoContent: {
      padding: 8,
    },
    photoHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    photoTitle: {
      fontFamily: "Roboto_500Medium",
      fontSize: 14,
      flex: 1,
    },
    photoDate: {
      fontFamily: "Roboto_400Regular",
      fontSize: 12,
      marginBottom: 8,
    },
    photoMeta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
    },
    bodyPartChip: {
      height: 32,
      borderRadius: 12,
    },
    weightText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 11,
    },
    photoDescription: {
      fontFamily: "Roboto_400Regular",
      fontSize: 12,
      lineHeight: 16,
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
    modal: {
      margin: 20,
      padding: 20,
      borderRadius: 12,
      maxHeight: "95%",
      marginBottom: 60,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    closeButton: {
      marginLeft: 10,
    },
    modalTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 24,
      marginBottom: 4,
      textAlign: "center",
    },
    modalSubtitle: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      textAlign: "center",
    },
    imagePreviewSection: {
      marginBottom: 20,
    },
    sectionLabel: {
      fontFamily: "Oswald_700Bold",
      fontSize: 18,
      marginBottom: 8,
    },
    previewContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    previewImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginRight: 10,
    },
    imageActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    editImageButton: {
      borderRadius: 20,
    },
    imagePickerSection: {
      marginBottom: 20,
    },
    imagePicker: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: 8,
    },
    imagePickerText: {
      fontFamily: "Roboto_500Medium",
      fontSize: 16,
      marginLeft: 10,
    },
    formSection: {
      marginBottom: 20,
    },
    inputGroup: {
      marginBottom: 16,
    },
    input: {
      marginBottom: 8,
    },
    metaInputsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    halfInput: {
      flex: 1,
    },
    bodyPartSelector: {
      flexDirection: "row",
      alignItems: "center",
    },
    inputLabel: {
      fontFamily: "Roboto_500Medium",
      fontSize: 16,
      marginBottom: 8,
    },
    bodyPartGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    bodyPartChipNew: {
      marginRight: 8,
      marginBottom: 8,
    },
    modalFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      marginBottom: 20,
      paddingBottom: 10,
      gap: 12,
    },
    modalButton: {
      flex: 1,
      minWidth: 120,
    },
    cancelButton: {
      backgroundColor: "transparent",
    },
    buttonLabel: {
      fontFamily: "Roboto_500Medium",
      fontSize: 16,
    },
    uploadButton: {
      backgroundColor: theme.colors.primary,
    },
    uploadButtonLabel: {
      color: "white",
    },
    imageContainer: {
      position: "relative",
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "flex-end",
    },
    deleteButton: {
      position: "absolute",
      top: 8,
      right: 8,
    },
    dateOverlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 4,
    },
    overlayDate: {
      fontFamily: "Roboto_500Medium",
      fontSize: 12,
      color: "white",
    },
    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    progressIndicator: {
      flexDirection: "row",
      alignItems: "center",
    },
    progressDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    progressText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 12,
    },
    weightContainer: {
      padding: 4,
      borderRadius: 4,
    },
    contentContainer: {
      flex: 1,
    },
  });
