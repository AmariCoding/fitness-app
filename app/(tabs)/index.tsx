import { useAuth } from "@/lib/auth-context";
import { useOnboarding } from "@/lib/onboarding-context";
import { Oswald_700Bold, useFonts } from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { useFocusEffect } from "expo-router";
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
};

const sampleWorkouts: Workout[] = [
  {
    id: "1",
    title: "Full Body Blast",
    description: "High-intensity workout to challenge your entire body",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    duration: "30 min",
    level: "Intermediate",
  },
  {
    id: "2",
    title: "Core Strength",
    description: "Build a strong foundation with this core-focused routine",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    duration: "20 min",
    level: "Beginner",
  },
  {
    id: "3",
    title: "Cardio Kickboxing",
    description: "Burn calories with this high-energy kickboxing workout",
    image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a",
    duration: "45 min",
    level: "Advanced",
  },
];

export default function Index() {
  const { user, signOut } = useAuth();
  const { isFirstLogin } = useOnboarding();
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.name || "Fitness Enthusiast"}
        </Text>
        <Text style={styles.subheading}>Ready for your workout?</Text>
      </View>

      {showWelcomeCard && (
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Text style={styles.welcomeTitle}>Welcome to MINDSET!</Text>
            <Text style={styles.welcomeText}>
              You&apos;ve completed the onboarding process. Explore the app to
              discover personalized workouts, track your progress, and connect
              with others.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={dismissWelcomeCard}>Got it</Button>
          </Card.Actions>
        </Card>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today&apos;s Workout</Text>
        <Card style={styles.featuredCard}>
          <Card.Cover
            source={{
              uri: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e",
            }}
          />
          <Card.Content>
            <Text style={styles.cardTitle}>Morning Energy Boost</Text>
            <Text style={styles.cardDescription}>
              Start your day with this 15-minute energy-boosting routine
            </Text>
            <View style={styles.cardDetails}>
              <Text style={styles.detailText}>15 min</Text>
              <Text style={styles.detailText}>Beginner</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended For You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sampleWorkouts.map((workout) => (
            <Card key={workout.id} style={styles.horizontalCard}>
              <Card.Cover
                source={{ uri: workout.image }}
                style={styles.horizontalCardImage}
              />
              <Card.Content>
                <Text style={styles.horizontalCardTitle}>{workout.title}</Text>
                <View style={styles.cardDetails}>
                  <Text style={styles.detailText}>{workout.duration}</Text>
                  <Text style={styles.detailText}>{workout.level}</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
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
    paddingTop: 40,
    backgroundColor: "#6200ee",
  },
  greeting: {
    fontFamily: "Oswald_700Bold",
    fontSize: 28,
    color: "#fff",
    marginBottom: 5,
  },
  subheading: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  welcomeCard: {
    margin: 16,
    elevation: 4,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  welcomeTitle: {
    fontFamily: "Oswald_700Bold",
    fontSize: 18,
    marginBottom: 8,
    color: "#6200ee",
  },
  welcomeText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: "Oswald_700Bold",
    fontSize: 20,
    marginBottom: 16,
    color: "#333",
  },
  featuredCard: {
    borderRadius: 8,
    overflow: "hidden",
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
    color: "#666",
    marginBottom: 8,
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
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  actionButton: {
    marginTop: 8,
    backgroundColor: "#ff6b00",
  },
  divider: {
    marginVertical: 8,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  horizontalCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 8,
  },
  horizontalCardImage: {
    height: 120,
  },
  horizontalCardTitle: {
    fontFamily: "Oswald_700Bold",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  logoutContainer: {
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
});
