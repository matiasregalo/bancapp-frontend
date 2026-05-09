import { useState, useCallback } from 'react';
import type { ProductFormValues, ProductFormErrors, Product } from '../../../types/product.types';
import { EMPTY_VALUES, MESSAGES } from './useProductForm.constants';
import { addOneYear, validateForm } from './useProductForm.validators';
import { executeCreate, executeUpdate } from './useProductForm.actions';

export interface UseProductFormReturn {
  values: ProductFormValues;
  errors: ProductFormErrors;
  isSubmitting: boolean;
  apiError: string | null;
  handleChange: (field: keyof ProductFormValues, value: string) => void;
  handleSubmit: () => Promise<void>;
  handleReset: () => void;
}

export function useProductForm(
  mode: 'create' | 'edit',
  initialProduct: Product | undefined,
  onSuccess: () => void,
): UseProductFormReturn {
  const [values, setValues] = useState<ProductFormValues>(() =>
    initialProduct ? { ...initialProduct } : { ...EMPTY_VALUES },
  );
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: keyof ProductFormValues, value: string) => {
      setValues(prev => {
        const next = { ...prev, [field]: value };
        if (field === 'date_release' && value) {
          next.date_revision = addOneYear(value);
        }
        return next;
      });
      setErrors(prev => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  const handleReset = useCallback(() => {
    setValues(initialProduct ? { ...initialProduct } : { ...EMPTY_VALUES });
    setErrors({});
    setApiError(null);
  }, [initialProduct]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm(values, mode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      if (mode === 'create') {
        const idError = await executeCreate(values);
        if (idError) {
          setErrors(prev => ({ ...prev, id: idError }));
          return;
        }
      } else {
        await executeUpdate(values);
      }
      onSuccess();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : MESSAGES.api.save);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, mode, onSuccess]);

  return { values, errors, isSubmitting, apiError, handleChange, handleSubmit, handleReset };
}
