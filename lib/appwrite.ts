import { Account, Client, Databases, Storage } from "react-native-appwrite";
import { getConfig } from "./config";

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
