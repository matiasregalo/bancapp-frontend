import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './Header.styles';

export const Header: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>BANCO</Text>
  </View>
);
