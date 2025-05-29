import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const ONBOARDING_COMPLETE_KEY = "onboarding_complete";

type OnboardingContextType = {
  isFirstLogin: boolean;
  setOnboardingComplete: () => Promise<void>;
  isLoading: boolean;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem(
        ONBOARDING_COMPLETE_KEY
      );
      setIsFirstLogin(onboardingComplete !== "true");
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
      setIsFirstLogin(false);
    } catch (error) {
      console.error("Error setting onboarding complete:", error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{ isFirstLogin, setOnboardingComplete, isLoading }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
