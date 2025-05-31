import { useAuth } from "@/lib/auth-context";
import { useAppTheme } from "@/lib/theme-context";
import { Oswald_700Bold, useFonts } from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Text, TouchableRipple } from "react-native-paper";
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
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
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
    image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3",
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
  const { theme } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "mental" | "physical"
  >("all");
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const styles = createStyles(theme);

  const startWorkout = (workout: Workout) => {
    router.push({
      pathname: "/workout-session",
      params: {
        workout: JSON.stringify(workout),
      },
    });
  };

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <TouchableRipple onPress={() => startWorkout(item)}>
      <Card
        style={[styles.workoutCard, { backgroundColor: theme.colors.card }]}
      >
        <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={[styles.workoutTitle, { color: theme.colors.text }]}>
              {item.title}
            </Text>
            <View style={styles.metaContainer}>
              <Chip
                mode="outlined"
                style={[styles.chip, { borderColor: theme.colors.primary }]}
                textStyle={{ color: theme.colors.primary, fontSize: 9 }}
              >
                {item.difficulty}
              </Chip>
              <Chip
                mode="outlined"
                style={[styles.chip, { borderColor: theme.colors.primary }]}
                textStyle={{ color: theme.colors.primary, fontSize: 9 }}
              >
                {item.duration}
              </Chip>
            </View>
          </View>
          <Text
            style={[
              styles.workoutDescription,
              { color: theme.colors.textSecondary },
            ]}
          >
            {item.description}
          </Text>

          {item.benefits && (
            <View style={styles.benefitsContainer}>
              <Text
                style={[styles.benefitsTitle, { color: theme.colors.text }]}
              >
                Benefits:
              </Text>
              <View style={styles.benefitsWrap}>
                {item.benefits.map((benefit, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.benefitItem,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    • {benefit}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {item.quote && (
            <View
              style={[
                styles.quoteContainer,
                { backgroundColor: `${theme.colors.primary}10` },
              ]}
            >
              <Text style={[styles.quoteText, { color: theme.colors.text }]}>
                &quot;{item.quote}&quot;
              </Text>
              <Text
                style={[styles.quoteAuthor, { color: theme.colors.primary }]}
              >
                - {item.quoteAuthor}
              </Text>
            </View>
          )}
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            style={[
              styles.startButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => startWorkout(item)}
          >
            Start Workout
          </Button>
        </Card.Actions>
      </Card>
    </TouchableRipple>
  );

  const filteredWorkouts =
    selectedCategory === "all"
      ? workouts
      : workouts.filter((workout) => workout.category === selectedCategory);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Trainer</Text>
        <Text style={styles.subtitle}>
          Personalized workouts for {user?.name || "you"}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            mode={selectedCategory === "all" ? "flat" : "outlined"}
            selected={selectedCategory === "all"}
            onPress={() => setSelectedCategory("all")}
            style={[
              styles.filterChip,
              selectedCategory === "all" && {
                backgroundColor: theme.colors.primary,
              },
            ]}
            textStyle={{
              color: selectedCategory === "all" ? "white" : theme.colors.text,
            }}
          >
            All Workouts
          </Chip>
          <Chip
            mode={selectedCategory === "mental" ? "flat" : "outlined"}
            selected={selectedCategory === "mental"}
            onPress={() => setSelectedCategory("mental")}
            style={[
              styles.filterChip,
              selectedCategory === "mental" && {
                backgroundColor: theme.colors.primary,
              },
              { borderColor: theme.colors.border },
            ]}
            textStyle={{
              color:
                selectedCategory === "mental" ? "white" : theme.colors.text,
            }}
          >
            Mental Training
          </Chip>
          <Chip
            mode={selectedCategory === "physical" ? "flat" : "outlined"}
            selected={selectedCategory === "physical"}
            onPress={() => setSelectedCategory("physical")}
            style={[
              styles.filterChip,
              selectedCategory === "physical" && {
                backgroundColor: theme.colors.primary,
              },
              { borderColor: theme.colors.border },
            ]}
            textStyle={{
              color:
                selectedCategory === "physical" ? "white" : theme.colors.text,
            }}
          >
            Physical Training
          </Chip>
        </ScrollView>
      </View>

      <FlatList
        data={filteredWorkouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.workoutsList}
        showsVerticalScrollIndicator={false}
      />
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
    title: {
      fontFamily: "Oswald_700Bold",
      fontSize: 28,
      color: "white",
      marginBottom: 4,
    },
    subtitle: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
    },
    filterContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    filterChip: {
      marginHorizontal: 4,
    },
    workoutsList: {
      padding: 16,
      paddingTop: 8,
    },
    workoutCard: {
      marginBottom: 16,
      elevation: 4,
      borderRadius: 12,
      overflow: "hidden",
    },
    cardImage: {
      height: 140,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    workoutTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 20,
      flex: 1,
      marginRight: 8,
    },
    metaContainer: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
    chip: {
      marginBottom: 4,
      height: 36,
    },
    workoutDescription: {
      fontFamily: "Roboto_400Regular",
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 12,
    },
    benefitsContainer: {
      marginBottom: 12,
    },
    benefitsTitle: {
      fontFamily: "Roboto_500Medium",
      fontSize: 14,
      marginBottom: 4,
    },
    benefitsWrap: {
      flexDirection: "column",
    },
    benefitItem: {
      fontFamily: "Roboto_400Regular",
      fontSize: 12,
      marginBottom: 2,
    },
    quoteContainer: {
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    quoteText: {
      fontFamily: "Roboto_400Regular",
      fontStyle: "italic",
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 4,
    },
    quoteAuthor: {
      fontFamily: "Roboto_500Medium",
      fontSize: 12,
      textAlign: "right",
    },
    startButton: {
      flex: 1,
      marginHorizontal: 8,
    },
  });
