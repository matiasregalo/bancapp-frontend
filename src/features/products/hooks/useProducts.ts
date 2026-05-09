import { useState, useEffect, useCallback, useMemo } from 'react';
import { productService } from '../services/productService';
import type { Product } from '../../../types/product.types';

export interface UseProductsReturn {
  products: Product[];
  filteredProducts: Product[];
  searchText: string;
  setSearchText: (text: string) => void;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(
    () => products.filter(p => p.name.toLowerCase().includes(searchText.toLowerCase())),
    [products, searchText],
  );

  return {
    products,
    filteredProducts,
    searchText,
    setSearchText,
    loading,
    error,
    refetch: fetchProducts,
  };
};
