import { useAuth } from "@/lib/auth-context";
import { Oswald_700Bold, useFonts } from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Divider,
  Text,
  TouchableRipple,
} from "react-native-paper";

type Workout = {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  image: string;
};

const workouts: Workout[] = [
  {
    id: "1",
    title: "Full Body HIIT",
    description: "High-intensity interval training to work your entire body",
    duration: "25 mins",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a",
  },
  {
    id: "2",
    title: "Core Strength",
    description: "Focused exercises to build core strength and stability",
    duration: "15 mins",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
  },
  {
    id: "3",
    title: "Upper Body Power",
    description: "Build strength in your arms, chest and shoulders",
    duration: "30 mins",
    difficulty: "Advanced",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
  },
  {
    id: "4",
    title: "Leg Day Challenge",
    description: "Intense lower body workout for maximum gains",
    duration: "35 mins",
    difficulty: "Expert",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155",
  },
];

export default function MyTrainerScreen() {
  const { user } = useAuth();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <TouchableRipple onPress={() => setSelectedWorkout(item)}>
      <Card style={styles.workoutCard}>
        <Card.Cover source={{ uri: item.image }} style={styles.workoutImage} />
        <Card.Content>
          <Text style={styles.workoutTitle}>{item.title}</Text>
          <View style={styles.workoutDetails}>
            <Text style={styles.workoutInfo}>{item.duration}</Text>
            <Text style={styles.workoutInfo}>{item.difficulty}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableRipple>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Trainer</Text>
        <Text style={styles.subheading}>
          Personalized workouts for {user?.name || "you"}
        </Text>
      </View>

      <View style={styles.workoutListContainer}>
        <Text style={styles.sectionTitle}>Recommended Workouts</Text>
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.workoutList}
        />
      </View>

      <Divider style={styles.divider} />

      {selectedWorkout ? (
        <ScrollView style={styles.selectedWorkoutContainer}>
          <Image
            source={{ uri: selectedWorkout.image }}
            style={styles.selectedWorkoutImage}
          />
          <View style={styles.selectedWorkoutDetails}>
            <Text style={styles.selectedWorkoutTitle}>
              {selectedWorkout.title}
            </Text>
            <View style={styles.workoutMeta}>
              <Text style={styles.workoutMetaItem}>
                {selectedWorkout.duration}
              </Text>
              <Text style={styles.workoutMetaItem}>
                {selectedWorkout.difficulty}
              </Text>
            </View>
            <Text style={styles.selectedWorkoutDescription}>
              {selectedWorkout.description}
            </Text>
            <Button
              mode="contained"
              style={styles.startButton}
              onPress={() =>
                console.log(`Starting workout: ${selectedWorkout.title}`)
              }
            >
              Start Workout
            </Button>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            Select a workout to see details
          </Text>
        </View>
      )}
    </View>
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
  heading: {
    fontFamily: "Oswald_700Bold",
    fontSize: 28,
    color: "white",
    marginBottom: 4,
  },
  subheading: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  workoutListContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: "Oswald_700Bold",
    fontSize: 20,
    marginBottom: 12,
  },
  workoutList: {
    paddingRight: 16,
  },
  workoutCard: {
    width: 180,
    marginRight: 12,
    elevation: 2,
  },
  workoutImage: {
    height: 120,
  },
  workoutTitle: {
    fontFamily: "Oswald_700Bold",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  workoutDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  workoutInfo: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: "#6200ee",
    backgroundColor: "rgba(98, 0, 238, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  selectedWorkoutContainer: {
    flex: 1,
  },
  selectedWorkoutImage: {
    width: "100%",
    height: 200,
  },
  selectedWorkoutDetails: {
    padding: 16,
  },
  selectedWorkoutTitle: {
    fontFamily: "Oswald_700Bold",
    fontSize: 24,
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: "row",
    marginBottom: 16,
  },
  workoutMetaItem: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: "#6200ee",
    backgroundColor: "rgba(98, 0, 238, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  selectedWorkoutDescription: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: "#ff6b00",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  placeholderText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
  },
});
