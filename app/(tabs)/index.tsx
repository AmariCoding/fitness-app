import { useAuth } from "@/lib/auth-context";
import { getWorkoutStats } from "@/lib/database";
import { useAppTheme } from "@/lib/theme-context";
import { Oswald_700Bold, useFonts } from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Workout = {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  category: "mental" | "physical";
  exercises?: string[];
  quote?: string;
  quoteAuthor?: string;
};

const sampleWorkouts: Workout[] = [
  {
    id: "1",
    title: "Focus Builder",
    description: "Sharpen your concentration with targeted mental exercises",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    duration: "10 min",
    level: "Beginner",
    category: "mental",
    exercises: [
      "Single-point focus meditation",
      "Visual tracking exercises",
      "Mindful breathing techniques",
    ],
    quote: "Where focus goes, energy flows.",
    quoteAuthor: "Tony Robbins",
  },
  {
    id: "2",
    title: "Decision Making",
    description: "Improve your ability to make quick decisions under pressure",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
    duration: "15 min",
    level: "Intermediate",
    category: "mental",
    exercises: [
      "Situational scenario analysis",
      "Rapid pattern recognition tasks",
      "Timed decision challenges",
    ],
    quote:
      "In any moment of decision, the best thing you can do is the right thing, the next best thing is the wrong thing, and the worst thing you can do is nothing.",
    quoteAuthor: "Theodore Roosevelt",
  },
  {
    id: "3",
    title: "Pre-Game Meditation",
    description: "Center yourself and prepare mentally for competition",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e",
    duration: "8 min",
    level: "Beginner",
    category: "mental",
    exercises: [
      "Guided visualization",
      "Body scan relaxation",
      "Controlled breathing exercises",
    ],
    quote:
      "The mind is the athlete; the body is simply the means it uses to run faster or throw farther.",
    quoteAuthor: "Bryce Courtenay",
  },
  {
    id: "4",
    title: "Full Body HIIT",
    description:
      "High-intensity interval training to challenge your entire body",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    duration: "30 min",
    level: "Intermediate",
    category: "physical",
    exercises: [
      "Burpees (30 seconds)",
      "Mountain climbers (45 seconds)",
      "Jump squats (30 seconds)",
    ],
    quote: "The only bad workout is the one that didn't happen.",
    quoteAuthor: "Unknown",
  },
];

