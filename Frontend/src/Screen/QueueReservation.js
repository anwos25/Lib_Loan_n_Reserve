import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QueueReservation = () => {
  return (
    <View style={styles.container}>
      <Text>การจองคิว</Text>
      {/* แสดงรายการการจองคิว */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QueueReservation;