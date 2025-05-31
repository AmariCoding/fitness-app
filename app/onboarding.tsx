import { useAuth } from "@/lib/auth-context";
import { useOnboarding } from "@/lib/onboarding-context";
import { Oswald_700Bold, useFonts } from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

const { width, height } = Dimensions.get("window");

type Slide = {
  id: number;
  title: string;
  description: string;
  image: any;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "Welcome to MINDSET",
    description: "Your journey to a healthier body and mind starts here.",
    image: require("@/assets/images/fitness-bg.jpg"),
  },
  {
    id: 2,
    title: "Track Your Progress",
    description:
      "Set goals, track your workouts, and celebrate your achievements.",
    image: require("@/assets/images/fitness-bg.jpg"),
  },
  {
    id: 3,
    title: "Join the Community",
    description:
      "Connect with like-minded individuals and stay motivated together.",
    image: require("@/assets/images/fitness-bg.jpg"),
  },
];

const Onboarding = () => {
  const router = useRouter();
  const { setOnboardingComplete } = useOnboarding();
  const { clearNewUserFlag } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<any>(null);
  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await setOnboardingComplete();
      clearNewUserFlag();
      router.replace("/");
    }
  };

  const renderItem = ({ item }: { item: Slide }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const Paginator = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>
    );
  };

  const NextButton = () => {
    return (
      <TouchableOpacity
        style={styles.nextButton}
        activeOpacity={0.8}
        onPress={scrollTo}
      >
        <LinearGradient colors={["#ff6b00", "#ff8c00"]} style={styles.gradient}>
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const SkipButton = () => {
    if (currentIndex === slides.length - 1) return null;

    return (
      <TouchableOpacity
        style={styles.skipButton}
        onPress={async () => {
          await setOnboardingComplete();
          clearNewUserFlag();
          router.replace("/");
        }}
      >
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
      <Paginator />
      <NextButton />
      <SkipButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    flex: 1,
    width,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    flex: 0.6,
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 30,
  },
  textContainer: {
    flex: 0.4,
    alignItems: "center",
  },
  title: {
    fontFamily: "Oswald_700Bold",
    fontSize: 28,
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    paddingHorizontal: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    height: 40,
    marginBottom: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff6b00",
    marginHorizontal: 5,
  },
  nextButton: {
    marginBottom: 50,
    width: width * 0.6,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    fontFamily: "Oswald_700Bold",
    fontSize: 18,
    color: "white",
    letterSpacing: 1,
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
  },
  skipButtonText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    color: "#ff6b00",
  },
});

export default Onboarding;
