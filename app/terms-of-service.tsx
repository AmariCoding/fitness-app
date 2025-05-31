import { useAppTheme } from "@/lib/theme-context";
import { Oswald_700Bold, useFonts } from "@expo-google-fonts/oswald";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsOfServiceScreen() {
  const { theme } = useAppTheme();
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={24}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text
            style={[styles.lastUpdated, { color: theme.colors.textSecondary }]}
          >
            Last Updated: January 2024
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            1. Acceptance of Terms
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            By accessing and using the FitApp application ("the App"), you
            acknowledge that you have read, understood, and agree to be bound by
            these Terms of Service ("Terms"). If you do not agree to these
            Terms, please do not use the App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            2. Description of Service
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            FitApp is a fitness and wellness application that provides workout
            routines, progress tracking, mental training exercises, and
            health-related features. The App is designed to support your fitness
            journey through personalized workouts and progress monitoring.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            3. Data Protection and Privacy
          </Text>
          <Text style={[styles.subTitle, { color: theme.colors.primary }]}>
            3.1 Data Collection and Processing
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            In compliance with applicable data protection laws, including the
            Data Protection Act 2012 and GDPR, we collect and process personal
            data fairly and lawfully. We collect:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Account information (name, email address)
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Fitness data (workout history, progress photos, measurements)
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • App usage data and preferences
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Device information for app functionality
            </Text>
          </View>

          <Text style={[styles.subTitle, { color: theme.colors.primary }]}>
            3.2 Legal Basis for Processing
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            We process your personal data based on:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Your consent for fitness tracking and personalized features
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Contract performance to provide App services
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Legitimate interests for app improvement and security
            </Text>
          </View>

          <Text style={[styles.subTitle, { color: theme.colors.primary }]}>
            3.3 Your Rights
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Under data protection law, you have the right to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Access your personal data
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Rectify inaccurate data
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Request data deletion
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Data portability
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Withdraw consent at any time
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            4. User Responsibilities
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            You agree to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Provide accurate and current information
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Use the App in compliance with applicable laws
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Not share your account credentials
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Consult healthcare professionals before starting any fitness
              program
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.colors.text }]}>
              • Not use the App for any unlawful or prohibited activities
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            5. Health and Safety Disclaimer
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            <Text style={[styles.bold, { color: theme.colors.accent }]}>
              IMPORTANT HEALTH NOTICE:
            </Text>{" "}
            The App provides fitness and wellness information for educational
            purposes only. It is not intended as medical advice, diagnosis, or
            treatment. Always consult with qualified healthcare professionals
            before beginning any exercise program, especially if you have
            pre-existing health conditions.
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            You acknowledge that physical exercise involves risk of injury, and
            you participate at your own risk. We recommend starting slowly and
            listening to your body.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            6. Intellectual Property
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            All content in the App, including but not limited to text, graphics,
            logos, workout routines, and software, is owned by us or our
            licensors and is protected by copyright, trademark, and other
            intellectual property laws.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            7. Limitation of Liability
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            To the fullest extent permitted by law, we shall not be liable for
            any indirect, incidental, special, consequential, or punitive
            damages, or any loss of profits or revenues, whether incurred
            directly or indirectly, or any loss of data, use, goodwill, or other
            intangible losses resulting from your use of the App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            8. Data Retention and Deletion
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            We retain your personal data only as long as necessary to provide
            our services and comply with legal obligations. You may request
            account deletion at any time through the App settings. Upon
            deletion, we will remove your personal data within 30 days, except
            where retention is required by law.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            9. Changes to Terms
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            We may update these Terms from time to time. We will notify you of
            any material changes through the App or by email. Your continued use
            of the App after such modifications constitutes acceptance of the
            updated Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            10. Governing Law and Jurisdiction
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            These Terms shall be governed by and construed in accordance with
            applicable data protection laws and the laws of the jurisdiction
            where our services are provided. Any disputes shall be resolved
            through appropriate legal channels.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            11. Contact Information
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            If you have any questions about these Terms or our data processing
            practices, please contact us at:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={[styles.contact, { color: theme.colors.primary }]}>
              Email: privacy@fitapp.com
            </Text>
            <Text style={[styles.contact, { color: theme.colors.primary }]}>
              Data Protection Officer: dpo@fitapp.com
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text
            style={[styles.footerText, { color: theme.colors.textSecondary }]}
          >
            By using FitApp, you acknowledge that you have read and understood
            these Terms of Service and agree to be bound by them.
          </Text>
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
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      marginLeft: -8,
      marginRight: 8,
    },
    headerTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 24,
      color: "white",
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginVertical: 16,
    },
    lastUpdated: {
      fontFamily: "Roboto_400Regular",
      fontSize: 14,
      fontStyle: "italic",
      textAlign: "center",
      marginBottom: 8,
    },
    sectionTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 20,
      marginBottom: 12,
    },
    subTitle: {
      fontFamily: "Roboto_500Medium",
      fontSize: 16,
      marginBottom: 8,
      marginTop: 16,
    },
    paragraph: {
      fontFamily: "Roboto_400Regular",
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 12,
      textAlign: "justify",
    },
    bulletList: {
      marginLeft: 16,
      marginBottom: 12,
    },
    bulletPoint: {
      fontFamily: "Roboto_400Regular",
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 6,
    },
    bold: {
      fontFamily: "Roboto_500Medium",
      fontWeight: "600",
    },
    contactInfo: {
      marginLeft: 16,
      marginTop: 8,
    },
    contact: {
      fontFamily: "Roboto_500Medium",
      fontSize: 15,
      marginBottom: 4,
    },
    footer: {
      marginTop: 24,
      marginBottom: 40,
      padding: 16,
      backgroundColor: `${theme.colors.primary}10`,
      borderRadius: 8,
    },
    footerText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
      fontStyle: "italic",
    },
  });
