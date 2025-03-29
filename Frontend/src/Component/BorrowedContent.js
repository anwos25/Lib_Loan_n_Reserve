import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";



const BorrowedContent = ({ user_id }) => {
    console.log("USER ID:", user_id);

  const [borrowedItems, setBorrowedItems] = useState([]);

  useEffect(() => {
    fetchBorrowed();
  }, []);

  const fetchBorrowed = async () => {
    try {
      const res = await axios.get(`${API_URL}/loans/borrowed/${user_id}`);
      setBorrowedItems(res.data);
    } catch (error) {
      console.error("โหลดข้อมูลกำลังยืมล้มเหลว", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>📦 {item.name}</Text>
      <Text>📅 ยืมเมื่อ: {item.borrow_date}</Text>
      <Text>📅 คืนภายใน: {item.due_date}</Text>
      <Text style={styles.status}>⏳ สถานะ: กำลังยืม</Text>
    </View>
  );

  return (
    <FlatList
      data={borrowedItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.loan_id.toString()}
      ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีรายการยืม</Text>}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    marginTop: 6,
    color: "orange",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#888",
  },
});

export default BorrowedContent;
