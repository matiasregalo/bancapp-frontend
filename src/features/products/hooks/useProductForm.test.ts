import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProductForm } from './useProductForm';
import type { Product, ProductFormValues } from '../../../types/product.types';

const mockVerifyId = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();

jest.mock('../services/productService', () => ({
  productService: {
    verifyId: (...args: unknown[]) => mockVerifyId(...args),
    create: (...args: unknown[]) => mockCreate(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
  },
}));

const mockProduct: Product = {
  id: 'trj-crd',
  name: 'Tarjeta de Credito',
  description: 'Tarjeta de consumo bajo la modalidad de credito',
  logo: 'https://example.com/visa.jpg',
  date_release: '2030-01-01',
  date_revision: '2031-01-01',
};

const VALID_VALUES = {
  id: 'trj-001',
  name: 'Tarjeta Visa',
  description: 'Tarjeta de consumo bajo modalidad credito',
  logo: 'https://example.com/logo.png',
  date_release: '2030-06-01',
};

function fillFields(
  result: { current: ReturnType<typeof useProductForm> },
  fields: Partial<Record<keyof ProductFormValues, string>>,
) {
  act(() => {
    Object.entries(fields).forEach(([field, value]) => {
      result.current.handleChange(field as keyof ProductFormValues, value);
    });
  });
}

describe('useProductForm', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('estado inicial', () => {
    it('values inicia vacío en modo create', () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      expect(result.current.values.id).toBe('');
      expect(result.current.values.name).toBe('');
      expect(result.current.values.date_revision).toBe('');
    });

    it('values inicia con los datos del producto en modo edit', () => {
      const { result } = renderHook(() =>
        useProductForm('edit', mockProduct, mockOnSuccess),
      );
      expect(result.current.values.id).toBe('trj-crd');
      expect(result.current.values.name).toBe('Tarjeta de Credito');
      expect(result.current.values.date_release).toBe('2030-01-01');
    });

    it('errors inicia vacío', () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      expect(result.current.errors).toEqual({});
    });

    it('isSubmitting inicia en false', () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      expect(result.current.isSubmitting).toBe(false);
    });

    it('apiError inicia en null', () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      expect(result.current.apiError).toBeNull();
    });
  });

  describe('handleChange', () => {
    it('actualiza el campo name', () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      act(() => { result.current.handleChange('name', 'Nuevo Nombre'); });
      expect(result.current.values.name).toBe('Nuevo Nombre');
    });

    it('actualiza el campo logo', () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      act(() => { result.current.handleChange('logo', 'https://img.com/logo.png'); });
      expect(result.current.values.logo).toBe('https://img.com/logo.png');
    });

    it('calcula date_revision +1 año al cambiar date_release', () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      act(() => { result.current.handleChange('date_release', '2030-03-15'); });
      expect(result.current.values.date_revision).toBe('2031-03-15');
    });

    it('calcula date_revision correctamente para distintos meses', () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      act(() => { result.current.handleChange('date_release', '2028-12-25'); });
      expect(result.current.values.date_revision).toBe('2029-12-25');
    });

    it('limpia el error del campo al modificarlo', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      // Trigger validation
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.name).toBeDefined();
      // Modify the field
      act(() => { result.current.handleChange('name', 'Nuevo nombre válido'); });
      expect(result.current.errors.name).toBeUndefined();
    });
  });

  describe('handleReset', () => {
    it('limpia todos los campos en modo create', () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      act(() => { result.current.handleChange('name', 'Algo escrito'); });
      act(() => { result.current.handleReset(); });
      expect(result.current.values.name).toBe('');
      expect(result.current.values.id).toBe('');
      expect(result.current.values.logo).toBe('');
    });

    it('restaura los valores originales del producto en modo edit', () => {
      const { result } = renderHook(() =>
        useProductForm('edit', mockProduct, mockOnSuccess),
      );
      act(() => { result.current.handleChange('name', 'Nombre modificado'); });
      act(() => { result.current.handleReset(); });
      expect(result.current.values.name).toBe('Tarjeta de Credito');
      expect(result.current.values.id).toBe('trj-crd');
    });

    it('limpia los errores al reiniciar', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      await act(async () => { await result.current.handleSubmit(); });
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
      act(() => { result.current.handleReset(); });
      expect(result.current.errors).toEqual({});
    });

    it('limpia el apiError al reiniciar', async () => {
      mockVerifyId.mockResolvedValue(false);
      mockCreate.mockRejectedValue(new Error('Error del servidor'));

      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, VALID_VALUES);
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.apiError).not.toBeNull();

      act(() => { result.current.handleReset(); });
      expect(result.current.apiError).toBeNull();
    });
  });

  describe('validaciones — campos requeridos', () => {
    it('id vacío → "Este campo es requerido!"', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { name: VALID_VALUES.name, description: VALID_VALUES.description, logo: VALID_VALUES.logo, date_release: VALID_VALUES.date_release });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.id).toBe('Este campo es requerido!');
    });

    it('name vacío → "Este campo es requerido!"', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { id: VALID_VALUES.id, description: VALID_VALUES.description, logo: VALID_VALUES.logo, date_release: VALID_VALUES.date_release });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.name).toBe('Este campo es requerido!');
    });

    it('description vacío → "Este campo es requerido!"', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { id: VALID_VALUES.id, name: VALID_VALUES.name, logo: VALID_VALUES.logo, date_release: VALID_VALUES.date_release });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.description).toBe('Este campo es requerido!');
    });

    it('logo vacío → "Este campo es requerido!"', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { id: VALID_VALUES.id, name: VALID_VALUES.name, description: VALID_VALUES.description, date_release: VALID_VALUES.date_release });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.logo).toBe('Este campo es requerido!');
    });

    it('date_release vacío → "Este campo es requerido!"', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { id: VALID_VALUES.id, name: VALID_VALUES.name, description: VALID_VALUES.description, logo: VALID_VALUES.logo });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.date_release).toBe('Este campo es requerido!');
    });
  });

  describe('validaciones — longitud de ID', () => {
    it('ID de 2 chars → "Mínimo 3 caracteres"', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { ...VALID_VALUES, id: 'ab' });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.id).toBe('Mínimo 3 caracteres');
    });

    it('ID de 11 chars → "Máximo 10 caracteres"', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { ...VALID_VALUES, id: 'abcdefghijk' });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.id).toBe('Máximo 10 caracteres');
    });

    it('ID de 3 chars no genera error de longitud', async () => {
      mockVerifyId.mockResolvedValue(false);
      mockCreate.mockResolvedValue({ ...mockProduct, id: 'abc' });

      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { ...VALID_VALUES, id: 'abc' });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.id).toBeUndefined();
    });

    it('ID de 10 chars no genera error de longitud', async () => {
      mockVerifyId.mockResolvedValue(false);
      mockCreate.mockResolvedValue({ ...mockProduct, id: 'abcdefghij' });

      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { ...VALID_VALUES, id: 'abcdefghij' });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.id).toBeUndefined();
    });
  });

  describe('validaciones — longitud de Nombre', () => {
    it('nombre de 4 chars → "Mínimo 5 caracteres"', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { ...VALID_VALUES, name: 'Hola' });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.name).toBe('Mínimo 5 caracteres');
    });

    it('nombre de 101 chars → "Máximo 100 caracteres"', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { ...VALID_VALUES, name: 'a'.repeat(101) });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.name).toBe('Máximo 100 caracteres');
    });
  });

  describe('validaciones — longitud de Descripción', () => {
    it('descripción de 9 chars → "Mínimo 10 caracteres"', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { ...VALID_VALUES, description: '123456789' });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.description).toBe('Mínimo 10 caracteres');
    });

    it('descripción de 201 chars → "Máximo 200 caracteres"', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { ...VALID_VALUES, description: 'a'.repeat(201) });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.description).toBe('Máximo 200 caracteres');
    });
  });

  describe('validaciones — Fecha Liberación', () => {
    it('date_release pasada → error de fecha', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, { ...VALID_VALUES, date_release: '2020-01-01' });
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.date_release).toBe(
        'La fecha debe ser igual o mayor a la fecha actual',
      );
    });

    it('date_release futura no genera error de fecha', async () => {
      mockVerifyId.mockResolvedValue(false);
      mockCreate.mockResolvedValue(mockProduct);

      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, VALID_VALUES);
      await act(async () => { await result.current.handleSubmit(); });
      expect(result.current.errors.date_release).toBeUndefined();
    });
  });

  describe('handleSubmit — modo create', () => {
    it('llama verifyId y create cuando el formulario es válido y el ID está disponible', async () => {
      mockVerifyId.mockResolvedValue(false);
      mockCreate.mockResolvedValue(mockProduct);

      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, VALID_VALUES);
      await act(async () => { await result.current.handleSubmit(); });

      expect(mockVerifyId).toHaveBeenCalledWith(VALID_VALUES.id);
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it('verifyId=true → error "ID no válido!" y no llama create', async () => {
      mockVerifyId.mockResolvedValue(true);

      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, VALID_VALUES);
      await act(async () => { await result.current.handleSubmit(); });

      expect(result.current.errors.id).toBe('ID no válido!');
      expect(mockCreate).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('error de API al crear → sets apiError, no navega', async () => {
      mockVerifyId.mockResolvedValue(false);
      mockCreate.mockRejectedValue(new Error('Error del servidor'));

      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, VALID_VALUES);
      await act(async () => { await result.current.handleSubmit(); });

      expect(result.current.apiError).toBe('Error del servidor');
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('isSubmitting vuelve a false tras submit exitoso', async () => {
      mockVerifyId.mockResolvedValue(false);
      mockCreate.mockResolvedValue(mockProduct);

      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, VALID_VALUES);
      await act(async () => { await result.current.handleSubmit(); });

      expect(result.current.isSubmitting).toBe(false);
    });

    it('isSubmitting vuelve a false tras error de API', async () => {
      mockVerifyId.mockResolvedValue(false);
      mockCreate.mockRejectedValue(new Error('fallo'));

      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      fillFields(result, VALID_VALUES);
      await act(async () => { await result.current.handleSubmit(); });

      expect(result.current.isSubmitting).toBe(false);
    });

    it('errores de validación bloquean el submit sin llamar a la API', async () => {
      const { result } = renderHook(() =>
        useProductForm('create', undefined, mockOnSuccess),
      );
      await act(async () => { await result.current.handleSubmit(); });

      expect(mockVerifyId).not.toHaveBeenCalled();
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe('handleSubmit — modo edit', () => {
    it('llama update con id correcto y body sin id', async () => {
      mockUpdate.mockResolvedValue(mockProduct);

      const { result } = renderHook(() =>
        useProductForm('edit', mockProduct, mockOnSuccess),
      );
      await act(async () => { await result.current.handleSubmit(); });

      expect(mockVerifyId).not.toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith(
        'trj-crd',
        expect.not.objectContaining({ id: expect.anything() }),
      );
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it('no verifica unicidad de ID en modo edit', async () => {
      mockUpdate.mockResolvedValue(mockProduct);

      const { result } = renderHook(() =>
        useProductForm('edit', mockProduct, mockOnSuccess),
      );
      await act(async () => { await result.current.handleSubmit(); });

      expect(mockVerifyId).not.toHaveBeenCalled();
    });

    it('error de API al actualizar → sets apiError, no navega', async () => {
      mockUpdate.mockRejectedValue(new Error('Producto no encontrado'));

      const { result } = renderHook(() =>
        useProductForm('edit', mockProduct, mockOnSuccess),
      );
      await act(async () => { await result.current.handleSubmit(); });

      await waitFor(() =>
        expect(result.current.apiError).toBe('Producto no encontrado'),
      );
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('recalcula date_revision al cambiar date_release en modo edit', () => {
      const { result } = renderHook(() =>
        useProductForm('edit', mockProduct, mockOnSuccess),
      );
      act(() => { result.current.handleChange('date_release', '2032-07-20'); });
      expect(result.current.values.date_revision).toBe('2033-07-20');
    });
  });
});
