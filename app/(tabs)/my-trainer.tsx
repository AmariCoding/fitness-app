import { useAuth } from "@/lib/auth-context";
import { Oswald_700Bold, useFonts } from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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

const workouts: Workout[] = [
  {
    id: "1",
    title: "Focus Builder",
    description:
      "Mental exercises designed to enhance your concentration and focus during competition",
    duration: "10 mins",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1594723113349-901a7e089591",
    category: "mental",
    benefits: [
      "Improved focus",
      "Better concentration",
      "Reduced distractions",
    ],
    exercises: [
      "Single-point focus meditation",
      "Visual tracking exercises",
      "Mindful breathing techniques",
      "Distraction challenge tasks",
    ],
    quote:
      "Concentration is the secret of strength in politics, in war, in trade, in short, in all the management of human affairs.",
    quoteAuthor: "Ralph Waldo Emerson",
  },
  {
    id: "2",
    title: "Quick Decision Making",
    description:
      "Train your brain to make faster and smarter decisions under pressure",
    duration: "15 mins",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
    category: "mental",
    benefits: [
      "Faster reaction time",
      "Better decision making",
      "Improved judgment",
    ],
    exercises: [
      "Situational scenario analysis",
      "Rapid pattern recognition tasks",
      "Timed decision challenges",
      "Choice prioritization exercises",
    ],
    quote: "A good decision is based on knowledge and not on numbers.",
    quoteAuthor: "Plato",
  },
  {
    id: "3",
    title: "Memory Enhancement",
    description:
      "Exercises to improve memory recall and processing for game strategies",
    duration: "12 mins",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1565711561500-49678a10a63f",
    category: "mental",
    benefits: [
      "Better memory retention",
      "Improved recall",
      "Enhanced learning",
    ],
    exercises: [
      "Sequential pattern memorization",
      "Visual memory games",
      "Strategy recall challenges",
      "Association techniques practice",
    ],
    quote: "The true art of memory is the art of attention.",
    quoteAuthor: "Samuel Johnson",
  },
  {
    id: "4",
    title: "Pre-Game Meditation",
    description:
      "Guided meditation to calm your mind and prepare for competition",
    duration: "8 mins",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e",
    category: "mental",
    benefits: ["Reduced anxiety", "Mental clarity", "Improved focus"],
    exercises: [
      "Guided visualization",
      "Body scan relaxation",
      "Controlled breathing exercises",
      "Mindfulness meditation",
    ],
    quote: "The mind is everything. What you think you become.",
    quoteAuthor: "Buddha",
  },
  {
    id: "5",
    title: "Mental Endurance",
    description:
      "Build your mental stamina to stay focused throughout long competitions",
    duration: "20 mins",
    difficulty: "Advanced",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc5a21ca0",
    category: "mental",
    benefits: [
      "Increased mental stamina",
      "Improved resilience",
      "Better performance under pressure",
    ],
    exercises: [
      "Extended focus exercises",
      "Progressive distraction training",
      "Mental fatigue resistance drills",
      "Cognitive load management",
    ],
    quote: "Mental toughness is to physical as four is to one.",
    quoteAuthor: "Bobby Knight",
  },
  {
    id: "6",
    title: "Prayer & Reflection",
    description:
      "Faith-based reflection to find inner peace and spiritual balance",
    duration: "10 mins",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a",
    category: "mental",
    benefits: ["Spiritual connection", "Inner peace", "Mental clarity"],
    exercises: [
      "Guided spiritual reflection",
      "Gratitude practice",
      "Scripture meditation",
      "Contemplative prayer",
    ],
    quote: "Prayer does not change God, but it changes him who prays.",
    quoteAuthor: "Søren Kierkegaard",
  },
  {
    id: "7",
    title: "Full Body HIIT",
    description: "High-intensity interval training to work your entire body",
    duration: "25 mins",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a",
    category: "physical",
    exercises: [
      "Burpees (30 seconds)",
      "Mountain climbers (45 seconds)",
      "Jump squats (30 seconds)",
      "Plank jacks (45 seconds)",
    ],
    quote: "The only bad workout is the one that didn't happen.",
    quoteAuthor: "Unknown",
  },
  {
    id: "8",
    title: "Core Strength",
    description: "Focused exercises to build core strength and stability",
    duration: "15 mins",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    category: "physical",
    exercises: [
      "Plank variations (3 sets, 30 seconds each)",
      "Russian twists (3 sets, 20 reps)",
      "Bicycle crunches (3 sets, 15 reps)",
      "Leg raises (3 sets, 12 reps)",
    ],
    quote: "The core is the powerhouse of the body.",
    quoteAuthor: "Joseph Pilates",
  },
  {
    id: "9",
    title: "Upper Body Power",
    description: "Build strength in your arms, chest and shoulders",
    duration: "30 mins",
    difficulty: "Advanced",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
    category: "physical",
    exercises: [
      "Push-ups (4 sets, 15 reps)",
      "Dumbbell rows (3 sets, 12 reps per arm)",
      "Shoulder presses (3 sets, 10 reps)",
      "Tricep dips (3 sets, to failure)",
    ],
    quote:
      "Strength does not come from physical capacity. It comes from an indomitable will.",
    quoteAuthor: "Mahatma Gandhi",
  },
  {
    id: "10",
    title: "Leg Day Challenge",
    description: "Intense lower body workout for maximum gains",
    duration: "35 mins",
    difficulty: "Expert",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155",
    category: "physical",
    exercises: [
      "Squats (4 sets, 15 reps)",
      "Lunges (3 sets, 12 reps per leg)",
      "Deadlifts (3 sets, 10 reps)",
      "Calf raises (4 sets, 20 reps)",
    ],
    quote: "The legs feed the wolf.",
    quoteAuthor: "Herb Brooks",
  },
];

