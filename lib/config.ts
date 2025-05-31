const DEFAULT_CONFIG = {
  APPWRITE_ENDPOINT: "https://cloud.appwrite.io/v1",
  APPWRITE_PROJECT_ID: "your-project-id",
};

export function getConfig(key: keyof typeof DEFAULT_CONFIG): string {
  const envKey = `EXPO_PUBLIC_${key}`;
  return process.env[envKey] || DEFAULT_CONFIG[key];
}

export function validateConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  const requiredKeys: (keyof typeof DEFAULT_CONFIG)[] = [
    "APPWRITE_ENDPOINT",
    "APPWRITE_PROJECT_ID",
  ];

  for (const key of requiredKeys) {
    const value = getConfig(key);
    if (!value || value.includes("your-") || value === DEFAULT_CONFIG[key]) {
      missing.push(key);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function getAllConfig() {
  return {
    APPWRITE_ENDPOINT: getConfig("APPWRITE_ENDPOINT"),
    APPWRITE_PROJECT_ID: getConfig("APPWRITE_PROJECT_ID"),
  };
}

export function logConfig() {
  if (__DEV__) {
    console.log("App Configuration:", getAllConfig());
    const validation = validateConfig();
    if (!validation.valid) {
      console.warn("⚠️ Missing or invalid configuration:", validation.missing);
    }
  }
}
