import { ID, Query } from "react-native-appwrite";
import { client, databases, executeWithRetry, storage } from "./appwrite";

export const DATABASE_ID = "fit-app-db";
export const WORKOUT_PROGRESS_COLLECTION_ID = "workout-progress";
export const USER_STATS_COLLECTION_ID = "user-stats";
export const PROGRESS_PHOTOS_COLLECTION_ID = "progress-photos";

export const PROGRESS_PHOTOS_BUCKET_ID = "progress-photos-bucket";

export interface WorkoutProgress {
  $id?: string;
  userId: string;
  workoutId: string;
  workoutTitle: string;
  workoutCategory: "mental" | "physical";
  completedAt: string;
  duration: number; // in seconds
  exercisesCompleted: number;
  totalExercises: number;
  difficulty: string;
}

export interface UserStats {
  $id?: string;
  userId: string;
  totalWorkouts: number;
  totalMinutes: number;
  mentalWorkouts: number;
  physicalWorkouts: number;
  favoriteCategory: string;
  currentStreak: number;
  lastWorkoutDate: string;
  updatedAt: string;
}

export type ProgressPhoto = {
  $id: string;
  userId: string;
  fileId: string;
  fileUrl: string;
  title: string;
  description?: string;
  weight?: number;
  bodyPart: "front" | "side" | "back" | "other";
  uploadedAt: string;
};

export async function saveWorkoutProgress(
  progressData: Omit<WorkoutProgress, "$id">
): Promise<WorkoutProgress> {
  try {
    const result = await executeWithRetry(() =>
      databases.createDocument(
        DATABASE_ID,
        WORKOUT_PROGRESS_COLLECTION_ID,
        ID.unique(),
        progressData
      )
    );

    await updateUserStats(progressData.userId, progressData);

    return result as unknown as WorkoutProgress;
  } catch (error) {
    console.error("Error saving workout progress:", error);
    throw error;
  }
}

