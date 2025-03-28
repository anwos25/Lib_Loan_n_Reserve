import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RegisterUser, Rooms } from "../ServiceAPI/API"; // Import the updated RegisterUser function
import AlertModal from "../Component/AlertModal"; // Import the AlertModal component

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // 'success' or 'error'

  const handleRegister = async () => {
    if (!name || !username || !phone || !password || !confirmPassword) {
      setModalMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      setModalType("error");
      setModalVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setModalMessage("รหัสผ่านไม่ตรงกัน");
      setModalType("error");
      setModalVisible(true);
      return;
    }

    setLoading(true); // Start loading

    try {
      // Call the updated RegisterUser function
      const registerData = await RegisterUser(name, username, phone, password);
      console.log("User registered:", registerData);

      // Show success message and navigate to the Login screen
      setModalMessage("ลงทะเบียนเรียบร้อย");
      setModalType("success");
      setModalVisible(true);

      // Navigate to the Login screen
      navigation.navigate("Login");

      // Fetch rooms data after successful registration
      const roomData = await Rooms();
      console.log("Rooms fetched after registration:", roomData);
    } catch (error) {
      setLoading(false); // Stop loading on error
      setModalMessage(error.message || "ไม่สามารถลงทะเบียนได้");
      setModalType("error");
      setModalVisible(true);
    }

    setLoading(false); // Stop loading
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="ชื่อ-นามสกุล"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="ชื่อผู้ใช้"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="เบอร์โทรศัพท์"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="ยืนยันรหัสผ่าน"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          <Text style={styles.buttonText}>กำลังลงทะเบียน...</Text> // Show loading text
        ) : (
          <>
            <Ionicons name="person-add" size={20} color="#fff" />
            <Text style={styles.buttonText}>Register</Text>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</Text>
      </TouchableOpacity>

      <AlertModal
        isVisible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#122620",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  link: {
    color: "#122620",
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
