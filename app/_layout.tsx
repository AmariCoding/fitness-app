import { AuthProvider, useAuth } from "@/lib/auth-context";
import { OnboardingProvider, useOnboarding } from "@/lib/onboarding-context";
import { ThemeProvider, useAppTheme } from "@/lib/theme-context";
import { UnitsProvider } from "@/lib/units-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoadingUser } = useAuth();
  const { isFirstLogin, isLoading: isLoadingOnboarding } = useOnboarding();
  const segments = useSegments();

  useEffect(() => {
    // Wait for both auth and onboarding to load
    if (isLoadingUser || isLoadingOnboarding) {
      return; // Don't navigate while still loading
    }

    const inAuthGroup = segments[0] === "login";
    const inOnboardingGroup = segments[0] === "onboarding";

    // Logic for navigation based on auth state and onboarding status
    if (!user && !inAuthGroup) {
      // Not logged in, redirect to login
      console.log("Redirecting to login - no user");
      router.replace("/login");
    } else if (user && inAuthGroup) {
      // Logged in and on login screen, check if first login
      if (isFirstLogin) {
        // First time login, show onboarding
        console.log("Redirecting to onboarding - first login");
        router.replace("/onboarding");
      } else {
        // Not first login, go to main app
        console.log("Redirecting to home - returning user");
        router.replace("/");
      }
    } else if (user && !isFirstLogin && inOnboardingGroup) {
      // User has completed onboarding before, skip it
      console.log("Skipping onboarding - already completed");
      router.replace("/");
    }
  }, [
    user,
    segments,
    router,
    isLoadingUser,
    isFirstLogin,
    isLoadingOnboarding,
  ]);

  return <>{children}</>;
}

function AppContent() {
  const { theme } = useAppTheme();

  // Create Paper theme from our app theme
  const paperTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      // Map our theme colors to Paper's expected structure
      surface: theme.colors.card,
      onSurface: theme.colors.text,
      surfaceVariant: theme.colors.surface,
      onSurfaceVariant: theme.colors.textSecondary,
      outline: theme.colors.border,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <UnitsProvider>
        <AuthProvider>
          <OnboardingProvider>
            <RouteGuard>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen
                  name="onboarding"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="workout-session"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="terms-of-service"
                  options={{ headerShown: false }}
                />
              </Stack>
            </RouteGuard>
          </OnboardingProvider>
        </AuthProvider>
      </UnitsProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
