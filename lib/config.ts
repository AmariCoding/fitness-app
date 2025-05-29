// Configuration utility for environment variables

// Default values for local development
const DEFAULT_CONFIG = {
  APPWRITE_ENDPOINT: "https://cloud.appwrite.io/v1",
  APPWRITE_PROJECT_ID: "your-project-id", // Replace with your actual project ID
};

// Get value from environment with fallback to defaults
export function getConfig(key: keyof typeof DEFAULT_CONFIG): string {
  const envKey = `EXPO_PUBLIC_${key}`;
  return process.env[envKey] || DEFAULT_CONFIG[key];
}

// Validate required configuration values
export function validateConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  // Add required config keys to check
  const requiredKeys: (keyof typeof DEFAULT_CONFIG)[] = [
    "APPWRITE_ENDPOINT",
    "APPWRITE_PROJECT_ID",
  ];

  for (const key of requiredKeys) {
    const value = getConfig(key);
    // Check if value is missing or using default placeholder
    if (!value || value.includes("your-") || value === DEFAULT_CONFIG[key]) {
      missing.push(key);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

// Get all configuration as an object
export function getAllConfig() {
  return {
    APPWRITE_ENDPOINT: getConfig("APPWRITE_ENDPOINT"),
    APPWRITE_PROJECT_ID: getConfig("APPWRITE_PROJECT_ID"),
  };
}

// Debug function to log current configuration
export function logConfig() {
  if (__DEV__) {
    console.log("App Configuration:", getAllConfig());
    const validation = validateConfig();
    if (!validation.valid) {
      console.warn("⚠️ Missing or invalid configuration:", validation.missing);
    }
  }
}
