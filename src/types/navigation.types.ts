import type { Product } from './product.types';

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { product: Product };
  ProductForm: { mode: 'create' } | { mode: 'edit'; product: Product };
};
