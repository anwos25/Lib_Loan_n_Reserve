import axios from "axios";
const API_URL = "http://192.168.100.2:5000"
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BorrowEquipmentCard from "../Component/BorrowEquipmentCard";
import { Items,  } from "../ServiceAPI/API";



const ItemloanScreen = ({ navigation, token,route }) => {
  const user_id = route?.params?.user_id;
  console.log("🧪 user_id ที่รับจาก route:", user_id); 
  const [searchText, setSearchText] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowedItems, setBorrowedItems] = useState(new Set());
  const name = route?.params?.name || "ผู้ใช้";
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const itemsData = await Items();
      setEquipment(itemsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowRequest = async (item) => {
    console.log("ส่งข้อมูล:", {
      user_id,
      item_id: item.id,
      quantity: 1,
      borrow_date: new Date().toISOString().split("T")[0],
      // คำนวณ return_date เป็น 15 วันจากวันนี้
      return_date: (() => {
        const today = new Date();
        const returnDate = new Date(today);
        returnDate.setDate(today.getDate() + 15); // เพิ่ม 15 วัน
        return returnDate.toISOString().split("T")[0]; // คืนวันที่
      })(),
    });
    const isAvailable = item.available_quantity > 0;
  
    if (borrowedItems.has(item.id)) {
      // ถ้ากดยืมซ้ำ → ยกเลิกการเลือก
      const updatedSet = new Set(borrowedItems);
      updatedSet.delete(item.id);
      setBorrowedItems(updatedSet);
    } else {
      try {
        // ✅ POST ไปยัง backend เพื่อยืม
        await axios.post(`${API_URL}/loans`, {
          user_id,  // 🛠 แนะนำดึงจาก token หรือ route.params
          item_id: item.id,
          quantity: 1,
          borrow_date: new Date().toISOString().split("T")[0],
          return_date: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0], // คืนใน 15 วัน
        });
  
        // ✅ เพิ่ม item นี้เข้า set ที่แสดงว่ายืมแล้ว
        setBorrowedItems((prev) => new Set([...prev, item.id]));
  
        // ✅ แสดง Alert ตามสถานะของอุปกรณ์
        if (isAvailable) {
          Alert.alert("ยืมสำเร็จ", `กรุณาติดต่อเจ้าหน้าที่เพื่อรับ "${item.name}"`, [
            {
              text: "ตกลง",
              onPress: () => navigation.navigate("Loans"),
            },
          ]);
        } else {
          Alert.alert("จองสำเร็จ", `คุณได้จอง "${item.name}" แล้ว`, [
            {
              text: "ตกลง",
              onPress: () => navigation.navigate("Loans"),
            },
          ]);
        }
      } catch (error) {
        console.error("❌ ยืมล้มเหลว:", error);
        Alert.alert(
          "เกิดข้อผิดพลาด",
          error.response?.data?.message || "ไม่สามารถยืมอุปกรณ์ได้ในขณะนี้",
          [{ text: "ตกลง" }]
        );
      }
    }
  };
  
  

  const filteredEquipment = equipment.filter(item =>
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
          <TouchableOpacity onPress={() => navigation.navigate("Profile",{ name : name })}>
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
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>ไม่พบอุปกรณ์</Text>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    backgroundColor: "#122620", // Matching LibraryScreen header style
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white", // Matching LibraryScreen header title style
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default ItemloanScreen;