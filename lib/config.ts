const DEFAULT_CONFIG = {
  APPWRITE_ENDPOINT: "https://cloud.appwrite.io/v1",
  APPWRITE_PROJECT_ID: "your-project-id",
};

export function getConfig(key: keyof typeof DEFAULT_CONFIG): string {
  let envValue: string | undefined;

  if (key === "APPWRITE_ENDPOINT") {
    envValue = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
  } else if (key === "APPWRITE_PROJECT_ID") {
    envValue = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
  }

  return envValue || DEFAULT_CONFIG[key];
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
