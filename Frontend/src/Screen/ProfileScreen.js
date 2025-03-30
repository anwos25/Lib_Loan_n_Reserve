import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Linking, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  
  const { name } = route?.params || {};
  
  const [userData, setUserData] = useState(null);  
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);

  useEffect(() => {
    if (name) {
      const fetchUserData = async () => {
        try {
          setLoading(true);  
          setError(null);  

          if (!name) {
            throw new Error("Name query parameter is required");
          }

          const response = await axios.get(`http://192.168.1.121:5000/user`, {
            params: { name }
          });

          if (response.data && response.data.length > 0) {
            setUserData(response.data[0]);
          } else {
            setError('ไม่พบข้อมูลผู้ใช้');
          }
        } catch (error) {
          setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
          setLoading(false);
        } 
      };

      fetchUserData();
    }
  }, [name]); 

  const handleSettingChange = (settingType, value) => {
    if (settingType === 'darkMode') {
      setDarkMode(value);
    } else if (settingType === 'notifications') {
      setNotificationsEnabled(value);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Library')}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userData?.name}</Text>
        <Text style={styles.userPhone}>📞 {userData?.phone}</Text>
      </View>

      <View style={styles.settings}>
        <Text style={styles.settingsTitle}>การตั้งค่า</Text>
        <View style={styles.settingItem}>
          <Ionicons name="moon-outline" size={24} color="grey" />
          <Text style={styles.settingText}>โหมดมืด</Text>
          <Switch
            value={darkMode}
            onValueChange={(value) => handleSettingChange('darkMode', value)}
            style={styles.settingSwitch}
          />
        </View>
        <View style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color="gray" />
          <Text style={styles.settingText}>การแจ้งเตือน</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => handleSettingChange('notifications', value)}
            style={styles.settingSwitch}
          />
        </View>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Login')}>
          <Ionicons name="log-out-outline" size={24} color="gray" />
          <Text style={styles.settingText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contact}>
        <Text style={styles.contactTitle}>ติดต่อเรา</Text>
        <Text style={styles.contactText}>มีปัญหาหรือข้อสงสัยเกี่ยวกับการใช้งานระบบ? ติดต่อเจ้าหน้าที่ได้ที่</Text>
        <TouchableOpacity style={styles.contactInfo} onPress={() => Linking.openURL(`tel:${'02-123-4567'}`)}>
          <Ionicons name="call-outline" size={24} color="gray" />
          <Text style={styles.contactText}>02-123-4567</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactInfo} onPress={() => Linking.openURL(`mailto:${'library@example.ac.th'}`)}>
          <Ionicons name="mail-outline" size={24} color="gray" />
          <Text style={styles.contactText}>library@example.ac.th</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  userInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  userName: {
    fontSize: 46,
    fontWeight: 'bold',
  },
  userPhone: {
    fontSize: 18,
    color: 'gray',
  },
  settings: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingText: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  settingSwitch: {
    marginLeft: 'auto',
  },
  contact: {
    padding: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default ProfileScreen;
