import { createContext, useContext, useEffect, useState } from "react";
import { AppwriteException, ID, Models } from "react-native-appwrite";
import { account, executeWithRetry } from "./appwrite";

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoadingUser: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      // Using executeWithRetry to handle rate limiting
      const session = await executeWithRetry(() => account.get());
      setUser(session);
    } catch (error) {
      // Handle AppWrite permission error - this is expected if not logged in
      if (
        error instanceof AppwriteException &&
        (error.message.includes("missing scope") ||
          error.message.includes("general_unauthorized"))
      ) {
        console.log("User not logged in or session expired");
      } else {
        console.error("Error fetching user:", error);
      }
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Using executeWithRetry to handle rate limiting
      await executeWithRetry(() =>
        account.create(ID.unique(), email, password)
      );
      const signInResult = await signIn(email, password);
      return signInResult;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An unknown error occurred during sign up";
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Using executeWithRetry to handle rate limiting
      await executeWithRetry(() =>
        account.createEmailPasswordSession(email, password)
      );
      const session = await executeWithRetry(() => account.get());
      setUser(session);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An unknown error occurred during sign in";
    }
  };

  const signOut = async () => {
    try {
      // Using executeWithRetry to handle rate limiting
      await executeWithRetry(() => account.deleteSession("current"));
      setUser(null);
    } catch (error) {
      // Silently handle session deletion errors (e.g., if already logged out)
      if (
        error instanceof AppwriteException &&
        error.message.includes("general_unauthorized")
      ) {
        console.log("No active session to delete");
      } else {
        console.error("Error signing out:", error);
      }
      // Always set user to null on signOut attempt, even if API call fails
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoadingUser, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
