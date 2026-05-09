import type { ProductFormValues } from '../../../types/product.types';

export const EMPTY_VALUES: ProductFormValues = {
  id: '',
  name: '',
  description: '',
  logo: '',
  date_release: '',
  date_revision: '',
};

export const REQUIRED = 'Este campo es requerido!';

export const MESSAGES = {
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
  api: {
    save: 'Error al guardar el producto',
  },
} as const;
