import { ID, Query } from "react-native-appwrite";
import { databases, executeWithRetry } from "./appwrite";

// Database and Collection IDs - you'll need to create these in Appwrite Console
export const DATABASE_ID = "fit-app-db";
export const WORKOUT_PROGRESS_COLLECTION_ID = "workout-progress";
export const USER_STATS_COLLECTION_ID = "user-stats";

// Types for our database models
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

// Workout Progress Functions
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

    // Update user stats after saving progress
    await updateUserStats(progressData.userId, progressData);

    return result as WorkoutProgress;
  } catch (error) {
    console.error("Error saving workout progress:", error);
    throw error;
  }
}

export async function getUserWorkoutHistory(
  userId: string,
  limit = 20
): Promise<WorkoutProgress[]> {
  try {
    const result = await executeWithRetry(() =>
      databases.listDocuments(DATABASE_ID, WORKOUT_PROGRESS_COLLECTION_ID, [
        Query.equal("userId", userId),
        Query.orderDesc("completedAt"),
        Query.limit(limit),
      ])
    );

    return result.documents as WorkoutProgress[];
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
      return result.documents[0] as UserStats;
    }

    // Create initial stats if none exist
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

    return result as UserStats;
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
    // Don't throw error to avoid breaking the workout completion flow
  }
}

// Get workout stats for dashboard
export async function getWorkoutStats(userId: string) {
  try {
    const [userStats, recentWorkouts] = await Promise.all([
      getUserStats(userId),
      getUserWorkoutHistory(userId, 7), // Last 7 workouts
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
