import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GetCurrentLoans, returnLoan } from '../ServiceAPI/API';
import { useFocusEffect } from '@react-navigation/native';

const LoanStatusScreen = ({ navigation, route }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user_id = route?.params?.user_id;
  const token = route?.params?.token;
  const item_id = route?.params?.item_id;

  console.log("🧪 user_id ที่รับจาก route (Loan):", user_id);
  console.log("🧪 item_id ที่รับจาก route (LoanStatus):", item_id);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCurrentLoans = async () => {
        if (!user_id) {
          setError("ไม่พบข้อมูลผู้ใช้");
          setLoading(false);
          return;
        }
        try {
          setLoading(true);
          const data = await GetCurrentLoans(token, user_id);
          setLoans(data);
          setError(null);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCurrentLoans();
    }, [token, user_id])
  );

  const handleReturnLoan = async (loan_id, item_id) => {
    try {
      await returnLoan(loan_id, item_id, token);
      alert("คืนอุปกรณ์สำเร็จ");
      setLoans(loans.filter(loan => loan.loan_id !== loan_id)); // ลบรายการที่คืนออกจาก state
    } catch (error) {
      alert(`ไม่สามารถคืนอุปกรณ์ได้: ${error.message}`);
    }
  };

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
        <Text style={styles.noLoansText}>ไม่มีรายการยืมในขณะนี้</Text>
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
    <View style={styles.container}>
      <FlatList
        data={loans}
        renderItem={({ item }) => (
          <View style={styles.loanCard}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.infoText}>Loan ID: {item.loan_id}</Text>
            <Text style={styles.infoText}>วันที่ยืม: {new Date(item.borrow_date).toLocaleDateString('th-TH')}</Text>
            <Text style={styles.infoText}>กำหนดคืน: {new Date(item.return_date).toLocaleDateString('th-TH')}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleReturnLoan(item.loan_id, item_id)}
            >
              <Ionicons name="arrow-undo-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.loan_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noLoansText: {
    color: '#666',
    fontSize: 16,
  },
  loanCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#122620',
  },
  infoText: {
    fontSize: 14,
    color: 'grey',
  },
  button: {
    backgroundColor: '#B68D40',
    padding: 10,
    borderRadius: 50,
    position: 'absolute',
    right: 15,
    top: 15,
  },
});

export default LoanStatusScreen;
