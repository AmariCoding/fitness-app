import { useAuth } from "@/lib/auth-context";
import { useOnboarding } from "@/lib/onboarding-context";
import { Oswald_700Bold, useFonts } from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";

export default function AccountScreen() {
  const { user, signOut } = useAuth();
  const { setOnboardingComplete } = useOnboarding();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const theme = useTheme();

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
          style={[styles.avatar, { backgroundColor: "#ff6b00" }]}
          color="#fff"
        />
        <Text style={styles.name}>{user?.name || "Fitness Enthusiast"}</Text>
        <Text style={styles.email}>{user?.email || ""}</Text>
      </View>

      <Card style={styles.section}>
        <Card.Title title="Account Settings" />
        <Card.Content>
          <List.Item
            title="Email"
            description={user?.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <Divider />
          <List.Item
            title="Change Password"
            left={(props) => <List.Icon {...props} icon="lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log("Change password pressed")}
          />
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Title title="Preferences" />
        <Card.Content>
          <List.Item
            title="Dark Mode"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color="#ff6b00"
              />
            )}
          />
          <Divider />
          <List.Item
            title="Notifications"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color="#ff6b00"
              />
            )}
          />
          <Divider />
          <List.Item
            title="Units"
            description="Imperial (lbs, ft)"
            left={(props) => <List.Icon {...props} icon="scale" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log("Units pressed")}
          />
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Title title="About" />
        <Card.Content>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log("Terms pressed")}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log("Privacy pressed")}
          />
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => signOut()}
          style={styles.signOutButton}
          icon="logout"
        >
          Sign Out
        </Button>

        {__DEV__ && (
          <Button
            mode="outlined"
            onPress={resetOnboarding}
            style={styles.devButton}
          >
            Reset Onboarding (Dev Only)
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#6200ee",
    padding: 24,
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
    backgroundColor: "#ff6b00",
    marginBottom: 12,
  },
  devButton: {
    borderColor: "#757575",
  },
});
