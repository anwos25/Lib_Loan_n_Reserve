import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars"; // import Calendar
import axios from "axios";
import BorrowEquipmentCard from "../Component/BorrowEquipmentCard";
import { addLoan, Items } from "../ServiceAPI/API";

const ItemloanScreen = ({ navigation, token, route }) => {
  const user_id = route?.params?.user_id;
  console.log("🧪 user_id ที่รับจาก route:", user_id);
  
  const [searchText, setSearchText] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowedItems, setBorrowedItems] = useState(new Set());
  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(null); // Only one state to manage calendar visibility
  
  const API_URL = "http://192.168.1.121:5000";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const itemsData = await Items(); // Assuming this fetches your items from API
      setEquipment(itemsData); // Update the state with new data
    } catch (err) {
      console.log("Error fetching data: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarChange = (date) => {
    if (showCalendar === "borrow") {
      setBorrowDate(date);
    } else if (showCalendar === "return") {
      setReturnDate(date);
    }
    setShowCalendar(null); // Close the calendar after selection
  };

  const handleBorrowRequest = async (item) => {
    if (!borrowDate || !returnDate) {
      Alert.alert("⚠️ กรุณาเลือกวันที่ยืมและวันที่คืน");
      console.log("⚠️ กรุณาเลือกวันที่ยืมและวันที่คืนให้ครบถ้วน");
      return;
    }
  
    try {
      const status = item.available_quantity > 0 ? "borrowed" : "reserved";
      await addLoan(user_id, item.id, status, borrowDate, returnDate, token);
  
      setBorrowedItems((prev) => new Set([...prev, item.id]));
  
      Alert.alert(
        status === "borrowed" ? "ยืมสำเร็จ" : "จองสำเร็จ",
        `คุณได้${status === "borrowed" ? "ยืม" : "จอง"} "${item.name}" แล้ว`,
        [{ text: "ตกลง", onPress: () => navigation.navigate("Loans", { user_id, token, item_id: item.id }) }]
      );
    } catch (error) {
      Alert.alert("❌ ของหมดพี่");
      console.log("❌ ยืมล้มเหลว:", error.response?.data?.message || error.message);
    }
  };

  const filteredEquipment = equipment.filter((item) =>
    item.name.toLowerCase().startsWith(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#122620" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>เกิดข้อผิดพลาด: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ส่วนหัว */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Items</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons
              name="notifications-outline"
              size={28}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile", { name: "ผู้ใช้" })}>
            <Ionicons
              name="person-circle-outline"
              size={28}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ช่องค้นหา */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาอุปกรณ์"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* รายการอุปกรณ์ */}
      <View style={styles.equipmentListContainer}>
        <Text style={styles.equipmentListTitle}>อุปกรณ์ทั้งหมด</Text>
        <FlatList
          data={filteredEquipment}
          renderItem={({ item }) => (
            <BorrowEquipmentCard
              equipmentData={item}
              isBorrowed={borrowedItems.has(item.id)}
              onBorrowPress={() => handleBorrowRequest(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => <Text style={styles.emptyText}>ไม่พบอุปกรณ์</Text>}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Calendar */}
      <TouchableOpacity style={styles.calendarButton} onPress={() => setShowCalendar("borrow")}>
        <Text style={styles.calendarButtonText}>Select Borrow Date</Text>
      </TouchableOpacity>
      {showCalendar === "borrow" && (
        <Calendar
          onDayPress={(day) => handleCalendarChange(day.dateString)}
          markedDates={{ [borrowDate]: { selected: true, selectedColor: "blue" } }}
        />
      )}
      <Text>Borrow Date: {borrowDate}</Text>

      <TouchableOpacity style={styles.calendarButton} onPress={() => setShowCalendar("return")}>
        <Text style={styles.calendarButtonText}>Select Return Date</Text>
      </TouchableOpacity>
      {showCalendar === "return" && (
        <Calendar
          onDayPress={(day) => handleCalendarChange(day.dateString)}
          markedDates={{ [returnDate]: { selected: true, selectedColor: "blue" } }}
        />
      )}
      <Text>Return Date: {returnDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  equipmentListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  equipmentListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  icon: {
    marginLeft: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  calendarButton: {
    backgroundColor: "#122620",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 12,
    alignItems: "center",
  },
  calendarButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ItemloanScreen;
