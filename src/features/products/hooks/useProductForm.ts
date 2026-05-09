import { useState, useCallback } from 'react';
import { productService } from '../services/productService';
import type {
  ProductFormValues,
  ProductFormErrors,
  CreateProductRequest,
  UpdateProductRequest,
  Product,
} from '../../../types/product.types';

const EMPTY_VALUES: ProductFormValues = {
  id: '',
  name: '',
  description: '',
  logo: '',
  date_release: '',
  date_revision: '',
};

const REQUIRED = 'Este campo es requerido!';

const MESSAGES = {
  id: {
    min: 'Mínimo 3 caracteres',
    max: 'Máximo 10 caracteres',
    exists: 'ID no válido!',
  },
  name: {
    min: 'Mínimo 5 caracteres',
    max: 'Máximo 100 caracteres',
  },
  description: {
    min: 'Mínimo 10 caracteres',
    max: 'Máximo 200 caracteres',
  },
  date_release: {
    past: 'La fecha debe ser igual o mayor a la fecha actual',
  },
} as const;

function addOneYear(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) { return ''; }
  return `${Number(parts[0]) + 1}-${parts[1]}-${parts[2]}`;
}

function getLocalDateString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function validateId(id: string, mode: 'create' | 'edit'): Pick<ProductFormErrors, 'id'> {
  if (!id.trim()) { return { id: REQUIRED }; }
  if (mode === 'create') {
    if (id.length < 3) { return { id: MESSAGES.id.min }; }
    if (id.length > 10) { return { id: MESSAGES.id.max }; }
  }
  return {};
}

function validateName(name: string): Pick<ProductFormErrors, 'name'> {
  if (!name.trim()) { return { name: REQUIRED }; }
  if (name.length < 5) { return { name: MESSAGES.name.min }; }
  if (name.length > 100) { return { name: MESSAGES.name.max }; }
  return {};
}

function validateDescription(description: string): Pick<ProductFormErrors, 'description'> {
  if (!description.trim()) { return { description: REQUIRED }; }
  if (description.length < 10) { return { description: MESSAGES.description.min }; }
  if (description.length > 200) { return { description: MESSAGES.description.max }; }
  return {};
}

function validateLogo(logo: string): Pick<ProductFormErrors, 'logo'> {
  if (!logo.trim()) { return { logo: REQUIRED }; }
  return {};
}

function validateDateRelease(date_release: string): Pick<ProductFormErrors, 'date_release'> {
  if (!date_release.trim()) { return { date_release: REQUIRED }; }
  if (date_release < getLocalDateString()) {
    return { date_release: MESSAGES.date_release.past };
  }
  return {};
}

function validateForm(
  values: ProductFormValues,
  mode: 'create' | 'edit',
): ProductFormErrors {
  return {
    ...validateId(values.id, mode),
    ...validateName(values.name),
    ...validateDescription(values.description),
    ...validateLogo(values.logo),
    ...validateDateRelease(values.date_release),
  };
}

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
        const idExists = await productService.verifyId(values.id);
        if (idExists) {
          setErrors(prev => ({ ...prev, id: MESSAGES.id.exists }));
          return;
        }
        const dto: CreateProductRequest = { ...values };
        await productService.create(dto);
      } else {
        const { id, ...rest } = values;
        const dto: UpdateProductRequest = rest;
        await productService.update(id, dto);
      }
      onSuccess();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, mode, onSuccess]);

  return { values, errors, isSubmitting, apiError, handleChange, handleSubmit, handleReset };
}
