import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";

export default function Page() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const sendProjectToAPI = async () => {
    try {
      const token = await getToken();

      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await fetch(
        "https://projecstore-api.onrender.com/api/v1/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: "Project from Expo",
            description: "Testing POST from Expo with live token",
            techStack: "React Native",
            githubUrl: "https://github.com/abc",
            liveUrl: "https://example.com",
            imageUrl: "https://example.com/image.png",
          }),
        }
      );

      const data = await response.json();
      console.log("Response from API:", data);
    } catch (error) {
      console.error("Error posting project:", error);
    }
  };

  useEffect(() => {
    sendProjectToAPI();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <SignedIn>
          <Text style={styles.loggedInText}>
            Hello {user?.emailAddresses[0].emailAddress}
          </Text>
        </SignedIn>
        <SignedOut>
          <Link href="/(auth)/sign-in" style={styles.link}>
            <Text style={styles.linkText}>Sign in</Text>
          </Link>
          <Link href="/(auth)/sign-up" style={styles.link}>
            <Text style={styles.linkText}>Sign up</Text>
          </Link>
        </SignedOut>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Ensures SafeAreaView takes up full height
    backgroundColor: "#f8f8f8", // Light background color
  },
  container: {
    flex: 1,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    padding: 20, // Add some padding around the content
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  loggedInText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
  link: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff", // A common blue for buttons/links
    borderRadius: 8,
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
