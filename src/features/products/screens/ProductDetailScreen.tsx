import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Header } from '../../../shared/components/Header';
import type { RootStackParamList } from '../../../types/navigation.types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;
type RouteType = RouteProp<RootStackParamList, 'ProductDetail'>;

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

export const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { product } = route.params;

  const handleEdit = useCallback(
    () => navigation.navigate('ProductForm', { mode: 'edit', product }),
    [navigation, product],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header />
      <View style={styles.titleSection}>
        <Text style={styles.title} testID="product-id">
          ID: {product.id}
        </Text>
        <Text style={styles.subtitle}>Información extra</Text>
      </View>
      <Image
        source={{ uri: product.logo }}
        style={styles.logo}
        testID="product-logo"
        resizeMode="contain"
      />
      <DetailRow label="Nombre" value={product.name} />
      <DetailRow label="Descripción" value={product.description} />
      <DetailRow label="Fecha liberación" value={product.date_release} />
      <DetailRow label="Fecha revisión" value={product.date_revision} />
      <TouchableOpacity style={styles.editButton} onPress={handleEdit} testID="edit-button">
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} testID="delete-button">
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 32 },
  titleSection: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  logo: { width: '100%', height: 120, marginVertical: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rowLabel: { fontSize: 14, color: '#888' },
  rowValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'right',
  },
  editButton: {
    backgroundColor: '#e0e0e0',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 24,
  },
  editButtonText: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  deleteButton: {
    backgroundColor: '#e53e3e',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
  },
  deleteButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
