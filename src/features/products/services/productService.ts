import { BASE_URL } from '../../../config/api.config';
import type { Product, ApiResponse } from '../../../types/product.types';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/bp/products`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudieron cargar los productos`);
    }
    const json: ApiResponse<Product[]> = await response.json();
    return json.data;
  },
};
