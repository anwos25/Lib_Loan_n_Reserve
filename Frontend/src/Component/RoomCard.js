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
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.bookButtonText}>จองห้อง</Text>
      </TouchableOpacity>
      <Modal transparent={true} animationType="fade" visible={isVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.ModalContainer}>
            <Text style={styles.title}>จองห้อง</Text>
            <Text style={styles.msg}>{room.name}</Text>
            <Text style={styles.msg}>ความจุ: {room.capacity} คน</Text>
            <Text style={styles.msg}>
              ความจุ: {roombooking.booking_date} คน
            </Text>

            <TouchableOpacity
              style={styles.okButton}
              onPress={() => {
                setIsVisible(false);
              }}
            >
              {/*<Text style={styles.okButtonText}>เข้าสู่ระบบ</Text>*/}
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
    padding: 20, // เพิ่ม padding เพื่อให้การ์ดดูใหญ่ขึ้น
    marginBottom: 12, // เพิ่ม margin bottom เพื่อให้การ์ดมีระยะห่างกัน
    backgroundColor: "#f9f9f9", // เปลี่ยนสีพื้นหลังเป็นสีอ่อน
    borderRadius: 12, // เพิ่มขอบโค้งให้การ์ด
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // เพิ่มเงาให้การ์ดชัดขึ้น
    shadowOpacity: 0.15, // ลดความเข้มของเงา
    shadowRadius: 6, // เพิ่มรัศมีเงา
    elevation: 4, // เพิ่ม elevation สำหรับ Android
  },
  roomDetails: {
    flex: 1,
  },
  roomName: {
    fontSize: 18, // เพิ่มขนาดตัวอักษรชื่อห้อง
    fontWeight: "600", // เพิ่มความหนาตัวอักษร
    color: "#333", // เปลี่ยนสีตัวอักษร
    marginBottom: 4, // เพิ่ม margin bottom
  },
  capacityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8, // เพิ่ม margin top
  },
  capacityText: {
    marginLeft: 6, // เพิ่ม margin left
    fontSize: 14,
    color: "#666", // เปลี่ยนสีตัวอักษร
  },
  roomStatus: {
    fontSize: 16,
    color: "#28a745", // เปลี่ยนสีสถานะห้องเป็นสีเขียว
    fontWeight: "500", // เพิ่มความหนาตัวอักษร
    margin: 20,
  },
  bookButton: {
    backgroundColor: "#007bff", // เปลี่ยนสีปุ่ม
    paddingVertical: 10, // เพิ่ม padding vertical
    paddingHorizontal: 20, // เพิ่ม padding horizontal
    borderRadius: 25, // เพิ่มขอบโค้งให้ปุ่ม
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600", // เพิ่มความหนาตัวอักษร
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  ModalContainer: {
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
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    bordarRadius: 5,
  },
  okButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RoomCard;
