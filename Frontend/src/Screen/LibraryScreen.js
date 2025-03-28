import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const LibraryScreen = ({ route }) => {
  const navigation = useNavigation(); // Get navigation using useNavigation hook

  // Check if route.params and name are defined
  const name = route?.params?.name || "ผู้ใช้"; // Use a fallback name if not passed

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons
              name="notifications-outline"
              size={28}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile", { name: name })}>
            <Ionicons
              name="person-circle-outline"
              size={28}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.greeting}>
        {/* Display name */}
        <Text style={styles.greetingText}>สวัสดี, {name} 👋</Text>
        <Text style={styles.greetingSubText}>
          คุณมีการจองห้องที่กำลังจะถึง 0 รายการ
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Rooms")}>
          <Ionicons name="home-outline" size={30} color="#122620" />
          <Text style={styles.buttonText}>จองห้อง</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Items")}>
          <Ionicons name="briefcase-outline" size={30} color="#122620" />
          <Text style={styles.buttonText}>ยืมอุปกรณ์</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🛋️ การจองห้องที่กำลังจะถึง</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>ดูทั้งหมด</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.emptyText}>ไม่มีการจองห้องที่กำลังจะถึง</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📦 อุปกรณ์ที่กำลังยืม</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>ดูทั้งหมด</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.emptyText}>ไม่มีอุปกรณ์ที่กำลังยืม</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#122620",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 15,
  },
  greeting: {
    padding: 20,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#122620",
  },
  greetingSubText: {
    fontSize: 16,
    color: "gray",
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    marginTop: 5,
    color: '#242533',
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#122620",
  },
  sectionLink: {
    color: "#B68D40",
    fontWeight: "bold",
  },
  emptyText: {
    color: "gray",
    textAlign: "center",
  },
});

export default LibraryScreen;
