
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
// } from "react-native";
// import { Picker } from '@react-native-picker/picker';

// const generateTimeSlots = () => {
//   const times = [];
//   for (let hour = 8; hour <= 22; hour++) {
//     for (let min of [0, 30]) {
//       times.push(`${hour.toString().padStart(2, "0")}:${min === 0 ? "00" : "30"}`);
//     }
//   }
//   return times;
// };

// const timeOptions = generateTimeSlots();

// const BookingModal = ({ isVisible, onClose, onSave, user_id, room, selectedDate, token }) => {
//   const [startTimeIndex, setStartTimeIndex] = useState(0);
// const [endTimeIndex, setEndTimeIndex] = useState(1);


// const handleSave = async () => {
//   const startTime = timeOptions[startTimeIndex];
//   const endTime = timeOptions[endTimeIndex];
  
//   console.log("Booking Details:", {
//     user_id,
//     room_id: room.room_id,
//     selectedDate,
//     startTime,
//     endTime,
//   });
  
//   try {
//     const bookingDate = selectedDate;
//     const response = await addReserve(user_id, room.room_id, bookingDate, startTime, endTime, token);
    
//     // ส่งข้อมูลที่บันทึกกลับไปยังหน้า BookingScreen
//     onSave({
//       user_id,
//       room_id: room.room_id,
//       selectedDate,
//       startTime,
//       endTime,
//     }, response);
//     onClose();
//   } catch (error) {
//     console.error("Error while making reservation:", error.message);
//   }
// };


//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={isVisible}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>เลือกเวลา</Text>

//           {/* Select Start Time */}
//           <Text style={styles.label}>เวลาเริ่ม:</Text>
//           <Picker
//             selectedValue={startTimeIndex}
//             onValueChange={(itemValue) => {
//               setStartTimeIndex(itemValue);
//               console.log("Selected Start Time:", timeOptions[itemValue]);
//             }}
//             style={styles.picker}
//           >
//             {timeOptions.map((time, index) => (
//               <Picker.Item key={index} label={time} value={index} />
//             ))}
//           </Picker>

//           {/* Select End Time */}
//           <Text style={styles.label}>เวลาเสร็จ:</Text>
//           <Picker
//             selectedValue={endTimeIndex}
//             onValueChange={(itemValue) => {
//               setEndTimeIndex(itemValue);
//               console.log("Selected End Time:", timeOptions[itemValue]);
//             }}
//             style={styles.picker}
//           >
//             {timeOptions.slice(startTimeIndex + 1).map((time, index) => (
//               <Picker.Item key={index + startTimeIndex + 1} label={time} value={index + startTimeIndex + 1} />
//             ))}
//           </Picker>

//           {/* Save and Close Buttons */}
//           <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//             <Text style={styles.saveButtonText}>บันทึกการจอง</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//             <Text style={styles.closeButtonText}>ปิด</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 10,
//     width: "80%",
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   picker: {
//     height: 50,
//     width: 200,
//     marginTop: 5,
//   },
//   saveButton: {
//     backgroundColor: "#122620",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     marginTop: 10,
//   },
//   saveButtonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   closeButton: {
//     backgroundColor: "gray",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     marginTop: 10,
//   },
//   closeButtonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
// });

// export default BookingModal;



import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { addReserve } from "../ServiceAPI/API"; // ✅ ต้อง import มาใช้

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

const BookingModal = ({ isVisible, onClose, onSave, user_id, room, selectedDate, token }) => {
  console.log("📥 BookingModal rendered");
  console.log("📥 Modal isVisible:", isVisible);
  const [startTimeIndex, setStartTimeIndex] = useState(0);
  const [endTimeIndex, setEndTimeIndex] = useState(1);

  const handleSave = async () => {
    const startTime = timeOptions[startTimeIndex];
    const endTime = timeOptions[endTimeIndex];

    console.log("📦 Booking Details (to send):", {
      user_id,
      room_id: room.room_id,
      selectedDate,
      startTime,
      endTime,
      token,
    });

    try {
      const response = await addReserve(
        user_id,
        room.room_id,
        selectedDate,
        startTime,
        endTime,
        token
      );

      console.log("✅ Booking success:", response);

      onSave(
        {
          user_id,
          room_id: room.room_id,
          selectedDate,
          startTime,
          endTime,
        },
        response
      );

      onClose();
    } catch (error) {
      console.error("❌ Booking failed:", error.message);
      alert("จองไม่สำเร็จ: " + (error.message || "Unknown error"));
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>เลือกเวลา</Text>

          <Text style={styles.label}>เวลาเริ่ม:</Text>
          <Picker
            selectedValue={startTimeIndex}
            onValueChange={(itemValue) => {
              setStartTimeIndex(itemValue);
            }}
            style={styles.picker}
          >
            {timeOptions.map((time, index) => (
              <Picker.Item key={index} label={time} value={index} />
            ))}
          </Picker>

          <Text style={styles.label}>เวลาเสร็จ:</Text>
          <Picker
            selectedValue={endTimeIndex}
            onValueChange={(itemValue) => {
              setEndTimeIndex(itemValue);
            }}
            style={styles.picker}
          >
            {timeOptions.slice(startTimeIndex + 1).map((time, index) => (
              <Picker.Item key={index + startTimeIndex + 1} label={time} value={index + startTimeIndex + 1} />
            ))}
          </Picker>

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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
    backgroundColor: "#122620",
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
});

export default BookingModal;