export default function Index() {
  const { user, signOut } = useAuth();
  const { theme } = useAppTheme();
  const [workoutStats, setWorkoutStats] = useState({
    totalWorkouts: 0,
    totalMinutes: 0,
    currentStreak: 0,
    weeklyProgress: { totalWorkouts: 0 },
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  useFocusEffect(
    useCallback(() => {
      loadWorkoutStats();
      return () => {};
    }, [user])
  );

  const loadWorkoutStats = async () => {
    if (!user) {
      setIsLoadingStats(false);
      return;
    }

    try {
      setIsLoadingStats(true);
      const stats = await getWorkoutStats(user.$id);
      setWorkoutStats({
        totalWorkouts: stats.userStats?.totalWorkouts || 0,
        totalMinutes: stats.userStats?.totalMinutes || 0,
        currentStreak: stats.userStats?.currentStreak || 0,
        weeklyProgress: stats.weeklyProgress,
      });
    } catch (error) {
      console.error("Failed to load workout stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const styles = createStyles(theme);

  const navigateToTrainer = () => {
    router.push("/(tabs)/my-trainer");
  };

  const startFeaturedWorkout = () => {
    const featuredWorkout = {
      id: "featured-decision",
      title: "Quick Decision Training",
      description:
        "Enhance your ability to make smart decisions under pressure with this 10-minute mental workout",
      duration: "10 min",
      difficulty: "Medium",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
      category: "mental" as const,
      exercises: [
        "Situational scenario analysis",
        "Rapid pattern recognition tasks",
        "Timed decision challenges",
        "Choice prioritization exercises",
      ],
      quote: "A good decision is based on knowledge and not on numbers.",
      quoteAuthor: "Plato",
    };

    router.push({
      pathname: "/workout-session",
      params: {
        workout: JSON.stringify(featuredWorkout),
      },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.appTitle}>MINDSET</Text>
          <Text style={styles.greeting}>Hello, {user?.name || "Athlete"}</Text>
          <Text style={styles.subheading}>Train your brain like your body</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Today&apos;s Mental Workout
          </Text>
          <Card
            style={[
              styles.featuredCard,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Card.Cover
              source={{
                uri: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
              }}
            />
            <Card.Content>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Quick Decision Training
              </Text>
              <Text
                style={[
                  styles.cardDescription,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Enhance your ability to make smart decisions under pressure with
                this 10-minute mental workout
              </Text>
              <View style={styles.cardDetails}>
                <Text style={styles.detailText}>10 min</Text>
                <Text style={styles.detailText}>Mental Focus</Text>
              </View>
              <View style={styles.featuredQuoteContainer}>
                <Text
                  style={[
                    styles.featuredQuoteText,
                    { color: theme.colors.primary },
                  ]}
                >
                  &quot;A good decision is based on knowledge and not on
                  numbers.&quot;
                </Text>
                <Text
                  style={[
                    styles.featuredQuoteAuthor,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  - Plato
                </Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={startFeaturedWorkout}
              >
                Start Workout
              </Button>
            </Card.Actions>
          </Card>
        </View>

        <Divider
          style={[styles.divider, { backgroundColor: theme.colors.border }]}
        />

        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Your Mental Progress
          </Text>
          <View style={styles.statsContainer}>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {isLoadingStats ? "..." : workoutStats.totalWorkouts}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Workouts Completed
              </Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {isLoadingStats ? "..." : `${workoutStats.currentStreak} days`}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Current Streak
              </Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {isLoadingStats ? "..." : `${workoutStats.totalMinutes} min`}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Training
              </Text>
            </View>
          </View>
        </View>

        <Divider
          style={[styles.divider, { backgroundColor: theme.colors.border }]}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Brain Training Exercises
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sampleWorkouts
              .filter((workout) => workout.category === "mental")
              .map((workout) => (
                <Card
                  key={workout.id}
                  style={[
                    styles.horizontalCard,
                    { backgroundColor: theme.colors.card },
                  ]}
                  onPress={navigateToTrainer}
                >
                  <Card.Cover
                    source={{ uri: workout.image }}
                    style={styles.horizontalCardImage}
                  />
                  <Card.Content>
                    <Text
                      style={[
                        styles.horizontalCardTitle,
                        { color: theme.colors.text },
                      ]}
                    >
                      {workout.title}
                    </Text>
                    <View style={styles.cardDetails}>
                      <Text style={styles.detailText}>{workout.duration}</Text>
                      <Text style={styles.detailText}>{workout.level}</Text>
                    </View>
                    {workout.quote && (
                      <Text
                        style={[
                          styles.horizontalQuoteText,
                          { color: theme.colors.primary },
                        ]}
                      >
                        &quot;
                        {workout.quote.length > 60
                          ? workout.quote.substring(0, 60) + "..."
                          : workout.quote}
                        &quot;
                      </Text>
                    )}
                  </Card.Content>
                </Card>
              ))}
          </ScrollView>
        </View>

        <View style={styles.inspirationSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Inspiration
          </Text>
          <Card
            style={[
              styles.inspirationCard,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Card.Content>
              <Text style={styles.quoteText}>
                &quot;Physical strength is measured by what we can carry; mental
                strength is measured by what we can bear.&quot;
              </Text>
              <Text style={styles.quoteAuthor}>- Mark Twain</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={() => signOut()}
            icon="logout"
            textColor={theme.colors.text}
            style={{ borderColor: theme.colors.border }}
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>
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
    appTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 26,
      color: "white",
      marginBottom: 8,
    },
    greeting: {
      fontFamily: "Oswald_700Bold",
      fontSize: 20,
      color: "white",
      marginBottom: 4,
    },
    subheading: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
    },
    section: {
      padding: 16,
    },
    sectionTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 20,
      marginBottom: 12,
    },
    featuredCard: {
      elevation: 4,
    },
    cardTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 18,
      marginTop: 8,
      marginBottom: 4,
    },
    cardDescription: {
      fontFamily: "Roboto_400Regular",
      fontSize: 14,
      marginBottom: 8,
      lineHeight: 20,
    },
    cardDetails: {
      flexDirection: "row",
      marginTop: 8,
    },
    detailText: {
      fontFamily: "Roboto_500Medium",
      fontSize: 12,
      color: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}20`,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginRight: 8,
    },
    actionButton: {
      marginTop: 8,
    },
    divider: {
      height: 1,
      marginVertical: 8,
    },
    statsSection: {
      padding: 16,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statCard: {
      borderRadius: 8,
      padding: 16,
      elevation: 2,
      flex: 1,
      marginHorizontal: 4,
      alignItems: "center",
    },
    statValue: {
      fontFamily: "Oswald_700Bold",
      fontSize: 24,
      marginBottom: 4,
    },
    statLabel: {
      fontFamily: "Roboto_400Regular",
      fontSize: 12,
      textAlign: "center",
    },
    horizontalCard: {
      width: 160,
      marginRight: 12,
      elevation: 2,
    },
    horizontalCardImage: {
      height: 100,
    },
    horizontalCardTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 14,
      marginTop: 8,
      marginBottom: 4,
    },
    inspirationSection: {
      padding: 16,
      paddingTop: 0,
    },
    inspirationCard: {},
    quoteText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      fontStyle: "italic",
      color: "white",
      lineHeight: 24,
      marginBottom: 8,
    },
    quoteAuthor: {
      fontFamily: "Roboto_500Medium",
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "right",
    },
    featuredQuoteContainer: {
      marginTop: 12,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.primary}30`,
    },
    featuredQuoteText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 14,
      fontStyle: "italic",
      lineHeight: 20,
    },
    featuredQuoteAuthor: {
      fontFamily: "Roboto_500Medium",
      fontSize: 12,
      textAlign: "right",
      marginTop: 4,
    },
    horizontalQuoteText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 12,
      fontStyle: "italic",
      marginTop: 8,
      lineHeight: 16,
    },
    logoutContainer: {
      padding: 16,
      alignItems: "center",
    },
  });
