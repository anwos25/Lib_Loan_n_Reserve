import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';

const generateTimeSlots = () => {
  const times = [];
  for (let hour = 8; hour <= 22; hour++) {
    for (let min of [0, 30]) {
      times.push(`${hour.toString().padStart(2, "0")}:${min === 0 ? "00" : "30"}`);
    }
  }
  return times;
};

const timeOptions = generateTimeSlots();

const BookingModal = ({ isVisible, onClose, onSave, room }) => {
  const [startTimeIndex, setStartTimeIndex] = useState(0);
  const [endTimeIndex, setEndTimeIndex] = useState(1);

  const handleSave = () => {
    onSave(timeOptions[startTimeIndex], timeOptions[endTimeIndex]);
    onClose();
  };

  return (
    <Modal transparent={true} animationType="fade" visible={isVisible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>จองห้อง</Text>
          <Text style={styles.msg}>{room.room_name}</Text> 
          <Text style={styles.msg}>ความจุ: {room.capacity} คน</Text>
          
          {/* เลือกเวลาเริ่ม */}
          <Text style={styles.label}>เวลาเริ่ม:</Text>
          <Picker
            selectedValue={startTimeIndex}
            onValueChange={(itemValue) => setStartTimeIndex(itemValue)}
            style={styles.picker}
          >
            {timeOptions.map((time, index) => (
              <Picker.Item key={index} label={time} value={index} />
            ))}
          </Picker>

          {/* เลือกเวลาจบ */}
          <Text style={styles.label}>เวลาจบ:</Text>
          <Picker
            selectedValue={endTimeIndex}
            onValueChange={(itemValue) => setEndTimeIndex(itemValue)}
            style={styles.picker}
          >
            {timeOptions.slice(startTimeIndex + 1).map((time, index) => (
              <Picker.Item key={index + startTimeIndex + 1} label={time} value={index + startTimeIndex + 1} />
            ))}
          </Picker>

          {/* ปุ่มบันทึกและปิด */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>บันทึกการจอง</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


const RoomCard = ({ room, onPressBook }) => {
  return (
    <View style={styles.card}>
      <View style={styles.roomDetails}>
        <Text style={styles.roomName}>{room.room_name}</Text>
        <View style={styles.capacityContainer}>
          <Ionicons name="people" size={16} color="gray" />
          <Text style={styles.capacityText}>ความจุ: {room.capacity} คน</Text>
        </View>
      </View>

      <Text style={styles.roomStatus}>{room.status}</Text>

      <TouchableOpacity style={styles.bookButton} onPress={() => {
        console.log("🔔 กำลังกดจองห้องจาก RoomCard:", room);
        onPressBook(); // ✅ ส่ง event ไปให้ BookingScreen.js
      }}>
        <Text style={styles.bookButtonText}>จองห้อง</Text>
      </TouchableOpacity>
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: 200,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "gray",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  bookingInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
});

export default RoomCard;


//// const RoomCard = ({ room, roombooking }) => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [bookingDetails, setBookingDetails] = useState(null);

//   const handleBookingSave = (startTime, endTime) => {
//     setBookingDetails({ startTime, endTime });
//   };

//   return (
//     <View style={styles.card}>
//       <View style={styles.roomDetails}>
//         <Text style={styles.roomName}>{room.name}</Text>
//         <View style={styles.capacityContainer}>
//           <Ionicons name="people" size={16} color="gray" />
//           <Text style={styles.capacityText}>ความจุ: {room.capacity} คน</Text>
//         </View>
//       </View>
//       <Text style={styles.roomStatus}>{room.status}</Text>
//       <TouchableOpacity style={styles.bookButton} onPress={() => setIsModalVisible(true)}>
//         <Text style={styles.bookButtonText}>จองห้อง</Text>
//       </TouchableOpacity>

//       {/* Booking Modal */}
//       <BookingModal
//         isVisible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//         onSave={handleBookingSave}
//         room={room}
//       />
      
//       {/* แสดงข้อมูลการจองห้อง */}
//       {bookingDetails && (
//         <View style={styles.bookingInfo}>
//           <Text>เวลาเริ่ม: {bookingDetails.startTime}</Text>
//           <Text>เวลาจบ: {bookingDetails.endTime}</Text>
//         </View>
//       )}
//     </View>
//   );
// };