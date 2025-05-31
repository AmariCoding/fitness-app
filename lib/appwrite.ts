import { Account, Client, Databases, Storage } from "react-native-appwrite";
import { getConfig, logConfig } from "./config";

// Get AppWrite configuration from environment with fallbacks
const APPWRITE_ENDPOINT = getConfig("APPWRITE_ENDPOINT");
const APPWRITE_PROJECT_ID = getConfig("APPWRITE_PROJECT_ID");

// For rate limiting protection
const RATE_LIMIT_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

// Simple delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize AppWrite client
export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);

// Export databases service for future use
export const databases = new Databases(client);

// Export storage service for image uploads
export const storage = new Storage(client);

// Log configuration in development
if (__DEV__) {
  logConfig();
}

// Helper function to execute AppWrite API calls with retry logic
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delayMs = RATE_LIMIT_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // Check if this is a rate limit error
    if (
      retries > 0 &&
      (error?.code === 429 || error?.message?.includes("rate limit"))
    ) {
      console.warn(
        `Rate limit hit, retrying after ${delayMs}ms... (${retries} retries left)`
      );
      await delay(delayMs);
      // Exponential backoff
      return executeWithRetry(operation, retries - 1, delayMs * 2);
    }

    // Not a rate limit error or out of retries, rethrow
    throw error;
  }
}

// Function to check AppWrite connectivity
export async function checkAppWriteConnection() {
  try {
    // Try to get the current session with retry logic
    await executeWithRetry(() => account.get());
    console.log("AppWrite connection successful! User is authenticated.");
    return { success: true, message: "Connected and authenticated" };
  } catch (error: any) {
    // Check if this is just an authentication error (expected when not logged in)
    if (
      error?.message?.includes("missing scope") ||
      error?.message?.includes("general_unauthorized")
    ) {
      console.log("AppWrite connection successful! (Not authenticated)");
      return { success: true, message: "Connected but not authenticated" };
    }

    // Real connection error
    console.error("AppWrite connection failed:", error);
    return {
      success: false,
      message: `Connection failed: ${error?.message || "Unknown error"}`,
      error,
    };
  }
}
