import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment"; // ใช้ moment.js เพื่อจัดการวันที่

const BorrowEquipmentCard = ({ equipmentData }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{equipmentData.name}</Text>
      <Text style={styles.description}>{equipmentData.description}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>พร้อมให้ยืม:</Text>
          <Text style={styles.infoValue}>
            {equipmentData.available} / {equipmentData.total_quantity}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>วันที่เพิ่ม:</Text>
          <Text style={styles.infoValue}>
            {moment(equipmentData.created_at).format("DD/MM/YYYY")}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.borrowButton}>
        <Text style={styles.borrowButtonText}>ยืม</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  infoValue: {
    color: "#666",
  },
  borrowButton: {
    backgroundColor: "#122620",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    position: "absolute", // เปลี่ยน position เป็น absolute
    bottom: 15, // จัดวางให้ห่างจากขอบด้านล่าง
    right: 15, // จัดวางให้ห่างจากขอบด้านขวา
  },
  borrowButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BorrowEquipmentCard;
