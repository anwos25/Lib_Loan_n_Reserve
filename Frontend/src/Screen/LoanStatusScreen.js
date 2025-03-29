import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';
import { GetCurrentLoans } from '../ServiceAPI/API';
import { useFocusEffect } from '@react-navigation/native';
import BorrowedContent from '../Component/BorrowedContent';

  const LoanStatusContent = ({ token,route}) => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const name = route?.params?.name || "ผู้ใช้";
    

    const fetchCurrentLoans = async () => {
      try {
        setLoading(true);
        const data = await GetCurrentLoans(token);
        setLoans(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    useFocusEffect(
      React.useCallback(() => {
        fetchCurrentLoans();
      }, [])
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

    if (loans.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noLoansText}>ไม่มีรายการยืมในขณะนี้</Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContentContainer}>
        <FlatList
          data={loans}
          renderItem={renderLoanItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    );
  };

  const BorrowHistoryContent = () => (
    <View style={styles.tabContentContainer}>
      <Text style={styles.title}>ประวัติการยืม</Text>
      {/* แสดงรายการประวัติการยืม */}
    </View>
  );

  const QueueReservationContent = () => (
    <View style={styles.tabContentContainer}>
      <Text style={styles.title}>การจองคิว</Text>
      {/* แสดงรายการการจองคิว */}
    </View>
  );

  const renderLoanItem = ({ item }) => (
    <View style={styles.loanCard}>
      <Text style={styles.title}>{item.equipment_name}</Text>
      {item.status === 'waiting_pickup' ? (
        <>
          <Text style={styles.waitingStatus}>รอรับอุปกรณ์</Text>
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color="grey" />
            <Text style={styles.infoText}>
              กรุณาติดต่อเจ้าหน้าที่เพื่อรับอุปกรณ์
            </Text>
          </View>
          <TouchableOpacity style={styles.waitingButton}>
            <Text style={styles.waitingButtonText}>รอรับอุปกรณ์</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.status}>สถานะ: {item.status}</Text>
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color="grey" />
            <Text style={styles.infoText}>
              วันที่ยืม: {new Date(item.borrow_date).toLocaleDateString('th-TH')}
            </Text>
          </View>
          <Text style={styles.infoText}>
            กำหนดคืน: {new Date(item.return_date).toLocaleDateString('th-TH')}
          </Text>
        </>
      )}
    </View>
  );

  const LoanStatusScreen = ({ navigation, token ,route}) => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'first', title: 'กำลังยืม' },
      { key: 'second', title: 'ประวัติการยืม' },
      { key: 'third', title: 'การจองคิว' },
    ]);
    const name = route?.params?.name || "ผู้ใช้";

    const renderScene = ({ route }) => {
      switch (route.key) {
        case 'first':
          return <LoanStatusContent token={token} />;
        case 'second':
          return <BorrowHistoryContent />;
        case 'third':
          return <QueueReservationContent />;
        default:
          return null;
      }
    };

    const renderTabBar = props => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: '#B68D40' }}
        style={{ backgroundColor: '#122620' }}
        renderLabel={({ route, focused }) => (
          <Text style={[
            styles.tabLabel,
            focused && styles.tabLabelFocused
          ]}>
            {route.title}
          </Text>
        )}
      />
    );

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Loans</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Ionicons name="notifications-outline" size={28} color="white" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Profile",{ name : name })}>
              <Ionicons name="person-circle-outline" size={28} color="white" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab View */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
          initialLayout={{ width: Dimensions.get('window').width }}
        />
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
  tabContentContainer: {
    flex: 1,
    padding: 20,
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
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    marginTop: 5,
    color: '#B68D40',
    fontWeight: 'bold',
  },
  tabLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    margin: 8,
  },
  tabLabelFocused: {
    color: 'white',
    fontWeight: 'bold',
  },
  waitingStatus: {
    fontSize: 16,
    color: '#B68D40',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  waitingButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  waitingButtonText: {
    color: '#B68D40',
    fontWeight: 'bold',
    fontSize: 14,
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
  noLoansText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    padding: 10,
  },
  loanCard: {
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
});

export default LoanStatusScreen;