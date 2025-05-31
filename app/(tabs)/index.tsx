import { useAuth } from "@/lib/auth-context";
import { useOnboarding } from "@/lib/onboarding-context";
import { Oswald_700Bold, useFonts } from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Divider, Text } from "react-native-paper";

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
    title: "Focus Training",
    description: "Sharpen your concentration with targeted mental exercises",
    image: "https://images.unsplash.com/photo-1594723113349-901a7e089591",
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
  const { isFirstLogin } = useOnboarding();
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  useFocusEffect(
    useCallback(() => {
      // This will run when the screen is focused
      return () => {
        // This will run when the screen is unfocused
      };
    }, [])
  );

  if (!fontsLoaded) {
    return null;
  }

  const dismissWelcomeCard = () => {
    setShowWelcomeCard(false);
  };

  const navigateToTrainer = () => {
    router.push("/(tabs)/my-trainer");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>MINDSET</Text>
        <Text style={styles.greeting}>Hello, {user?.name || "Athlete"}</Text>
        <Text style={styles.subheading}>Train your brain like your body</Text>
      </View>

      {showWelcomeCard && (
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Text style={styles.welcomeTitle}>Welcome to MINDSET!</Text>
            <Text style={styles.welcomeText}>
              You&apos;ve completed the onboarding process. Explore the app to
              discover mental workouts, track your brain training progress, and
              enhance your athletic performance.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={dismissWelcomeCard}>Got it</Button>
          </Card.Actions>
        </Card>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today&apos;s Mental Workout</Text>
        <Card style={styles.featuredCard}>
          <Card.Cover
            source={{
              uri: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
            }}
          />
          <Card.Content>
            <Text style={styles.cardTitle}>Quick Decision Training</Text>
            <Text style={styles.cardDescription}>
              Enhance your ability to make smart decisions under pressure with
              this 10-minute mental workout
            </Text>
            <View style={styles.cardDetails}>
              <Text style={styles.detailText}>10 min</Text>
              <Text style={styles.detailText}>Mental Focus</Text>
            </View>
            <View style={styles.featuredQuoteContainer}>
              <Text style={styles.featuredQuoteText}>
                &quot;A good decision is based on knowledge and not on
                numbers.&quot;
              </Text>
              <Text style={styles.featuredQuoteAuthor}>- Plato</Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" style={styles.actionButton}>
              Start Workout
            </Button>
          </Card.Actions>
        </Card>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Mental Progress</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Workouts Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>+12%</Text>
            <Text style={styles.statLabel}>Focus Improvement</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Meditation Minutes</Text>
          </View>
        </View>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Brain Training Exercises</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sampleWorkouts
            .filter((workout) => workout.category === "mental")
            .map((workout) => (
              <Card
                key={workout.id}
                style={styles.horizontalCard}
                onPress={navigateToTrainer}
              >
                <Card.Cover
                  source={{ uri: workout.image }}
                  style={styles.horizontalCardImage}
                />
                <Card.Content>
                  <Text style={styles.horizontalCardTitle}>
                    {workout.title}
                  </Text>
                  <View style={styles.cardDetails}>
                    <Text style={styles.detailText}>{workout.duration}</Text>
                    <Text style={styles.detailText}>{workout.level}</Text>
                  </View>
                  {workout.quote && (
                    <Text style={styles.horizontalQuoteText}>
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
        <Text style={styles.sectionTitle}>Inspiration</Text>
        <Card style={styles.inspirationCard}>
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
        <Button mode="outlined" onPress={() => signOut()} icon="logout">
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#6200ee",
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
  welcomeCard: {
    margin: 16,
    elevation: 4,
  },
  welcomeTitle: {
    fontFamily: "Oswald_700Bold",
    fontSize: 20,
    marginBottom: 8,
  },
  welcomeText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 20,
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
    color: "#6200ee",
    backgroundColor: "rgba(98, 0, 238, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  actionButton: {
    marginTop: 8,
    backgroundColor: "#6200ee",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
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
    backgroundColor: "white",
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
    color: "#6200ee",
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
  inspirationCard: {
    backgroundColor: "#6200ee",
  },
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
    borderTopColor: "rgba(98, 0, 238, 0.1)",
  },
  featuredQuoteText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    fontStyle: "italic",
    color: "#6200ee",
    lineHeight: 20,
  },
  featuredQuoteAuthor: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 4,
  },
  horizontalQuoteText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    fontStyle: "italic",
    color: "#6200ee",
    marginTop: 8,
    lineHeight: 16,
  },
  logoutContainer: {
    padding: 16,
    alignItems: "center",
  },
});
