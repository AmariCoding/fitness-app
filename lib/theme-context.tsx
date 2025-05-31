import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "app_theme_preference";

export interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    error: string;
    success: string;
    warning: string;
  };
}

export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: "#6200ee",
    background: "#f5f5f5",
    surface: "#ffffff",
    card: "#ffffff",
    text: "#000000",
    textSecondary: "#666666",
    border: "#e0e0e0",
    accent: "#ff6b00",
    error: "#f44336",
    success: "#4caf50",
    warning: "#ff9800",
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: "#bb86fc",
    background: "#121212",
    surface: "#1e1e1e",
    card: "#2d2d2d",
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    border: "#404040",
    accent: "#ff8a50",
    error: "#cf6679",
    success: "#81c784",
    warning: "#ffb74d",
  },
};

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (enabled: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkModeState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDarkModeState(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (darkMode: boolean) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(darkMode));
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const setDarkMode = (enabled: boolean) => {
    setIsDarkModeState(enabled);
    saveThemePreference(enabled);
  };

  const toggleTheme = () => {
    setDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleTheme,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
}
