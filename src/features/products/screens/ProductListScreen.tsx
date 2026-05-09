import React, { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { Header } from '../../../shared/components/Header';
import type { RootStackParamList } from '../../../types/navigation.types';
import type { Product } from '../../../types/product.types';
import { Colors } from '../../../shared/theme/colors';

const keyExtractor = (item: Product): string => item.id;

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ProductList'>;

export const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { filteredProducts, searchText, setSearchText, loading, error } = useProducts();

  const handleSelect = useCallback(
    (product: Product) => navigation.navigate('ProductDetail', { product }),
    [navigation],
  );

  const handleAdd = useCallback(
    () => navigation.navigate('ProductForm', { mode: 'create' }),
    [navigation],
  );

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={handleSelect} />
    ),
    [handleSelect],
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.brand} testID="loading-indicator" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
          testID="search-input"
        />
        {error ? (
          <Text style={styles.errorText} testID="error-message">
            {error}
          </Text>
        ) : (
          <>
            <Text style={styles.counter} testID="product-count">
              {`${filteredProducts.length} productos`}
            </Text>
            <FlatList
              data={filteredProducts}
              keyExtractor={keyExtractor}
              renderItem={renderProduct}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={10}
              testID="product-list"
            />
          </>
        )}
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAdd} testID="add-button">
        <Text style={styles.addButtonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 12,
    fontSize: 15,
  },
  counter: { fontSize: 14, color: Colors.textMuted, marginBottom: 8 },
  errorText: { color: Colors.danger, fontSize: 14, marginTop: 8 },
  addButton: {
    backgroundColor: Colors.brand,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    margin: 16,
  },
  addButtonText: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
});
