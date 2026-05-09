import React, { useCallback } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import type { Product } from '../../../types/product.types';
import { styles } from './ProductCard.styles';

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
