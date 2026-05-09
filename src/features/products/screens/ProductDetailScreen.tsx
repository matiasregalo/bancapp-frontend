import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Header } from '../../../shared/components/Header';
import { ROUTES } from '../../../types/navigation.types';
import type { RootStackParamList } from '../../../types/navigation.types';
import { styles } from './ProductDetailScreen.styles';

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
    () => navigation.navigate(ROUTES.ProductForm, { mode: 'edit', product }),
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
