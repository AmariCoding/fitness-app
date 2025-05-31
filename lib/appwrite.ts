import { Account, Client, Databases, Storage } from "react-native-appwrite";
import { getConfig, logConfig } from "./config";

const APPWRITE_ENDPOINT = getConfig("APPWRITE_ENDPOINT");
const APPWRITE_PROJECT_ID = getConfig("APPWRITE_PROJECT_ID");

const RATE_LIMIT_DELAY = 2000;
const MAX_RETRIES = 3;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);

export const databases = new Databases(client);

export const storage = new Storage(client);

if (__DEV__) {
  logConfig();
}

export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delayMs = RATE_LIMIT_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (
      retries > 0 &&
      (error?.code === 429 || error?.message?.includes("rate limit"))
    ) {
      console.warn(
        `Rate limit hit, retrying after ${delayMs}ms... (${retries} retries left)`
      );
      await delay(delayMs);
      return executeWithRetry(operation, retries - 1, delayMs * 2);
    }

    throw error;
  }
}

export async function checkAppWriteConnection() {
  try {
    await executeWithRetry(() => account.get());
    console.log("AppWrite connection successful! User is authenticated.");
    return { success: true, message: "Connected and authenticated" };
  } catch (error: any) {
    if (
      error?.message?.includes("missing scope") ||
      error?.message?.includes("general_unauthorized")
    ) {
      console.log("AppWrite connection successful! (Not authenticated)");
      return { success: true, message: "Connected but not authenticated" };
    }

    console.error("AppWrite connection failed:", error);
    return {
      success: false,
      message: `Connection failed: ${error?.message || "Unknown error"}`,
      error,
    };
  }
}
