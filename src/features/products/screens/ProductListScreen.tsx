import React, { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { Header } from '../../../shared/components/Header';
import { ROUTES } from '../../../types/navigation.types';
import type { RootStackParamList } from '../../../types/navigation.types';
import type { Product } from '../../../types/product.types';
import { Colors } from '../../../shared/theme/colors';
import { styles } from './ProductListScreen.styles';

const keyExtractor = (item: Product): string => item.id;

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ProductList'>;

export const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { filteredProducts, searchText, setSearchText, loading, error } = useProducts();

  const handleSelect = useCallback(
    (product: Product) => navigation.navigate(ROUTES.ProductDetail, { product }),
    [navigation],
  );

  const handleAdd = useCallback(
    () => navigation.navigate(ROUTES.ProductForm, { mode: 'create' }),
    [navigation],
  );

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={handleSelect} />
    ),
    [handleSelect],
  );

  const listContent = error ? (
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
        {listContent}
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAdd} testID="add-button">
        <Text style={styles.addButtonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
};

