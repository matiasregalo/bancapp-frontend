import { productService } from '../services/productService';
import type { ProductFormValues } from '../../../types/product.types';
import { MESSAGES } from './useProductForm.constants';

export async function executeCreate(values: ProductFormValues): Promise<string | null> {
  const idExists = await productService.verifyId(values.id);
  if (idExists) { return MESSAGES.id.exists; }
  await productService.create({ ...values });
  return null;
}

export async function executeUpdate(values: ProductFormValues): Promise<void> {
  const { id, ...rest } = values;
  await productService.update(id, rest);
}
