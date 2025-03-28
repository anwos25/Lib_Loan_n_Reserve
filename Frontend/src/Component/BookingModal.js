import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";

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
          <View style={styles.timeSelector}>
            <TouchableOpacity
              onPress={() => setStartTimeIndex(Math.max(0, startTimeIndex - 1))}
              style={styles.timeButton}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.timeText}>{timeOptions[startTimeIndex]}</Text>
            <TouchableOpacity
              onPress={() =>
                setStartTimeIndex(Math.min(timeOptions.length - 2, startTimeIndex + 1))
              }
              style={styles.timeButton}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* เลือกเวลาจบ */}
          <Text style={styles.label}>เวลาจบ:</Text>
          <View style={styles.timeSelector}>
            <TouchableOpacity
              onPress={() => setEndTimeIndex(Math.max(startTimeIndex + 1, endTimeIndex - 1))}
              style={styles.timeButton}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.timeText}>{timeOptions[endTimeIndex]}</Text>
            <TouchableOpacity
              onPress={() =>
                setEndTimeIndex(Math.min(timeOptions.length - 1, endTimeIndex + 1))
              }
              style={styles.timeButton}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>

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
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  timeButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
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
});

export default BookingModal;
