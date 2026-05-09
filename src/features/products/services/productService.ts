import { BASE_URL } from '../../../config/api.config';
import type {
  Product,
  ApiResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from '../../../types/product.types';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body: { message?: string } = await response.json().catch(() => ({}));
    throw new Error(body.message ?? `Error ${response.status}`);
  }
  const json: ApiResponse<T> = await response.json();
  return json.data;
}

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/bp/products`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudieron cargar los productos`);
    }
    const json: ApiResponse<Product[]> = await response.json();
    return json.data;
  },

  verifyId: async (id: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/bp/products/verification/${id}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudo verificar el ID`);
    }
    return response.json() as Promise<boolean>;
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/bp/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(response);
  },

  update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/bp/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(response);
  },
};
