import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RoomCard = ({ room, roombooking }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.roomDetails}>
        <Text style={styles.roomName}>{room.name}</Text>
        <View style={styles.capacityContainer}>
          <Ionicons name="people" size={16} color="gray" />
          <Text style={styles.capacityText}>ความจุ: {room.capacity} คน</Text>
        </View>
      </View>
      <Text style={styles.roomStatus}>{room.status}</Text>
      <TouchableOpacity style={styles.bookButton} onPress={() => setIsVisible(true)}>
        <Text style={styles.bookButtonText}>จองห้อง</Text>
      </TouchableOpacity>

      {/* Modal สำหรับการจองห้อง */}
      <Modal transparent={true} animationType="fade" visible={isVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>จองห้อง</Text>
            <Text style={styles.msg}>{room.name}</Text>
            <Text style={styles.msg}>ความจุ: {room.capacity} คน</Text>
            {roombooking?.booking_date && (
              <Text style={styles.msg}>วันที่จอง: {roombooking.booking_date}</Text>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsVisible(false)}>
              <Text style={styles.closeButtonText}>ปิด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  roomDetails: {
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  capacityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  capacityText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
  },
  roomStatus: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "500",
    margin: 20,
  },
  bookButton: {
    backgroundColor: "#122620",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 350,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  msg: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RoomCard;