export default function MyTrainerScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [activeCategory, setActiveCategory] = useState<"physical" | "mental">(
    "mental"
  );

  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const filteredWorkouts = workouts.filter(
    (workout) => workout.category === activeCategory
  );

  const startWorkout = (workout: Workout) => {
    router.push({
      pathname: "/workout-session",
      params: {
        workout: JSON.stringify(workout),
      },
    });
  };

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>MindSet Trainer</Text>
        <Text style={styles.subheading}>
          Train your brain like your body, {user?.name || "athlete"}
        </Text>
      </View>

      <View style={styles.categorySelector}>
        <Chip
          selected={activeCategory === "mental"}
          onPress={() => setActiveCategory("mental")}
          style={[
            styles.categoryChip,
            activeCategory === "mental" && styles.activeCategoryChip,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              activeCategory === "mental" && styles.activeCategoryText,
            ]}
          >
            Brain Training
          </Text>
        </Chip>
        <Chip
          selected={activeCategory === "physical"}
          onPress={() => setActiveCategory("physical")}
          style={[
            styles.categoryChip,
            activeCategory === "physical" && styles.activeCategoryChip,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              activeCategory === "physical" && styles.activeCategoryText,
            ]}
          >
            Physical Training
          </Text>
        </Chip>
      </View>

      <View style={styles.workoutListContainer}>
        <Text style={styles.sectionTitle}>
          {activeCategory === "mental"
            ? "Mental Workouts"
            : "Physical Workouts"}
        </Text>
        <FlatList
          data={filteredWorkouts}
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

            {selectedWorkout.benefits && (
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Benefits:</Text>
                {selectedWorkout.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Text style={styles.benefitText}>• {benefit}</Text>
                  </View>
                ))}
              </View>
            )}

            {selectedWorkout.exercises && (
              <View style={styles.exercisesContainer}>
                <Text style={styles.exercisesTitle}>Exercises:</Text>
                {selectedWorkout.exercises.map((exercise, index) => (
                  <View key={index} style={styles.exerciseItem}>
                    <Text style={styles.exerciseText}>• {exercise}</Text>
                  </View>
                ))}
              </View>
            )}

            {selectedWorkout.quote && (
              <View style={styles.quoteContainer}>
                <Text style={styles.quoteText}>
                  &quot;{selectedWorkout.quote}&quot;
                </Text>
                <Text style={styles.quoteAuthor}>
                  {selectedWorkout.quoteAuthor}
                </Text>
              </View>
            )}

            <Button
              mode="contained"
              style={styles.startButton}
              onPress={() => startWorkout(selectedWorkout)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  categorySelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    backgroundColor: "#f0f0f0",
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#e0e0e0",
  },
  activeCategoryChip: {
    backgroundColor: "#6200ee",
  },
  categoryText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: "#333",
  },
  activeCategoryText: {
    color: "white",
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
    marginBottom: 16,
  },
  benefitsContainer: {
    marginBottom: 24,
    backgroundColor: "rgba(98, 0, 238, 0.05)",
    padding: 12,
    borderRadius: 8,
  },
  benefitsTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    marginBottom: 8,
  },
  benefitItem: {
    marginBottom: 4,
  },
  benefitText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  exercisesContainer: {
    marginBottom: 24,
    backgroundColor: "rgba(98, 0, 238, 0.05)",
    padding: 12,
    borderRadius: 8,
  },
  exercisesTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    marginBottom: 8,
  },
  exerciseItem: {
    marginBottom: 4,
  },
  exerciseText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  quoteContainer: {
    marginBottom: 24,
    backgroundColor: "rgba(98, 0, 238, 0.05)",
    padding: 12,
    borderRadius: 8,
  },
  quoteText: {
    fontFamily: "Roboto_400Regular",
    fontStyle: "italic",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: "#6200ee",
    textAlign: "right",
  },
  startButton: {
    backgroundColor: "#6200ee",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
  },
});
