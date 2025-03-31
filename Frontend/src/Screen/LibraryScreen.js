import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { GetCurrentLoans, GetCurrentReservedRooms } from "../ServiceAPI/API";

const LibraryScreen = ({ route }) => {
  const navigation = useNavigation();
  const name = route?.params?.name || "ผู้ใช้";
  const user_id = route?.params?.user_id;
  const token = route?.params?.token;

  const [loans, setLoans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          // ดึงข้อมูลยืมอุปกรณ์แบบไม่ให้ crash ถ้าไม่มีของ
          try {
            const loanData = await GetCurrentLoans(token, user_id);
            setLoans(loanData);
          } catch (loanError) {
            console.warn("ไม่มีอุปกรณ์ที่ยืม:", loanError.message);
            setLoans([]); // เคลียร์ข้อมูลแทนการปล่อยให้ error
          }
  
          // ดึงข้อมูลการจองห้องตามปกติ
          const reservationData = await GetCurrentReservedRooms(token, user_id);
          setReservations(reservationData);
  
          const now = new Date();
          const upcoming = reservationData.filter(item => new Date(item.booking_date) >= now);
          setUpcomingReservations(upcoming);
        } catch (error) {
          console.error("❌ Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [user_id, token])
  );
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons name="notifications-outline" size={28} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile", { name })}>
            <Ionicons name="person-circle-outline" size={28} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.greeting}>
        <Text style={styles.greetingText}>สวัสดี, {name} 👋</Text>
        <Text style={styles.greetingSubText}>
          คุณมีการจองห้องที่กำลังจะถึง {upcomingReservations.length} รายการ
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Rooms", { name })}>
          <Ionicons name="home-outline" size={30} color="#122620" />
          <Text style={styles.buttonText}>จองห้อง</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Items", { name })}>
          <Ionicons name="briefcase-outline" size={30} color="#122620" />
          <Text style={styles.buttonText}>ยืมอุปกรณ์</Text>
        </TouchableOpacity>
      </View>

      {/* Reservations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏨 ห้องที่จอง</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ReservationStatus", { user_id, token })}>
            <Text style={styles.sectionLink}>ดูทั้งหมด</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#122620" />
        ) : reservations.length === 0 ? (
          <Text style={styles.emptyText}>ไม่มีการจองห้อง</Text>
        ) : (
          reservations.slice(0, 2).map((item) => (
            <View key={item.booking_id} style={styles.reservationItem}>
              <Text style={styles.reservationText}>📌 ห้อง: {item.room_name}</Text>
              <Text style={styles.reservationSubText}>📅 วันที่: {new Date(item.booking_date).toLocaleDateString('th-TH')}</Text>
            </View>
          ))
        )}
      </View>

      {/* Loans */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📦 อุปกรณ์ที่กำลังยืม</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Loans", { user_id, token })}>
            <Text style={styles.sectionLink}>ดูทั้งหมด</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#122620" />
        ) : loans.length === 0 ? (
          <Text style={styles.emptyText}>ไม่มีอุปกรณ์ที่กำลังยืม</Text>
        ) : (
          loans.slice(0, 2).map((item) => (
            <View key={item.loan_id} style={styles.loanItem}>
              <Text style={styles.loanText}>{item.name}</Text>
              <Text style={styles.loanSubText}>กำหนดคืน: {new Date(item.return_date).toLocaleDateString('th-TH')}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: "#122620" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "white" },
  headerIcons: { flexDirection: "row" },
  icon: { marginLeft: 15 },
  greeting: { padding: 20 },
  greetingText: { fontSize: 20, fontWeight: "bold", color: "#122620" },
  greetingSubText: { fontSize: 16, color: "gray" },
  buttonsContainer: { flexDirection: "row", justifyContent: "space-around", padding: 20 },
  button: { backgroundColor: "white", paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, elevation: 3, flex: 1, marginHorizontal: 5 },
  buttonText: { marginTop: 5, color: "#242533", fontWeight: "bold" },
  section: { padding: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#122620" },
  sectionLink: { color: "#B68D40", fontWeight: "bold" },
  emptyText: { color: "gray", textAlign: "center" },
  reservationItem: { backgroundColor: "#F5F5F5", padding: 10, borderRadius: 8, marginVertical: 5 },
  reservationText: { fontSize: 16, fontWeight: "bold", color: "#122620" },
  reservationSubText: { fontSize: 14, color: "gray" },
  loanItem: { backgroundColor: "#F5F5F5", padding: 10, borderRadius: 8, marginVertical: 5 },
  loanText: { fontSize: 16, fontWeight: "bold", color: "#122620" },
  loanSubText: { fontSize: 14, color: "gray" },
});

export default LibraryScreen;