export async function getWorkoutHistory(
  userId: string
): Promise<WorkoutProgress[]> {
  try {
    const result = await executeWithRetry(() =>
      databases.listDocuments(DATABASE_ID, WORKOUT_PROGRESS_COLLECTION_ID, [
        Query.equal("userId", userId),
        Query.orderDesc("completedAt"),
      ])
    );

    return result.documents as unknown as WorkoutProgress[];
  } catch (error) {
    console.error("Error fetching workout history:", error);
    throw error;
  }
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    const result = await executeWithRetry(() =>
      databases.listDocuments(DATABASE_ID, USER_STATS_COLLECTION_ID, [
        Query.equal("userId", userId),
      ])
    );

    if (result.documents.length > 0) {
      return result.documents[0] as unknown as UserStats;
    }

    return await createInitialUserStats(userId);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

export async function createInitialUserStats(
  userId: string
): Promise<UserStats> {
  const initialStats: Omit<UserStats, "$id"> = {
    userId,
    totalWorkouts: 0,
    totalMinutes: 0,
    mentalWorkouts: 0,
    physicalWorkouts: 0,
    favoriteCategory: "mental",
    currentStreak: 0,
    lastWorkoutDate: "",
    updatedAt: new Date().toISOString(),
  };

  try {
    const result = await executeWithRetry(() =>
      databases.createDocument(
        DATABASE_ID,
        USER_STATS_COLLECTION_ID,
        ID.unique(),
        initialStats
      )
    );

    return result as unknown as UserStats;
  } catch (error) {
    console.error("Error creating initial user stats:", error);
    throw error;
  }
}

export async function updateUserStats(
  userId: string,
  workoutData: Omit<WorkoutProgress, "$id">
): Promise<void> {
  try {
    const currentStats = await getUserStats(userId);
    if (!currentStats) return;

    const workoutDurationMinutes = Math.round(workoutData.duration / 60);
    const today = new Date().toISOString().split("T")[0];
    const lastWorkoutDate = currentStats.lastWorkoutDate.split("T")[0];

    // Calculate streak
    let newStreak = currentStats.currentStreak;
    if (lastWorkoutDate) {
      const daysDiff = Math.floor(
        (new Date(today).getTime() - new Date(lastWorkoutDate).getTime()) /
          (1000 * 3600 * 24)
      );
      if (daysDiff === 1) {
        newStreak += 1; // Consecutive day
      } else if (daysDiff === 0) {
        // Same day, keep streak
      } else {
        newStreak = 1; // Reset streak
      }
    } else {
      newStreak = 1; // First workout
    }

    const updatedStats: Partial<UserStats> = {
      totalWorkouts: currentStats.totalWorkouts + 1,
      totalMinutes: currentStats.totalMinutes + workoutDurationMinutes,
      mentalWorkouts:
        workoutData.workoutCategory === "mental"
          ? currentStats.mentalWorkouts + 1
          : currentStats.mentalWorkouts,
      physicalWorkouts:
        workoutData.workoutCategory === "physical"
          ? currentStats.physicalWorkouts + 1
          : currentStats.physicalWorkouts,
      currentStreak: newStreak,
      lastWorkoutDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Determine favorite category
    if (updatedStats.mentalWorkouts! > updatedStats.physicalWorkouts!) {
      updatedStats.favoriteCategory = "mental";
    } else if (updatedStats.physicalWorkouts! > updatedStats.mentalWorkouts!) {
      updatedStats.favoriteCategory = "physical";
    }

    await executeWithRetry(() =>
      databases.updateDocument(
        DATABASE_ID,
        USER_STATS_COLLECTION_ID,
        currentStats.$id!,
        updatedStats
      )
    );
  } catch (error) {
    console.error("Error updating user stats:", error);
  }
}

export async function getWorkoutStats(userId: string) {
  try {
    const [userStats, recentWorkouts] = await Promise.all([
      getUserStats(userId),
      getWorkoutHistory(userId), // Last 7 workouts
    ]);

    return {
      userStats,
      recentWorkouts,
      weeklyProgress: calculateWeeklyProgress(recentWorkouts),
    };
  } catch (error) {
    console.error("Error fetching workout stats:", error);
    throw error;
  }
}

function calculateWeeklyProgress(workouts: WorkoutProgress[]) {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const thisWeekWorkouts = workouts.filter(
    (workout) => new Date(workout.completedAt) >= weekAgo
  );

  return {
    totalWorkouts: thisWeekWorkouts.length,
    totalMinutes: Math.round(
      thisWeekWorkouts.reduce((sum, w) => sum + w.duration, 0) / 60
    ),
    mentalWorkouts: thisWeekWorkouts.filter(
      (w) => w.workoutCategory === "mental"
    ).length,
    physicalWorkouts: thisWeekWorkouts.filter(
      (w) => w.workoutCategory === "physical"
    ).length,
  };
}

// Progress Photos Functions
export async function uploadProgressPhoto(
  uri: string,
  progressData: Omit<ProgressPhoto, "$id" | "fileId" | "fileUrl">
): Promise<ProgressPhoto> {
  try {
    // For React Native, create file object compatible with Appwrite
    const fileName = `progress-${Date.now()}.jpg`;
    const file = {
      name: fileName,
      type: "image/jpeg",
      size: 0, // Will be determined by Appwrite
      uri: uri,
    };

    console.log("Uploading file to storage...", fileName);

    // Upload file to Appwrite Storage
    const fileUpload = await executeWithRetry(() =>
      storage.createFile(PROGRESS_PHOTOS_BUCKET_ID, ID.unique(), file)
    );

    console.log("File uploaded successfully:", fileUpload.$id);

    // Generate file URL - try multiple approaches for maximum compatibility
    let fileUrlString: string;

    try {
      // First try: Use getFileView method
      const fileUrl = storage.getFileView(
        PROGRESS_PHOTOS_BUCKET_ID,
        fileUpload.$id
      );
      fileUrlString =
        typeof fileUrl === "string"
          ? fileUrl
          : fileUrl.href || fileUrl.toString();
      console.log("Generated file URL using getFileView:", fileUrlString);
    } catch (urlError) {
      console.warn("getFileView failed, constructing URL manually:", urlError);
      // Fallback: Construct URL manually (as suggested in Appwrite community)
      const endpoint = client.config.endpoint || "https://cloud.appwrite.io/v1";
      fileUrlString = `${endpoint}/storage/buckets/${PROGRESS_PHOTOS_BUCKET_ID}/files/${fileUpload.$id}/view`;
      console.log("Generated file URL manually:", fileUrlString);
    }

    // Save progress photo metadata to database
    const photoData = {
      ...progressData,
      fileId: fileUpload.$id,
      fileUrl: fileUrlString,
    };

    console.log("Saving photo metadata to database...");

    const result = await executeWithRetry(() =>
      databases.createDocument(
        DATABASE_ID,
        PROGRESS_PHOTOS_COLLECTION_ID,
        ID.unique(),
        photoData
      )
    );

    console.log("Photo metadata saved successfully:", result.$id);

    return result as unknown as ProgressPhoto;
  } catch (error) {
    console.error("Error uploading progress photo:", error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}

export async function getUserProgressPhotos(
  userId: string
): Promise<ProgressPhoto[]> {
  try {
    const result = await executeWithRetry(() =>
      databases.listDocuments(DATABASE_ID, PROGRESS_PHOTOS_COLLECTION_ID, [
        Query.equal("userId", userId),
        Query.orderDesc("uploadedAt"),
      ])
    );

    return result.documents as unknown as ProgressPhoto[];
  } catch (error) {
    console.error("Error fetching progress photos:", error);
    throw error;
  }
}

export async function deleteProgressPhoto(
  photoId: string,
  fileId: string
): Promise<void> {
  try {
    // Delete from storage
    await executeWithRetry(() =>
      storage.deleteFile(PROGRESS_PHOTOS_BUCKET_ID, fileId)
    );

    // Delete from database
    await executeWithRetry(() =>
      databases.deleteDocument(
        DATABASE_ID,
        PROGRESS_PHOTOS_COLLECTION_ID,
        photoId
      )
    );
  } catch (error) {
    console.error("Error deleting progress photo:", error);
    throw error;
  }
}

// Debug function to test file accessibility
export async function testFileAccess(
  fileId: string
): Promise<{ accessible: boolean; url: string; error?: string }> {
  try {
    // Try multiple URL generation methods
    const methods = [
      () => {
        const fileUrl = storage.getFileView(PROGRESS_PHOTOS_BUCKET_ID, fileId);
        return typeof fileUrl === "string"
          ? fileUrl
          : fileUrl.href || fileUrl.toString();
      },
      () => {
        const endpoint =
          client.config.endpoint || "https://cloud.appwrite.io/v1";
        return `${endpoint}/storage/buckets/${PROGRESS_PHOTOS_BUCKET_ID}/files/${fileId}/view`;
      },
      () => {
        const endpoint =
          client.config.endpoint || "https://cloud.appwrite.io/v1";
        return `${endpoint}/storage/buckets/${PROGRESS_PHOTOS_BUCKET_ID}/files/${fileId}/preview`;
      },
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        const url = methods[i]();
        console.log(`Testing URL method ${i + 1}:`, url);

        // Test if URL is accessible (basic fetch test)
        const response = await fetch(url, { method: "HEAD" });
        if (response.ok) {
          console.log(`✅ URL method ${i + 1} successful:`, url);
          return { accessible: true, url };
        } else {
          console.log(
            `❌ URL method ${i + 1} failed with status:`,
            response.status
          );
        }
      } catch (methodError) {
        console.log(`❌ URL method ${i + 1} failed:`, methodError);
      }
    }

    return {
      accessible: false,
      url: methods[0](),
      error: "All URL methods failed accessibility test",
    };
  } catch (error) {
    console.error("Error testing file access:", error);
    return {
      accessible: false,
      url: "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
