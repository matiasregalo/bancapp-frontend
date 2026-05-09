import React, { useCallback } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import type { Product } from '../../../types/product.types';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onPress }) => {
  const handlePress = useCallback(() => onPress(product), [onPress, product]);

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} testID="product-card">
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.id}>ID: {product.id}</Text>
      </View>
      <Text style={styles.chevron}>{'>'}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  id: { fontSize: 13, color: '#888', marginTop: 2 },
  chevron: { fontSize: 18, color: '#888', marginLeft: 8 },
});
