import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, ScrollView } from "react-native";

import { Text, View } from "@/components/Themed";

export default function ModalScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>License and Credentials</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Text style={styles.content}>
        Developer: Fares Brayek{"\n"}
        GitHub: faresbrayek2{"\n"}
        Email: faresbrayek2@gmail.com
      </Text>

      <Text style={styles.loveText}>Made with ❤️ by Fares Brayek</Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "100%",
    maxWidth: 600, // Optional, for large screen sizes
  },
  content: {
    fontSize: 18,
    textAlign: "left",
    marginBottom: 20,
  },
  loveText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
