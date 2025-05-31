import { useAuth } from "@/lib/auth-context";
import { saveWorkoutProgress } from "@/lib/database";
import { useAppTheme } from "@/lib/theme-context";
import { Oswald_700Bold, useFonts } from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  IconButton,
  ProgressBar,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Exercise = {
  name: string;
  duration?: string;
  reps?: string;
  description?: string;
  instructions?: string[];
  quote?: string;
  quoteAuthor?: string;
};

type Workout = {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  image: string;
  category: "physical" | "mental";
  benefits?: string[];
  exercises?: string[];
  quote?: string;
  quoteAuthor?: string;
};

export default function WorkoutSessionScreen() {
  const { user } = useAuth();
  const { theme } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  // Parse workout data from params
  const workout: Workout = params.workout
    ? JSON.parse(params.workout as string)
    : null;

  // Convert simple exercise strings to detailed exercise objects
  const detailedExercises: Exercise[] =
    workout?.exercises?.map((exerciseName, index) => {
      // Enhanced exercise details based on workout category and exercise name
      const getExerciseDetails = (name: string, category: string): Exercise => {
        const baseExercise = { name };

        if (category === "mental") {
          // Mental exercises with time-based durations
          if (name.toLowerCase().includes("meditation")) {
            return {
              ...baseExercise,
              duration: "3-5 minutes",
              description: "Focus on your breathing and clear your mind",
              instructions: [
                "Find a comfortable seated position",
                "Close your eyes and take deep breaths",
                "Focus on the sensation of breathing",
                "When thoughts arise, gently return focus to breath",
                "Continue until the timer ends",
              ],
              quote: "Peace comes from within. Do not seek it without.",
              quoteAuthor: "Buddha",
            };
          } else if (
            name.toLowerCase().includes("focus") ||
            name.toLowerCase().includes("tracking")
          ) {
            return {
              ...baseExercise,
              duration: "2-3 minutes",
              description: "Enhance your concentration and visual tracking",
              instructions: [
                "Sit comfortably with good posture",
                "Focus on a single point in front of you",
                "Maintain unwavering attention",
                "Notice when your mind wanders and gently refocus",
                "Gradually increase focus intensity",
              ],
              quote:
                "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.",
              quoteAuthor: "Alexander Graham Bell",
            };
          } else if (
            name.toLowerCase().includes("decision") ||
            name.toLowerCase().includes("scenario")
          ) {
            return {
              ...baseExercise,
              duration: "5-8 minutes",
              description: "Practice quick decision making under pressure",
              instructions: [
                "Review the presented scenario carefully",
                "Identify key decision points",
                "Consider multiple options quickly",
                "Make decisive choices within time limits",
                "Reflect on decision quality",
              ],
              quote:
                "In any moment of decision, the best thing you can do is the right thing.",
              quoteAuthor: "Theodore Roosevelt",
            };
          } else if (
            name.toLowerCase().includes("memory") ||
            name.toLowerCase().includes("pattern")
          ) {
            return {
              ...baseExercise,
              duration: "4-6 minutes",
              description: "Strengthen memory recall and pattern recognition",
              instructions: [
                "Study the presented pattern or sequence",
                "Memorize the details carefully",
                "Wait for the recall prompt",
                "Reproduce the pattern accurately",
                "Challenge yourself with increasing complexity",
              ],
              quote: "Memory is the treasury and guardian of all things.",
              quoteAuthor: "Cicero",
            };
          } else if (name.toLowerCase().includes("breathing")) {
            return {
              ...baseExercise,
              duration: "3-4 minutes",
              description: "Controlled breathing for relaxation and focus",
              instructions: [
                "Sit or lie down comfortably",
                "Place one hand on chest, one on belly",
                "Breathe in slowly through nose (4 counts)",
                "Hold your breath (4 counts)",
                "Exhale slowly through mouth (6 counts)",
              ],
              quote:
                "Breath is the bridge which connects life to consciousness.",
              quoteAuthor: "Thich Nhat Hanh",
            };
          } else if (name.toLowerCase().includes("visualization")) {
            return {
              ...baseExercise,
              duration: "5-7 minutes",
              description: "Mental imagery for performance enhancement",
              instructions: [
                "Close your eyes and relax completely",
                "Visualize your ideal performance scenario",
                "Engage all senses in the visualization",
                "See yourself succeeding confidently",
                "Feel the emotions of success",
              ],
              quote: "Visualization is daydreaming with a purpose.",
              quoteAuthor: "Bo Bennett",
            };
          } else if (
            name.toLowerCase().includes("prayer") ||
            name.toLowerCase().includes("spiritual")
          ) {
            return {
              ...baseExercise,
              duration: "5-10 minutes",
              description: "Spiritual reflection and inner peace",
              instructions: [
                "Find a quiet, peaceful space",
                "Begin with gratitude and thanksgiving",
                "Reflect on your purpose and values",
                "Seek guidance and strength",
                "End with positive affirmations",
              ],
              quote: "Prayer is not asking. It is a longing of the soul.",
              quoteAuthor: "Mahatma Gandhi",
            };
          }
        } else if (category === "physical") {
          // Physical exercises with rep-based or time-based structure
          if (name.toLowerCase().includes("burpees")) {
            return {
              ...baseExercise,
              reps: "30 seconds",
              description: "Full body explosive exercise",
              instructions: [
                "Start in standing position",
                "Drop to squat, hands on ground",
                "Jump feet back to plank position",
                "Do a push-up (optional)",
                "Jump feet back to squat, then jump up with arms overhead",
              ],
              quote: "The body achieves what the mind believes.",
              quoteAuthor: "Napoleon Hill",
            };
          } else if (name.toLowerCase().includes("mountain climbers")) {
            return {
              ...baseExercise,
              reps: "45 seconds",
              description: "Cardio and core strengthening exercise",
              instructions: [
                "Start in plank position",
                "Bring right knee toward chest",
                "Quickly switch legs",
                "Continue alternating at rapid pace",
                "Keep core engaged throughout",
              ],
              quote:
                "Every mountain top is within reach if you just keep climbing.",
              quoteAuthor: "Barry Finlay",
            };
          } else if (
            name.toLowerCase().includes("squats") ||
            name.toLowerCase().includes("jump squats")
          ) {
            return {
              ...baseExercise,
              reps: name.toLowerCase().includes("jump")
                ? "30 seconds"
                : "15 reps",
              description: "Lower body strength and power",
              instructions: [
                "Stand with feet shoulder-width apart",
                "Lower body by bending knees and hips",
                "Keep chest up and knees behind toes",
                name.toLowerCase().includes("jump")
                  ? "Explosively jump up at the top"
                  : "Return to standing position",
                "Repeat for specified duration/reps",
              ],
              quote:
                "Strength does not come from winning. Your struggles develop your strengths.",
              quoteAuthor: "Arnold Schwarzenegger",
            };
          } else if (name.toLowerCase().includes("plank")) {
            return {
              ...baseExercise,
              reps: "30-60 seconds",
              description: "Core stability and strength",
              instructions: [
                "Start in push-up position",
                "Lower to forearms if doing forearm plank",
                "Keep body in straight line",
                "Engage core muscles",
                "Hold position for specified time",
              ],
              quote: "Core strength is the foundation of all movement.",
              quoteAuthor: "Pilates Principle",
            };
          } else if (
            name.toLowerCase().includes("push-ups") ||
            name.toLowerCase().includes("push ups")
          ) {
            return {
              ...baseExercise,
              reps: "15 reps",
              description: "Upper body and core strength",
              instructions: [
                "Start in plank position",
                "Lower chest toward ground",
                "Keep body in straight line",
                "Push back up to starting position",
                "Modify on knees if needed",
              ],
              quote:
                "Push yourself because no one else is going to do it for you.",
              quoteAuthor: "Unknown",
            };
          } else if (name.toLowerCase().includes("lunges")) {
            return {
              ...baseExercise,
              reps: "12 reps per leg",
              description: "Lower body strength and balance",
              instructions: [
                "Stand with feet hip-width apart",
                "Step forward with one leg",
                "Lower hips until both knees are 90 degrees",
                "Push back to starting position",
                "Alternate legs or complete one side first",
              ],
              quote:
                "Balance is not something you find, it's something you create.",
              quoteAuthor: "Jana Kingsford",
            };
          } else if (name.toLowerCase().includes("deadlifts")) {
            return {
              ...baseExercise,
              reps: "10 reps",
              description: "Full body strength, focus on posterior chain",
              instructions: [
                "Stand with feet hip-width apart",
                "Hold weights in front of thighs",
                "Hinge at hips, lower weights toward ground",
                "Keep back straight and chest up",
                "Drive through heels to return to standing",
              ],
              quote:
                "The deadlift: because picking things up and putting them down is a primal movement.",
              quoteAuthor: "Mark Rippetoe",
            };
          } else if (name.toLowerCase().includes("calf raises")) {
            return {
              ...baseExercise,
              reps: "20 reps",
              description: "Calf muscle strengthening",
              instructions: [
                "Stand with feet hip-width apart",
                "Rise up onto balls of feet",
                "Hold for a moment at the top",
                "Lower back down slowly",
                "Use wall for balance if needed",
              ],
              quote:
                "Every step forward is a step toward achieving something bigger than yourself.",
              quoteAuthor: "Brian Tracy",
            };
          }
        }

        // Default exercise structure
        return {
          ...baseExercise,
          duration: "2-3 minutes",
          description: "Complete this exercise with focus and proper form",
          instructions: [
            "Read the exercise name carefully",
            "Prepare your space and mindset",
            "Execute the exercise with proper form",
            "Focus on quality over quantity",
            "Rest briefly before the next exercise",
          ],
          quote: "Success is where preparation and opportunity meet.",
          quoteAuthor: "Bobby Unser",
        };
      };

      return getExerciseDetails(exerciseName, workout.category);
    }) || [];

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!fontsLoaded || !workout) {
    return null;
  }

  const styles = createStyles(theme);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startSession = () => {
    setIsSessionStarted(true);
    setIsTimerRunning(true);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < detailedExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      completeSession();
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const completeSession = async () => {
    setSessionCompleted(true);
    setIsTimerRunning(false);

    // Save workout progress to database
    if (user && workout) {
      try {
        await saveWorkoutProgress({
          userId: user.$id,
          workoutId: workout.id,
          workoutTitle: workout.title,
          workoutCategory: workout.category,
          completedAt: new Date().toISOString(),
          duration: timer,
          exercisesCompleted: detailedExercises.length,
          totalExercises: detailedExercises.length,
          difficulty: workout.difficulty,
        });
        console.log("Workout progress saved successfully!");
      } catch (error) {
        console.error("Failed to save workout progress:", error);
        // Continue with completion even if save fails
      }
    }
  };

  const exitSession = () => {
    router.back();
  };

  const currentExercise = detailedExercises[currentExerciseIndex];
  const progress =
    detailedExercises.length > 0
      ? (currentExerciseIndex + 1) / detailedExercises.length
      : 0;

  if (sessionCompleted) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Session Complete!</Text>
          <Text style={styles.subheading}>
            Great job, {user?.name || "athlete"}!
          </Text>
        </View>

        <ScrollView style={styles.content}>
          <Card
            style={[
              styles.completionCard,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Card.Content>
              <Text
                style={[
                  styles.completionTitle,
                  { color: theme.colors.primary },
                ]}
              >
                🎉 Workout Completed
              </Text>
              <Text
                style={[
                  styles.completionSubtitle,
                  { color: theme.colors.text },
                ]}
              >
                {workout.title}
              </Text>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text
                    style={[styles.statValue, { color: theme.colors.primary }]}
                  >
                    {formatTime(timer)}
                  </Text>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Time
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text
                    style={[styles.statValue, { color: theme.colors.primary }]}
                  >
                    {detailedExercises.length}
                  </Text>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Exercises
                  </Text>
                </View>
              </View>

              {workout.quote && (
                <View
                  style={[
                    styles.quoteContainer,
                    { backgroundColor: `${theme.colors.primary}15` },
                  ]}
                >
                  <Text
                    style={[styles.quoteText, { color: theme.colors.text }]}
                  >
                    &quot;{workout.quote}&quot;
                  </Text>
                  <Text
                    style={[
                      styles.quoteAuthor,
                      { color: theme.colors.primary },
                    ]}
                  >
                    - {workout.quoteAuthor}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={exitSession}
          >
            Return to Workouts
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!isSessionStarted) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            iconColor="white"
            size={24}
            onPress={exitSession}
            style={styles.backButton}
          />
          <Text style={styles.heading}>Ready to Start?</Text>
          <Text style={styles.subheading}>{workout.title}</Text>
        </View>

        <ScrollView style={styles.content}>
          <Card
            style={[
              styles.workoutPreviewCard,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Card.Content>
              <Text style={[styles.workoutTitle, { color: theme.colors.text }]}>
                {workout.title}
              </Text>
              <Text
                style={[
                  styles.workoutDescription,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {workout.description}
              </Text>

              <View style={styles.workoutMeta}>
                <Text style={styles.metaItem}>{workout.duration}</Text>
                <Text style={styles.metaItem}>{workout.difficulty}</Text>
                <Text style={styles.metaItem}>
                  {detailedExercises.length} exercises
                </Text>
              </View>

              <Text
                style={[styles.exercisesTitle, { color: theme.colors.text }]}
              >
                Today&apos;s Exercises:
              </Text>
              {detailedExercises.map((exercise, index) => (
                <View
                  key={index}
                  style={[
                    styles.exercisePreviewItem,
                    { backgroundColor: `${theme.colors.primary}10` },
                  ]}
                >
                  <Text
                    style={[
                      styles.exerciseNumber,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {index + 1}
                  </Text>
                  <View style={styles.exercisePreviewContent}>
                    <Text
                      style={[
                        styles.exercisePreviewName,
                        { color: theme.colors.text },
                      ]}
                    >
                      {exercise.name}
                    </Text>
                    <Text
                      style={[
                        styles.exercisePreviewMeta,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {exercise.duration || exercise.reps}
                    </Text>
                    {exercise.quote && (
                      <Text
                        style={[
                          styles.exercisePreviewQuote,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        &quot;
                        {exercise.quote.length > 50
                          ? exercise.quote.substring(0, 50) + "..."
                          : exercise.quote}
                        &quot;
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            style={[
              styles.startButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={startSession}
          >
            Start Workout
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <IconButton
          icon="close"
          iconColor="white"
          size={24}
          onPress={exitSession}
          style={styles.backButton}
        />
        <View style={styles.headerContent}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
          <Text style={styles.progressText}>
            Exercise {currentExerciseIndex + 1} of {detailedExercises.length}
          </Text>
        </View>
      </View>

      <ProgressBar
        progress={progress}
        color={theme.colors.primary}
        style={[
          styles.progressBar,
          { backgroundColor: `${theme.colors.primary}30` },
        ]}
      />

      <ScrollView style={styles.content}>
        <Card
          style={[styles.exerciseCard, { backgroundColor: theme.colors.card }]}
        >
          <Card.Content>
            <Text
              style={[styles.exerciseTitle, { color: theme.colors.primary }]}
            >
              {currentExercise.name}
            </Text>
            <Text
              style={[
                styles.exerciseMeta,
                { color: theme.colors.textSecondary },
              ]}
            >
              {currentExercise.duration || currentExercise.reps}
            </Text>
            <Text
              style={[styles.exerciseDescription, { color: theme.colors.text }]}
            >
              {currentExercise.description}
            </Text>

            <View
              style={[
                styles.instructionsContainer,
                { backgroundColor: `${theme.colors.primary}10` },
              ]}
            >
              <Text
                style={[
                  styles.instructionsTitle,
                  { color: theme.colors.primary },
                ]}
              >
                Instructions:
              </Text>
              {currentExercise.instructions?.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <Text
                    style={[
                      styles.instructionNumber,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {index + 1}
                  </Text>
                  <Text
                    style={[
                      styles.instructionText,
                      { color: theme.colors.text },
                    ]}
                  >
                    {instruction}
                  </Text>
                </View>
              ))}
            </View>

            {currentExercise.quote && (
              <View
                style={[
                  styles.exerciseQuoteContainer,
                  { backgroundColor: `${theme.colors.primary}10` },
                ]}
              >
                <Text
                  style={[
                    styles.exerciseQuoteText,
                    { color: theme.colors.text },
                  ]}
                >
                  &quot;{currentExercise.quote}&quot;
                </Text>
                <Text
                  style={[
                    styles.exerciseQuoteAuthor,
                    { color: theme.colors.primary },
                  ]}
                >
                  - {currentExercise.quoteAuthor}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.navigationContainer}>
        <Button
          mode="outlined"
          onPress={previousExercise}
          disabled={currentExerciseIndex === 0}
          style={[styles.navButton, { borderColor: theme.colors.border }]}
          textColor={theme.colors.text}
        >
          Previous
        </Button>

        <Button
          mode="contained"
          onPress={nextExercise}
          style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
        >
          {currentExerciseIndex === detailedExercises.length - 1
            ? "Complete"
            : "Next"}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.primary,
    },
    backButton: {
      position: "absolute",
      top: 16,
      left: 10,
      zIndex: 1,
    },
    headerContent: {
      alignItems: "center",
      marginTop: 10,
    },
    heading: {
      fontFamily: "Oswald_700Bold",
      fontSize: 28,
      color: "white",
      textAlign: "center",
    },
    subheading: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "center",
      marginTop: 4,
    },
    timerText: {
      fontFamily: "Oswald_700Bold",
      fontSize: 36,
      color: "white",
    },
    progressText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.8)",
      marginTop: 4,
    },
    progressBar: {
      height: 4,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    workoutPreviewCard: {
      marginBottom: 20,
      elevation: 4,
    },
    workoutTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 24,
      marginBottom: 8,
    },
    workoutDescription: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 16,
    },
    workoutMeta: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 20,
    },
    metaItem: {
      fontFamily: "Roboto_500Medium",
      fontSize: 12,
      color: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}15`,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: 8,
      marginBottom: 4,
    },
    exercisesTitle: {
      fontFamily: "Roboto_500Medium",
      fontSize: 18,
      marginBottom: 12,
    },
    exercisePreviewItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    exerciseNumber: {
      fontFamily: "Oswald_700Bold",
      fontSize: 16,
      marginRight: 12,
      minWidth: 20,
    },
    exercisePreviewContent: {
      flex: 1,
    },
    exercisePreviewName: {
      fontFamily: "Roboto_500Medium",
      fontSize: 14,
      marginBottom: 2,
    },
    exercisePreviewMeta: {
      fontFamily: "Roboto_400Regular",
      fontSize: 12,
    },
    exercisePreviewQuote: {
      fontFamily: "Roboto_400Regular",
      fontStyle: "italic",
      fontSize: 12,
    },
    exerciseCard: {
      elevation: 4,
    },
    exerciseTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 28,
      textAlign: "center",
      marginBottom: 8,
    },
    exerciseMeta: {
      fontFamily: "Roboto_500Medium",
      fontSize: 16,
      textAlign: "center",
      marginBottom: 16,
    },
    exerciseDescription: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      lineHeight: 24,
      textAlign: "center",
      marginBottom: 24,
    },
    instructionsContainer: {
      padding: 16,
      borderRadius: 8,
    },
    instructionsTitle: {
      fontFamily: "Roboto_500Medium",
      fontSize: 18,
      marginBottom: 12,
    },
    instructionItem: {
      flexDirection: "row",
      marginBottom: 8,
    },
    instructionNumber: {
      fontFamily: "Roboto_500Medium",
      fontSize: 14,
      marginRight: 8,
      minWidth: 20,
    },
    instructionText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 14,
      lineHeight: 20,
      flex: 1,
    },
    navigationContainer: {
      flexDirection: "row",
      padding: 16,
      paddingBottom: 32,
      justifyContent: "space-between",
    },
    navButton: {
      flex: 0.45,
    },
    startButton: {
      marginTop: 20,
    },
    actionButton: {
      marginTop: 20,
    },
    completionCard: {
      elevation: 4,
      marginBottom: 20,
    },
    completionTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 28,
      textAlign: "center",
      marginBottom: 8,
    },
    completionSubtitle: {
      fontFamily: "Roboto_500Medium",
      fontSize: 18,
      textAlign: "center",
      marginBottom: 24,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 24,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontFamily: "Oswald_700Bold",
      fontSize: 24,
    },
    statLabel: {
      fontFamily: "Roboto_400Regular",
      fontSize: 14,
      marginTop: 4,
    },
    quoteContainer: {
      padding: 16,
      borderRadius: 8,
    },
    quoteText: {
      fontFamily: "Roboto_400Regular",
      fontStyle: "italic",
      fontSize: 16,
      lineHeight: 24,
      textAlign: "center",
      marginBottom: 8,
    },
    quoteAuthor: {
      fontFamily: "Roboto_500Medium",
      fontSize: 14,
      textAlign: "center",
    },
    exerciseQuoteContainer: {
      padding: 16,
      borderRadius: 8,
      marginTop: 16,
    },
    exerciseQuoteText: {
      fontFamily: "Roboto_400Regular",
      fontStyle: "italic",
      fontSize: 16,
      lineHeight: 24,
      textAlign: "center",
      marginBottom: 8,
    },
    exerciseQuoteAuthor: {
      fontFamily: "Roboto_500Medium",
      fontSize: 14,
      textAlign: "center",
    },
  });
