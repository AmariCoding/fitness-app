import { useAuth } from "@/lib/auth-context";
import {
  Oswald_500Medium,
  Oswald_700Bold,
  useFonts,
} from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function MindsetLoginScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");
  const theme = useTheme();
  const router = useRouter();
  const { signUp, signIn } = useAuth();

  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Oswald_500Medium,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        setError(error);
        return;
      }
      // Onboarding will be handled by RouteGuard component
    } else {
      const error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }
      // Onboarding check will be handled by RouteGuard component
    }
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  const renderBackground = () => {
    try {
      // Try to use the image background if it exists
      return (
        <ImageBackground
          source={require("../assets/images/fitness-bg.jpg")}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay}>{renderContent()}</View>
        </ImageBackground>
      );
    } catch (error) {
      // Fallback to gradient if image doesn't exist
      return (
        <LinearGradient
          colors={["#1a2a6c", "#b21f1f", "#fdbb2d"]}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay}>{renderContent()}</View>
        </LinearGradient>
      );
    }
  };

  const renderContent = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.appTitle}>MINDSET</Text>
            <Text style={styles.appTagline}>
              Train your brain like your body
            </Text>
          </View>

          <View style={styles.loginCard}>
            <Text style={styles.title}>
              {isSignUp ? "CREATE ACCOUNT" : "WELCOME BACK"}
            </Text>

            <TextInput
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your email"
              mode="outlined"
              style={styles.input}
              onChangeText={setEmail}
              left={<TextInput.Icon icon="email" />}
              theme={{
                colors: { primary: "#ff6b00" },
              }}
            />

            <TextInput
              label="Password"
              autoCapitalize="none"
              secureTextEntry={true}
              mode="outlined"
              style={styles.input}
              onChangeText={setPassword}
              left={<TextInput.Icon icon="lock" />}
              right={<TextInput.Icon icon="eye" />}
              theme={{
                colors: { primary: "#ff6b00" },
              }}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              mode="contained"
              style={styles.button}
              onPress={handleAuth}
              buttonColor="#ff6b00"
              textColor="#FFFFFF"
              icon="dumbbell"
              labelStyle={styles.buttonText}
            >
              {isSignUp ? "SIGN UP" : "SIGN IN"}
            </Button>

            <Button
              mode="text"
              onPress={handleSwitchMode}
              style={styles.switchModeButton}
              textColor="#ff6b00"
              labelStyle={styles.switchButtonText}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Create an account"}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  return <View style={styles.container}>{renderBackground()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  appTitle: {
    color: "#FFFFFF",
    fontFamily: "Oswald_700Bold",
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 8,
    fontSize: 42,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  appTagline: {
    color: "#ff6b00",
    fontFamily: "Oswald_500Medium",
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  loginCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 15,
    padding: 30,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderLeftWidth: 5,
    borderLeftColor: "#ff6b00",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Oswald_700Bold",
    color: "#333333",
    fontSize: 24,
    letterSpacing: 1,
  },
  input: {
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    fontFamily: "Roboto_400Regular",
    height: 56,
  },
  errorText: {
    color: "#D32F2F",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Roboto_400Regular",
  },
  button: {
    marginTop: 25,
    borderRadius: 30,
    paddingVertical: 6,
    elevation: 4,
    height: 50,
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Oswald_700Bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  switchModeButton: {
    marginTop: 20,
  },
  switchButtonText: {
    fontFamily: "Roboto_500Medium",
  },
});
