import { useAuth } from "@/lib/auth-context";
import { useOnboarding } from "@/lib/onboarding-context";
import { useAppTheme } from "@/lib/theme-context";
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
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  const { user, signOut } = useAuth();
  const { setOnboardingComplete } = useOnboarding();
  const { theme, isDarkMode, setDarkMode } = useAppTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
              onPress={() => console.log("Change password pressed")}
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
            <Divider style={{ backgroundColor: theme.colors.border }} />
            <List.Item
              title="Units"
              description="Imperial (lbs, ft)"
              left={(props) => (
                <List.Icon {...props} icon="scale" color={theme.colors.text} />
              )}
              right={(props) => (
                <List.Icon
                  {...props}
                  icon="chevron-right"
                  color={theme.colors.text}
                />
              )}
              onPress={() => console.log("Units pressed")}
              titleStyle={{ color: theme.colors.text }}
              descriptionStyle={{ color: theme.colors.textSecondary }}
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
              onPress={() => console.log("Terms pressed")}
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
  });
