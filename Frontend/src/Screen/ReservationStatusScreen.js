


import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GetCurrentReservedRooms } from '../ServiceAPI/API';
import { useFocusEffect } from '@react-navigation/native';

const ReservationStatusScreen = ({ navigation, token, route }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user_id = route?.params?.user_id;
  const name = route?.params?.name || "ผู้ใช้";

  const fetchCurrentReservedRooms = async () => {
    try {
      console.log("📦 token:", token);
      console.log("👤 user_id:", user_id);

      setLoading(true);
      const data = await GetCurrentReservedRooms(token, user_id);
      console.log("📋 Reserved rooms data:", data);
      setReservations(data);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching reserved rooms:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCurrentReservedRooms();
    }, [token])
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#122620" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (reservations.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noReservationsText}>ไม่มีการจองในขณะนี้</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ประวัติการจอง</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Ionicons name="notifications-outline" size={28} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile", { name })}>
            <Ionicons name="person-circle-outline" size={28} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* รายการการจอง */}
      <FlatList
        data={reservations}
        renderItem={renderReservationItem}
        keyExtractor={(item) => item.booking_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

// const renderReservationItem = ({ item }) => (
//   <View style={styles.reservationCard}>
//     <Text style={styles.title}>ห้องที่จอง: {item.room_name}</Text>
//     <Text style={styles.status}>สถานะ: {item.status}</Text>
//     <View style={styles.infoContainer}>
//       <Ionicons name="information-circle-outline" size={20} color="grey" />
//       <Text style={styles.infoText}>
//         วันที่จอง: {new Date(item.booking_date).toLocaleDateString('th-TH')}
//       </Text>
//     </View>
//     <Text style={styles.infoText}>
//       เวลาเริ่ม: {new Date(item.start_time).toLocaleTimeString('th-TH')}
//     </Text>
//     <Text style={styles.infoText}>
//       เวลาสิ้นสุด: {new Date(item.end_time).toLocaleTimeString('th-TH')}
//     </Text>
//   </View>
// );

const renderReservationItem = ({ item }) => {
  console.log("📤 ข้อมูลเวลาจาก API:", {
    start_time: item.start_time,
    end_time: item.end_time
  });

  const bookingDate = new Date(item.booking_date);
  const startTime = new Date(`${item.booking_date}T${item.start_time}`);
  const endTime = new Date(`${item.booking_date}T${item.end_time}`);

  const isValid = (date) => date instanceof Date && !isNaN(date);

  return (
    <View style={styles.reservationCard}>
      <Text style={styles.title}>ห้องที่จอง: {item.room_name}</Text>
      <Text style={styles.status}>สถานะ: {item.status}</Text>

      <View style={styles.infoContainer}>
        <Ionicons name="information-circle-outline" size={20} color="grey" />
        <Text style={styles.infoText}>
          วันที่จอง: {isValid(bookingDate) ? bookingDate.toLocaleDateString("th-TH") : "ไม่สามารถแสดงวันที่"}
        </Text>
      </View>

      <Text style={styles.infoText}>
        เวลาเริ่ม: {isValid(startTime) ? startTime.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' }) : "ไม่สามารถแสดงเวลาเริ่ม"}
      </Text>
      <Text style={styles.infoText}>
        เวลาสิ้นสุด: {isValid(endTime) ? endTime.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' }) : "ไม่สามารถแสดงเวลาสิ้นสุด"}
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#122620',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  reservationCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#122620',
  },
  status: {
    fontSize: 16,
    color: '#B68D40',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 10,
    color: 'grey',
  },
  listContainer: {
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
  },
  noReservationsText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ReservationStatusScreen;
