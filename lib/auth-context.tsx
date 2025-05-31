import { createContext, useContext, useEffect, useState } from "react";
import { AppwriteException, ID, Models } from "react-native-appwrite";
import { account, executeWithRetry } from "./appwrite";

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoadingUser: boolean;
  isNewUser: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<string | null>;
  clearNewUserFlag: () => void;
  requestPasswordReset: (email: string) => Promise<string | null>;
  verifyOtpAndGetUserId: (
    email: string,
    otp: string
  ) => Promise<{ userId: string; secret: string }>;
  resetPassword: (
    userId: string,
    secret: string,
    newPassword: string
  ) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const session = await executeWithRetry(() => account.get());
      setUser(session);
    } catch (error) {
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
      await executeWithRetry(() =>
        account.create(ID.unique(), email, password)
      );
      const signInResult = await signIn(email, password);
      if (!signInResult) {
        setIsNewUser(true);
      }
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
      await executeWithRetry(() =>
        account.createEmailPasswordSession(email, password)
      );
      const session = await executeWithRetry(() => account.get());
      setUser(session);
      setIsNewUser(false);
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
      await executeWithRetry(() => account.deleteSession("current"));
      setUser(null);
      setIsNewUser(false);
    } catch (error) {
      if (
        error instanceof AppwriteException &&
        error.message.includes("general_unauthorized")
      ) {
        console.log("No active session to delete");
      } else {
        console.error("Error signing out:", error);
      }
      setUser(null);
      setIsNewUser(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await executeWithRetry(() =>
        account.updatePassword(newPassword, currentPassword)
      );
      return null;
    } catch (error) {
      if (error instanceof AppwriteException) {
        if (
          error.code === 401 ||
          error.message.includes("user_invalid_credentials")
        ) {
          return "Current password is incorrect. Please try again.";
        } else if (
          error.code === 400 ||
          error.message.includes("password_recently_used")
        ) {
          return "This password was recently used. Please choose a different password.";
        } else if (
          error.code === 400 ||
          error.message.includes("password_personal_data")
        ) {
          return "Password cannot contain personal information. Please choose a different password.";
        } else if (error.code === 429 || error.message.includes("rate_limit")) {
          return "Too many requests. Please wait a moment before trying again.";
        } else {
          return error.message || "Failed to change password";
        }
      } else if (error instanceof Error) {
        return error.message;
      } else {
        return "An unknown error occurred while changing password";
      }
    }
  };

  const clearNewUserFlag = () => {
    setIsNewUser(false);
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await executeWithRetry(() =>
        account.createRecovery(
          email,
          "http://localhost:3000/reset" // The URL format will contain the secret as OTP
        )
      );
      return null;
    } catch (error) {
      if (error instanceof AppwriteException) {
        if (error.code === 404 || error.message.includes("user_not_found")) {
          return "No account found with this email address.";
        } else if (error.code === 429 || error.message.includes("rate_limit")) {
          return "Too many requests. Please wait a moment before trying again.";
        } else {
          return error.message || "Failed to send verification code";
        }
      } else if (error instanceof Error) {
        return error.message;
      } else {
        return "An unknown error occurred while sending verification code";
      }
    }
  };

  const verifyOtpAndGetUserId = async (email: string, otp: string) => {
    try {
      const testUrl = `http://localhost:3000/reset?userId=temp&secret=${otp}`;
      const url = new URL(testUrl);
      const secret = url.searchParams.get("secret");

      if (!secret || secret !== otp) {
        throw new Error("Invalid OTP format");
      }

      return { userId: email, secret: otp };
    } catch (error) {
      throw new Error("Invalid verification code");
    }
  };

  const resetPassword = async (
    userId: string,
    secret: string,
    newPassword: string
  ) => {
    try {
      await executeWithRetry(() =>
        account.updateRecovery(userId, secret, newPassword)
      );

      return null;
    } catch (error) {
      if (error instanceof AppwriteException) {
        if (
          error.code === 401 ||
          error.message.includes("user_invalid_token") ||
          error.message.includes("user_token_expired")
        ) {
          return "Invalid or expired verification code. Please request a new one.";
        } else if (
          error.code === 400 ||
          error.message.includes("password_recently_used")
        ) {
          return "This password was recently used. Please choose a different password.";
        } else if (error.code === 429 || error.message.includes("rate_limit")) {
          return "Too many requests. Please wait a moment before trying again.";
        } else {
          return error.message || "Failed to reset password";
        }
      } else if (error instanceof Error) {
        return error.message;
      } else {
        return "An unknown error occurred while resetting password";
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUser,
        isNewUser,
        signUp,
        signIn,
        signOut,
        changePassword,
        clearNewUserFlag,
        requestPasswordReset,
        verifyOtpAndGetUserId,
        resetPassword,
      }}
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
