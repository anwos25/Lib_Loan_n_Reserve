import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { rooms } from "../ServiceAPI/API";

const BookingScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([rooms]);

  const renderRoomItem = ({ item }) => (
    <View style={styles.roomItem}>
      <View style={styles.roomDetails}>
        <Text style={styles.roomName}>{item.name}</Text>
        <View style={styles.capacityContainer}>
          <Ionicons name="people" size={16} color="gray" />
          <Text style={styles.capacityText}>ความจุ: {item.capacity} คน</Text>
        </View>
      </View>
      <Text style={styles.roomStatus}>{item.status}</Text>
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>จองห้อง</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ส่วนหัว */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rooms</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons name="notifications-outline" size={28} color="white" style={styles.icon}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person-circle-outline" size={28} color="white" style={styles.icon}/>
          </TouchableOpacity>
        </View>
      </View>

      {/* แถบตัวกรอง */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>ทั้งหมด</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>ห้องเดี่ยว</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>ห้องกลุ่ม</Text>
        </TouchableOpacity>
      </View>

      {/* รายการห้องที่ว่าง */}
      <View style={styles.roomsList}>
        <Text style={styles.roomsListTitle}>ห้องที่ว่าง ({rooms.length})</Text>
        {/* <FlatList
          data={rooms}
          renderItem={renderRoomItem}
          keyExtractor={(item) => item.id}
        /> */}
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
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  filterButtonText: {
    fontSize: 16,
  },
  roomsList: {
    padding: 16,
  },
  roomsListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  roomItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  roomDetails: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  capacityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  capacityText: {
    marginLeft: 4,
    fontSize: 14,
    color: "gray",
  },
  roomStatus: {
    fontSize: 16,
    color: "green",
  },
  bookButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  icon: {
    marginLeft: 15,
  },
});

export default BookingScreen;