import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";

const API_URL = "http://192.168.100.2:5000";

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [readNotifications, setReadNotifications] = useState(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedIds = await AsyncStorage.getItem("deletedNotifications");
      if (storedIds) setDeletedIds(new Set(JSON.parse(storedIds)));

      const { data } = await axios.get(`${API_URL}/notifications/1`);
      setNotifications(data.filter((n) => !deletedIds.has(n.notification_id)));
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to fetch notifications.");
    }
  };

  const removeNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.notification_id !== id)
    );
    setDeletedIds((prevIds) => {
      const updatedIds = new Set(prevIds);
      updatedIds.add(id);
      return updatedIds;
    });
    AsyncStorage.setItem("deletedNotifications", JSON.stringify([...deletedIds]));
  };

  const markAsRead = (id) => {
    setReadNotifications((prevRead) => {
      const updatedRead = new Set(prevRead);
      updatedRead.add(id);
      return updatedRead;
    });
  };

  const markAllAsRead = () => {
    // Mark all notifications as read
    const allNotificationIds = new Set(notifications.map((notification) => notification.notification_id));
    setReadNotifications(allNotificationIds);

    Alert.alert("All notifications marked as read");
  };

  const renderRightActions = (progress, dragX, item) => (
    <TouchableOpacity onPress={() => removeNotification(item.notification_id)}>
      <View style={styles.deleteButton}>
        <Ionicons name="trash-bin" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );

  const renderNotificationItem = ({ item }) => {
    const isRead = readNotifications.has(item.notification_id);
    return (
      <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
        <TouchableOpacity onPress={() => markAsRead(item.notification_id)}>
          <View
            style={[
              styles.notificationItem,
              { opacity: isRead ? 0.3 : 1 }, // Apply opacity change when marked as read
            ]}
          >
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.notificationTime}>
              {new Date(item.sent_at).toLocaleString()}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>การแจ้งเตือน</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>การแจ้งเตือน</Text>
          <Text style={styles.readAll} onPress={markAllAsRead}>
            อ่านทั้งหมด
          </Text>
        </View>
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.notification_id.toString()}
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
    textDecorationLine: "underline",
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
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default NotificationScreen;
