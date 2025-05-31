# Appwrite Database Setup for Fit App

## Step 1: Create Database

1. Go to your Appwrite Console (https://cloud.appwrite.io/)
2. Navigate to your project
3. Click on "Databases" in the left sidebar
4. Click "Create Database"
5. Set Database ID: `fit-app-db`
6. Set Name: `Fit App Database`
7. Click "Create"

## Step 2: Create Collections

### Collection 1: Workout Progress

1. In your database, click "Create Collection"
2. Set Collection ID: `workout-progress`
3. Set Name: `Workout Progress`
4. Click "Create"

**Add the following attributes:**

- `userId` (String, 36 chars, Required)
- `workoutId` (String, 50 chars, Required)
- `workoutTitle` (String, 100 chars, Required)
- `workoutCategory` (Enum: ["mental", "physical"], Required)
- `completedAt` (DateTime, Required)
- `duration` (Integer, Required) - seconds
- `exercisesCompleted` (Integer, Required)
- `totalExercises` (Integer, Required)
- `difficulty` (String, 20 chars, Required)

**Indexes to create:**

- Key: `userId`, Type: `key`, Attributes: [`userId`]
- Key: `userId_date`, Type: `key`, Attributes: [`userId`, `completedAt`]

### Collection 2: User Stats

1. Create another collection
2. Set Collection ID: `user-stats`
3. Set Name: `User Stats`
4. Click "Create"

**Add the following attributes:**

- `userId` (String, 36 chars, Required, Unique)
- `totalWorkouts` (Integer, Required, Default: 0)
- `totalMinutes` (Integer, Required, Default: 0)
- `mentalWorkouts` (Integer, Required, Default: 0)
- `physicalWorkouts` (Integer, Required, Default: 0)
- `favoriteCategory` (String, 20 chars, Required, Default: "mental")
- `currentStreak` (Integer, Required, Default: 0)
- `lastWorkoutDate` (DateTime, Required)
- `updatedAt` (DateTime, Required)

**Indexes to create:**

- Key: `userId`, Type: `unique`, Attributes: [`userId`]

## Step 3: Set Permissions

### For both collections, set these permissions:

**workout-progress collection:**

- Create: `users` (authenticated users can create their own records)
- Read: `users` (authenticated users can read their own records)
- Update: `users` (authenticated users can update their own records)
- Delete: `users` (authenticated users can delete their own records)

**user-stats collection:**

- Create: `users` (authenticated users can create their own stats)
- Read: `users` (authenticated users can read their own stats)
- Update: `users` (authenticated users can update their own stats)
- Delete: `users` (authenticated users can delete their own stats)

## Step 4: Test the Setup

After creating the database and collections, your app should automatically:

1. Save workout progress when completing sessions
2. Display real user statistics on the home screen
3. Track streaks and workout history
4. Show personalized progress data

## Database Schema Summary

```
fit-app-db/
├── workout-progress/
│   ├── userId (string)
│   ├── workoutId (string)
│   ├── workoutTitle (string)
│   ├── workoutCategory (enum)
│   ├── completedAt (datetime)
│   ├── duration (integer)
│   ├── exercisesCompleted (integer)
│   ├── totalExercises (integer)
│   └── difficulty (string)
└── user-stats/
    ├── userId (string, unique)
    ├── totalWorkouts (integer)
    ├── totalMinutes (integer)
    ├── mentalWorkouts (integer)
    ├── physicalWorkouts (integer)
    ├── favoriteCategory (string)
    ├── currentStreak (integer)
    ├── lastWorkoutDate (datetime)
    └── updatedAt (datetime)
```

## Important Notes

1. Make sure your Database ID matches exactly: `fit-app-db`
2. Collection IDs must match exactly: `workout-progress` and `user-stats`
3. All attribute names must match exactly as specified
4. Set appropriate permissions for security
5. The app will automatically create initial user stats when a user completes their first workout
