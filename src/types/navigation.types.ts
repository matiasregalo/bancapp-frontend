import type { Product } from './product.types';

export const ROUTES = {
  ProductList: 'ProductList',
  ProductDetail: 'ProductDetail',
  ProductForm: 'ProductForm',
} as const;

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { product: Product };
  ProductForm: { mode: 'create' } | { mode: 'edit'; product: Product };
};
