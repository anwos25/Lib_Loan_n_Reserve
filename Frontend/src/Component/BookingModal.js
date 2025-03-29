import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
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

const BookingModal = ({ isVisible, onClose, onSave }) => {
  const [startTimeIndex, setStartTimeIndex] = useState(0);
  const [endTimeIndex, setEndTimeIndex] = useState(1);

  const handleSave = () => {
    onSave(timeOptions[startTimeIndex], timeOptions[endTimeIndex]);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>เลือกเวลา</Text>

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
