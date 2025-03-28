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
import { LoginUser } from "../ServiceAPI/API";
import AlertModal from "../Component/AlertModal";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // 'success' or 'error'

  const handleLogin = async () => {
    if (!username || !password) {
      setModalMessage("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      setModalType("error");
      setModalVisible(true);
      return;
    }
  
    setLoading(true);
  
    try {
      const token = await LoginUser(username, password);
      const userId = token?.userId;  // Assuming `token` contains the `userId`
  
      console.log("Login successful. Token:", token);
  
      setModalMessage("เข้าสู่ระบบเรียบร้อย");
      setModalType("success");
      setModalVisible(true);
  
      // Set a delay to show the modal for a longer time
      setTimeout(() => {
        // Pass the username and userId to the Library screen
        navigation.navigate("Main", {
          screen: "Library",
          params: { name: username, user_id: userId }, // Passing user_id along with name
        });
      }, 300);
  
    } catch (error) {
      setLoading(false);
  
      console.log("Login Error:", error);
  
      let errorMessage = "เข้าสู่ระบบไม่สำเร็จ";
      if (error.response) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
  
      setModalMessage(errorMessage);
      setModalType("error");
      setModalVisible(true);
    }
  
    setLoading(false);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="ชื่อผู้ใช้"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <Text style={styles.buttonText}>กำลังเข้าสู่ระบบ...</Text> // Show loading text
        ) : (
          <>
            <Ionicons name="log-in" size={20} color="#fff" />
            <Text style={styles.buttonText}>Login</Text>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Regis")}>
        <Text style={styles.link}>ยังไม่มีบัญชี? ลงทะเบียน</Text>
      </TouchableOpacity>

      {/* AlertModal component for showing messages */}
      <AlertModal
        isVisible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)} // Close modal on button click
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

export default LoginScreen;
