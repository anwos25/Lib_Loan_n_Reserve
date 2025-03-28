import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // useNavigation hook

const NotificationScreen = () => {
  const navigation = useNavigation(); // Get navigation using useNavigation hook

  const notifications = [
    {
      id: "1",
      message:
        "คำขอยืมแล็ปท็อป HP Pavilion ของคุณถูกส่งไปยังเจ้าหน้าที่แล้ว กรุณาติดต่อเพื่อรับอุปกรณ์",
      time: "1 นาทีที่ผ่านมา",
    },
    {
      id: "2",
      message:
        "คำขอยืมแล็ปท็อป HP Pavilion ของคุณถูกส่งไปยังเจ้าหน้าที่แล้ว กรุณาติดต่อเพื่อรับอุปกรณ์",
      time: "1 นาทีที่ผ่านมา",
    },
    // เพิ่มการแจ้งเตือนอื่น ๆ ที่นี่
  ];

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>การแจ้งเตือน</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Library")}>
            <Ionicons name="arrow-back" size={28} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>การแจ้งเตือน</Text>
          <Text style={styles.readAll}>อ่านทั้งหมด</Text>
        </View>
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  content: {
    flex: 1,
    padding: 20,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#122620",
  },
  readAll: {
    fontSize: 16,
    color: "#B68D40",
  },
  notificationItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  notificationMessage: {
    fontSize: 16,
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 14,
    color: "gray",
  },
});

export default NotificationScreen;
