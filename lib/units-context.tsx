import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type UnitSystem = "imperial" | "metric";

type UnitsContextType = {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  formatWeight: (weight: number) => string;
  formatHeight: (height: number) => string;
  formatDistance: (distance: number) => string;
  weightUnit: string;
  heightUnit: string;
  distanceUnit: string;
};

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

const STORAGE_KEY = "unit_system";

export function UnitsProvider({ children }: { children: React.ReactNode }) {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>("imperial");

  useEffect(() => {
    loadUnitSystem();
  }, []);

  const loadUnitSystem = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved && (saved === "imperial" || saved === "metric")) {
        setUnitSystemState(saved);
      }
    } catch (error) {
      console.error("Failed to load unit system:", error);
    }
  };

  const setUnitSystem = async (system: UnitSystem) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, system);
      setUnitSystemState(system);
    } catch (error) {
      console.error("Failed to save unit system:", error);
    }
  };

  const formatWeight = (weight: number): string => {
    if (unitSystem === "imperial") {
      return `${weight.toFixed(1)} lbs`;
    } else {
      // Convert pounds to kilograms (1 lb = 0.453592 kg)
      const kg = weight * 0.453592;
      return `${kg.toFixed(1)} kg`;
    }
  };

  const formatHeight = (height: number): string => {
    if (unitSystem === "imperial") {
      // Assuming height is in inches
      const feet = Math.floor(height / 12);
      const inches = height % 12;
      return `${feet}'${inches}"`;
    } else {
      // Convert inches to centimeters (1 inch = 2.54 cm)
      const cm = height * 2.54;
      return `${cm.toFixed(0)} cm`;
    }
  };

  const formatDistance = (distance: number): string => {
    if (unitSystem === "imperial") {
      return `${distance.toFixed(2)} mi`;
    } else {
      // Convert miles to kilometers (1 mile = 1.60934 km)
      const km = distance * 1.60934;
      return `${km.toFixed(2)} km`;
    }
  };

  const weightUnit = unitSystem === "imperial" ? "lbs" : "kg";
  const heightUnit = unitSystem === "imperial" ? "ft/in" : "cm";
  const distanceUnit = unitSystem === "imperial" ? "mi" : "km";

  return (
    <UnitsContext.Provider
      value={{
        unitSystem,
        setUnitSystem,
        formatWeight,
        formatHeight,
        formatDistance,
        weightUnit,
        heightUnit,
        distanceUnit,
      }}
    >
      {children}
    </UnitsContext.Provider>
  );
}

export function useUnits() {
  const context = useContext(UnitsContext);
  if (context === undefined) {
    throw new Error("useUnits must be used within a UnitsProvider");
  }
  return context;
}
