import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Header: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>BANCO</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
});
