import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Rooms } from "../ServiceAPI/API";
import RoomCard from "../Component/RoomCard";
import BookingModal from "../Component/BookingModal";
import { Calendar } from "react-native-calendars";
import { addReserve } from "../ServiceAPI/API"; // นำเข้า addReserve API

const BookingScreen = ({ navigation, route }) => {
  const name = route?.params?.name || "ผู้ใช้"; // รับค่าชื่อจาก route.params ถ้ามี

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(""); // Date selection state

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await Rooms();
      console.log("Fetched Rooms:", data);
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [])
  );

  const renderRoomItem = ({ item }) => (
    <RoomCard
      room={item}
      onPressBook={() => openModal(item)}
      style={item.is_available === 0 ? { opacity: 0.3 } : {}} // ปรับ opacity สำหรับห้องที่ไม่ว่าง
    />
  );

  const openModal = (room) => {
    console.log("🖱️ กดปุ่มจอง ห้อง:", room);
    setSelectedRoom(room);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };


  
  const handleSaveBooking = (bookingDetails, response) => {
    console.log("📦 Booking received in BookingScreen:", bookingDetails);
    console.log("✅ API response:", response);
    closeModal();
  };
  
  
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rooms</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons name="notifications-outline" size={28} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile", { name: name })}>
            <Ionicons name="person-circle-outline" size={28} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

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

      <View style={styles.calendarContainer}>
        <Text style={styles.calendarTitle}>เลือกวันที่:</Text>
        <Calendar
         onDayPress={(day) => {
            setSelectedDate(day.dateString);
          console.log("Selected Date:", day.dateString);  // Log the selected date
               }}
             markedDates={{
             [selectedDate]: {
             selected: true,
               selectedColor: "#B68D40",
                 selectedTextColor: "white",
               },
              }}
            />

      </View>

      {/* {selectedDate ? (
        <View style={styles.roomsList}>
          <Text style={styles.roomsListTitle}>
            ห้องที่ว่างสำหรับวันที่ {selectedDate} ({rooms.length})
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : rooms.length > 0 ? (
            <FlatList
              data={rooms}
              renderItem={renderRoomItem}
              keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
            />
          ) : (
            <Text>ไม่พบห้องที่ว่างในวันที่เลือก</Text>
          )}
        </View>
      ) : (
        <Text style={styles.roomsListTitle}>กรุณาเลือกวันที่ก่อน</Text>
      )} */}
      {selectedDate ? (
  <View style={{ flex: 1 }}>
    <Text style={styles.roomsListTitle}>
      ห้องที่ว่างสำหรับวันที่ {selectedDate} ({rooms.length})
    </Text>
    {loading ? (
      <ActivityIndicator size="large" color="#007AFF" />
    ) : rooms.length > 0 ? (
      <FlatList
        data={rooms}
        renderItem={renderRoomItem}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        contentContainerStyle={{ padding: 16 }}
      />
    ) : (
      <Text>ไม่พบห้องที่ว่างในวันที่เลือก</Text>
    )}
  </View>
) : (
  <Text style={styles.roomsListTitle}>กรุณาเลือกวันที่ก่อน</Text>
)}


      <BookingModal
  isVisible={isModalVisible}
  onClose={closeModal}
  onSave={handleSaveBooking}
  user_id={route?.params?.user_id}
  token={route?.params?.token}
  selectedDate={selectedDate}
  room={selectedRoom}
/>

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
  calendarContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  calendarTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  roomsList: {
    padding: 16,
  },
  roomsListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  icon: {
    marginLeft: 15,
  },
});

export default BookingScreen;