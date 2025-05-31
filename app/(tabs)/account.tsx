import { useAuth } from "@/lib/auth-context";
import { useOnboarding } from "@/lib/onboarding-context";
import { useAppTheme } from "@/lib/theme-context";
import { Oswald_700Bold, useFonts } from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Modal,
  Portal,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  const { user, signOut, changePassword } = useAuth();
  const { setOnboardingComplete } = useOnboarding();
  const { theme, isDarkMode, setDarkMode } = useAppTheme();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const resetOnboarding = async () => {
    // This is a dev function to reset onboarding status
    await setOnboardingComplete();
  };

  const styles = createStyles(theme);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const error = await changePassword(currentPassword, newPassword);
      if (error) {
        setPasswordError(error);
      } else {
        setPasswordSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setShowChangePassword(false);
          setPasswordSuccess("");
        }, 2000);
      }
    } catch (error: any) {
      setPasswordError(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const resetPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView>
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            style={[styles.avatar, { backgroundColor: theme.colors.accent }]}
            color="#fff"
          />
          <Text style={styles.name}>{user?.name || "Fitness Enthusiast"}</Text>
          <Text style={styles.email}>{user?.email || ""}</Text>
        </View>

        <Card style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Card.Title
            title="Account Settings"
            titleStyle={{ color: theme.colors.text }}
          />
          <Card.Content>
            <List.Item
              title="Email"
              description={user?.email}
              left={(props) => (
                <List.Icon {...props} icon="email" color={theme.colors.text} />
              )}
              titleStyle={{ color: theme.colors.text }}
              descriptionStyle={{ color: theme.colors.textSecondary }}
            />
            <Divider style={{ backgroundColor: theme.colors.border }} />
            <List.Item
              title="Change Password"
              left={(props) => (
                <List.Icon {...props} icon="lock" color={theme.colors.text} />
              )}
              right={(props) => (
                <List.Icon
                  {...props}
                  icon="chevron-right"
                  color={theme.colors.text}
                />
              )}
              onPress={() => setShowChangePassword(true)}
              titleStyle={{ color: theme.colors.text }}
            />
          </Card.Content>
        </Card>

        <Card style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Card.Title
            title="Preferences"
            titleStyle={{ color: theme.colors.text }}
          />
          <Card.Content>
            <List.Item
              title="Dark Mode"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="theme-light-dark"
                  color={theme.colors.text}
                />
              )}
              right={() => (
                <Switch
                  value={isDarkMode}
                  onValueChange={setDarkMode}
                  color={theme.colors.primary}
                />
              )}
              titleStyle={{ color: theme.colors.text }}
            />
            <Divider style={{ backgroundColor: theme.colors.border }} />
            <List.Item
              title="Notifications"
              left={(props) => (
                <List.Icon {...props} icon="bell" color={theme.colors.text} />
              )}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color={theme.colors.primary}
                />
              )}
              titleStyle={{ color: theme.colors.text }}
            />
          </Card.Content>
        </Card>

        <Card style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Card.Title title="About" titleStyle={{ color: theme.colors.text }} />
          <Card.Content>
            <List.Item
              title="Version"
              description="1.0.0"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="information"
                  color={theme.colors.text}
                />
              )}
              titleStyle={{ color: theme.colors.text }}
              descriptionStyle={{ color: theme.colors.textSecondary }}
            />
            <Divider style={{ backgroundColor: theme.colors.border }} />
            <List.Item
              title="Terms of Service"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="file-document"
                  color={theme.colors.text}
                />
              )}
              right={(props) => (
                <List.Icon
                  {...props}
                  icon="chevron-right"
                  color={theme.colors.text}
                />
              )}
              onPress={() => router.push("/terms-of-service")}
              titleStyle={{ color: theme.colors.text }}
            />
            <Divider style={{ backgroundColor: theme.colors.border }} />
            <List.Item
              title="Privacy Policy"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="shield-account"
                  color={theme.colors.text}
                />
              )}
              right={(props) => (
                <List.Icon
                  {...props}
                  icon="chevron-right"
                  color={theme.colors.text}
                />
              )}
              onPress={() => console.log("Privacy pressed")}
              titleStyle={{ color: theme.colors.text }}
            />
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => signOut()}
            style={[
              styles.signOutButton,
              { backgroundColor: theme.colors.accent },
            ]}
            icon="logout"
          >
            Sign Out
          </Button>

          {__DEV__ && (
            <Button
              mode="outlined"
              onPress={resetOnboarding}
              style={[styles.devButton, { borderColor: theme.colors.border }]}
              textColor={theme.colors.text}
            >
              Reset Onboarding (Dev Only)
            </Button>
          )}
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={showChangePassword}
          onDismiss={() => {
            setShowChangePassword(false);
            resetPasswordModal();
          }}
          contentContainerStyle={[
            styles.passwordModal,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Text
            style={[styles.passwordModalTitle, { color: theme.colors.text }]}
          >
            Change Password
          </Text>

          <TextInput
            label="Current Password"
            secureTextEntry={!showCurrentPassword}
            mode="outlined"
            style={styles.passwordInput}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showCurrentPassword ? "eye-off" : "eye"}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            }
            theme={{ colors: { primary: theme.colors.primary } }}
          />

          <TextInput
            label="New Password"
            secureTextEntry={!showNewPassword}
            mode="outlined"
            style={styles.passwordInput}
            value={newPassword}
            onChangeText={setNewPassword}
            left={<TextInput.Icon icon="lock-plus" />}
            right={
              <TextInput.Icon
                icon={showNewPassword ? "eye-off" : "eye"}
                onPress={() => setShowNewPassword(!showNewPassword)}
              />
            }
            theme={{ colors: { primary: theme.colors.primary } }}
          />

          <TextInput
            label="Confirm New Password"
            secureTextEntry={!showConfirmPassword}
            mode="outlined"
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            left={<TextInput.Icon icon="lock-check" />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            theme={{ colors: { primary: theme.colors.primary } }}
          />

          {passwordError && (
            <Text
              style={[styles.passwordMessage, { color: theme.colors.error }]}
            >
              {passwordError}
            </Text>
          )}

          {passwordSuccess && (
            <Text
              style={[styles.passwordMessage, { color: theme.colors.primary }]}
            >
              {passwordSuccess}
            </Text>
          )}

          <View style={styles.passwordModalButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                setShowChangePassword(false);
                resetPasswordModal();
              }}
              style={[
                styles.passwordModalButton,
                { borderColor: theme.colors.border },
              ]}
              textColor={theme.colors.text}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.passwordModalButton}
              buttonColor={theme.colors.primary}
              textColor="#FFFFFF"
              loading={isChangingPassword}
              disabled={isChangingPassword}
            >
              Change Password
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
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 16,
      alignItems: "center",
    },
    avatar: {
      marginBottom: 12,
    },
    name: {
      fontFamily: "Oswald_700Bold",
      fontSize: 24,
      color: "white",
      marginBottom: 4,
    },
    email: {
      fontFamily: "Roboto_400Regular",
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.8)",
    },
    section: {
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 8,
      overflow: "hidden",
    },
    buttonContainer: {
      margin: 16,
      marginTop: 24,
      marginBottom: 40,
    },
    signOutButton: {
      marginBottom: 12,
    },
    devButton: {
      borderWidth: 1,
    },
    passwordModal: {
      padding: 24,
      borderRadius: 12,
      width: "90%",
      alignSelf: "center",
      maxWidth: 400,
    },
    passwordModalTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 24,
      marginBottom: 24,
      textAlign: "center",
    },
    passwordInput: {
      marginBottom: 12,
    },
    passwordMessage: {
      marginBottom: 12,
    },
    passwordModalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    passwordModalButton: {
      flex: 1,
      marginHorizontal: 4,
    },
  });
