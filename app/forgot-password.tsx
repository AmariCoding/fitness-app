import { useAuth } from "@/lib/auth-context";
import { useAppTheme } from "@/lib/theme-context";
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
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type ResetStep = "email" | "otp" | "password";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);
  const [recoveryUrl, setRecoveryUrl] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const { theme } = useAppTheme();
  const router = useRouter();
  const { requestPasswordReset, resetPassword } = useAuth();

  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Oswald_500Medium,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleRequestReset = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    const error = await requestPasswordReset(email);
    if (error) {
      setError(error);
    } else {
      setStep("otp");
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      setError("Please paste the verification link from your email");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let userId, secret;

      if (otpCode.includes("http")) {
        const url = new URL(otpCode);
        userId = url.searchParams.get("userId");
        secret = url.searchParams.get("secret");
      } else {
        secret = otpCode.trim();
        userId = email;
      }

      if (!secret) {
        setError(
          "Invalid verification code. Please copy the complete code from your email."
        );
        return;
      }

      console.log("Extracted userId:", userId);
      console.log("Extracted secret:", secret);

      setUserId(userId || email);
      setOtp(secret);
      setStep("password");
    } catch (error: any) {
      console.error("Parsing error:", error);
      setUserId(email);
      setOtp(otpCode.trim());
      setStep("password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    const error = await resetPassword(userId, otp, newPassword);
    if (error) {
      setError(error);
    } else {
      router.replace({
        pathname: "/login",
        params: {
          message:
            "Password reset successful! Please sign in with your new password.",
        },
      });
    }
    setIsLoading(false);
  };

  const renderEmailStep = () => (
    <>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we&apos;ll send you a verification email
        with a link to reset your password.
      </Text>

      <TextInput
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Enter your email"
        mode="outlined"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        left={<TextInput.Icon icon="email" />}
        theme={{
          colors: { primary: theme.colors.primary },
        }}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        mode="contained"
        style={styles.button}
        onPress={handleRequestReset}
        buttonColor={theme.colors.primary}
        textColor="#FFFFFF"
        icon="email-send"
        labelStyle={styles.buttonText}
        loading={isLoading}
        disabled={isLoading}
      >
        Send Verification Email
      </Button>
    </>
  );

  const renderOtpStep = () => (
    <>
      <Text style={styles.title}>Check Your Email</Text>
      <Text style={styles.subtitle}>
        We&apos;ve sent a password reset email to {email}. Please check your
        email and copy the verification link.
      </Text>
      <Text style={styles.instructionText}>
        Copy and paste the entire verification link from your email:
      </Text>

      <TextInput
        label="Verification Link"
        placeholder="Paste the verification link from your email"
        mode="outlined"
        style={styles.multilineInput}
        value={otpCode}
        onChangeText={setOtpCode}
        multiline={true}
        numberOfLines={3}
        left={<TextInput.Icon icon="link" />}
        theme={{
          colors: { primary: theme.colors.primary },
        }}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        mode="contained"
        style={styles.button}
        onPress={handleVerifyOtp}
        buttonColor={theme.colors.primary}
        textColor="#FFFFFF"
        icon="shield-check"
        labelStyle={styles.buttonText}
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Continue"}
      </Button>

      <Button
        mode="text"
        onPress={() => setStep("email")}
        style={styles.backButton}
        textColor={theme.colors.primary}
        labelStyle={styles.backButtonText}
      >
        Back to Email
      </Button>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>Enter your new password below.</Text>

      <TextInput
        label="New Password"
        autoCapitalize="none"
        secureTextEntry={!isPasswordVisible}
        mode="outlined"
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={isPasswordVisible ? "eye-off" : "eye"}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        }
        theme={{
          colors: { primary: theme.colors.primary },
        }}
      />

      <TextInput
        label="Confirm New Password"
        autoCapitalize="none"
        secureTextEntry={!isConfirmPasswordVisible}
        mode="outlined"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        left={<TextInput.Icon icon="lock-check" />}
        right={
          <TextInput.Icon
            icon={isConfirmPasswordVisible ? "eye-off" : "eye"}
            onPress={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
          />
        }
        theme={{
          colors: { primary: theme.colors.primary },
        }}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        mode="contained"
        style={styles.button}
        onPress={handleResetPassword}
        buttonColor={theme.colors.primary}
        textColor="#FFFFFF"
        icon="lock-reset"
        labelStyle={styles.buttonText}
        loading={isLoading}
        disabled={isLoading}
      >
        Reset Password
      </Button>

      <Button
        mode="text"
        onPress={() => setStep("otp")}
        style={styles.backButton}
        textColor={theme.colors.primary}
        labelStyle={styles.backButtonText}
      >
        Back to Verification
      </Button>
    </>
  );

  const renderBackground = () => {
    try {
      return (
        <ImageBackground
          source={require("../assets/images/fitness-bg.jpg")}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay}>{renderContent()}</View>
        </ImageBackground>
      );
    } catch (error) {
      return (
        <LinearGradient
          colors={[
            theme.colors.primary,
            theme.colors.accent,
            theme.colors.primary,
          ]}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay}>{renderContent()}</View>
        </LinearGradient>
      );
    }
  };

  const renderContent = () => {
    return (
      <SafeAreaView style={styles.safeArea}>
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

            <View style={styles.resetCard}>
              {step === "email" && renderEmailStep()}
              {step === "otp" && renderOtpStep()}
              {step === "password" && renderPasswordStep()}

              <Button
                mode="text"
                onPress={() => router.back()}
                style={styles.loginButton}
                textColor={theme.colors.primary}
                labelStyle={styles.loginButtonText}
              >
                Back to Sign In
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
  safeArea: {
    flex: 1,
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
  resetCard: {
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
    marginBottom: 20,
    fontFamily: "Oswald_700Bold",
    color: "#333333",
    fontSize: 24,
    letterSpacing: 1,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Roboto_400Regular",
    color: "#666666",
    fontSize: 16,
    lineHeight: 22,
  },
  instructionText: {
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Roboto_400Regular",
    color: "#666666",
    fontSize: 14,
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
  backButton: {
    marginTop: 15,
  },
  backButtonText: {
    fontFamily: "Roboto_500Medium",
  },
  loginButton: {
    marginTop: 25,
  },
  loginButtonText: {
    fontFamily: "Roboto_500Medium",
  },
  multilineInput: {
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    fontFamily: "Roboto_400Regular",
    height: 100,
  },
});
