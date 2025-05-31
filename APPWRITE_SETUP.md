# Appwrite Database Setup for Fit App

## Step 1: Create Database

1. Go to your Appwrite Console (https://cloud.appwrite.io/)
2. Navigate to your project
3. Click on "Databases" in the left sidebar
4. Click "Create Database"
5. Set Database ID: `fit-app-db`
6. Set Name: `Fit App Database`
7. Click "Create"

## Step 2: Create Storage Bucket

1. In your Appwrite Console, click on "Storage" in the left sidebar
2. Click "Create Bucket"
3. Set Bucket ID: `progress-photos-bucket`
4. Set Name: `Progress Photos`
5. Under "Permissions", set:
   - **Read**: `Any` (allows anyone to view the images - required for mobile compatibility)
   - **Create**: `users` (authenticated users can upload their photos)
   - **Update**: `users` (authenticated users can update their photos)
   - **Delete**: `users` (authenticated users can delete their photos)
6. Under "File Extensions", add: `jpg, jpeg, png, webp` (allowed image formats)
7. Set "Maximum File Size": `10MB`
8. Click "Create"

**Important Note about Permissions**:

- The **Read** permission must be set to `Any` for images to be viewable on mobile devices
- This allows the generated file URLs to be accessible without authentication
- Only authenticated users can upload/modify photos, but anyone with the URL can view them
- This is standard for progress photo sharing functionality

## Step 3: Create Collections

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

### Collection 3: Progress Photos

1. Create another collection
2. Set Collection ID: `progress-photos`
3. Set Name: `Progress Photos`
4. Click "Create"

**Add the following attributes:**

- `userId` (String, 36 chars, Required)
- `fileId` (String, 50 chars, Required) - Reference to storage file
- `fileUrl` (String, 500 chars, Required) - File URL for display
- `title` (String, 100 chars, Required)
- `description` (String, 500 chars, Optional)
- `weight` (Float, Optional) - User weight at time of photo
- `bodyPart` (Enum: ["front", "side", "back", "other"], Required)
- `uploadedAt` (DateTime, Required)

**Indexes to create:**

- Key: `userId`, Type: `key`, Attributes: [`userId`]
- Key: `userId_date`, Type: `key`, Attributes: [`userId`, `uploadedAt`]

## Step 4: Set Permissions

### For all collections, set these permissions:

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

**progress-photos collection:**

- Create: `users` (authenticated users can create their own progress photos)
- Read: `users` (authenticated users can read their own progress photos)
- Update: `users` (authenticated users can update their own progress photos)
- Delete: `users` (authenticated users can delete their own progress photos)

## Step 5: Test the Setup

After creating the database, storage, and collections, your app should automatically:

1. Save workout progress when completing sessions
2. Display real user statistics on the home screen
3. Track streaks and workout history
4. Show personalized progress data
5. Allow users to upload progress photos using camera or photo library
6. Display progress photos in a gallery format
7. Enable photo deletion and management

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
├── user-stats/
│   ├── userId (string, unique)
│   ├── totalWorkouts (integer)
│   ├── totalMinutes (integer)
│   ├── mentalWorkouts (integer)
│   ├── physicalWorkouts (integer)
│   ├── favoriteCategory (string)
│   ├── currentStreak (integer)
│   ├── lastWorkoutDate (datetime)
│   └── updatedAt (datetime)
└── progress-photos/
    ├── userId (string)
    ├── fileId (string)
    ├── fileUrl (string)
    ├── title (string)
    ├── description (string, optional)
    ├── weight (float, optional)
    ├── bodyPart (enum)
    └── uploadedAt (datetime)
```

## Storage Buckets

```
progress-photos-bucket/
└── User uploaded progress photos (jpg, jpeg, png, webp)
```

## Important Notes

1. Make sure your Database ID matches exactly: `fit-app-db`
2. Collection IDs must match exactly: `workout-progress`, `user-stats`, and `progress-photos`
3. Storage Bucket ID must match exactly: `progress-photos-bucket`
4. All attribute names must match exactly as specified
5. Set appropriate permissions for security
6. Configure file size limits and allowed extensions for storage
7. Progress photos are automatically linked to storage files via fileId
