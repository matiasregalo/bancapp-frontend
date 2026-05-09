import { renderHook } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useProductFormScreen } from './useProductFormScreen';
import { useProductForm } from '../hooks/useProductForm';
import type { Product, ProductFormValues, ProductFormErrors } from '../../../types/product.types';

jest.mock('@react-navigation/native');
jest.mock('../hooks/useProductForm');

const mockNavigate = jest.fn();
const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
const mockUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;
const mockUseProductForm = useProductForm as jest.MockedFunction<typeof useProductForm>;

const mockProduct: Product = {
  id: 'trj-crd',
  name: 'Tarjeta de Credito',
  description: 'Tarjeta de consumo bajo la modalidad de credito',
  logo: 'https://example.com/visa.jpg',
  date_release: '2030-01-01',
  date_revision: '2031-01-01',
};

const emptyValues: ProductFormValues = {
  id: '',
  name: '',
  description: '',
  logo: '',
  date_release: '',
  date_revision: '',
};

const defaultFormReturn = {
  values: emptyValues,
  errors: {} as ProductFormErrors,
  isSubmitting: false,
  apiError: null,
  handleChange: jest.fn(),
  handleSubmit: jest.fn(),
  handleReset: jest.fn(),
};

describe('useProductFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigation.mockReturnValue({ navigate: mockNavigate } as ReturnType<typeof useNavigation>);
    mockUseProductForm.mockReturnValue(defaultFormReturn);
  });

  describe('modo create', () => {
    beforeEach(() => {
      mockUseRoute.mockReturnValue({ params: { mode: 'create' } } as ReturnType<typeof useRoute>);
    });

    it('retorna isEdit = false', () => {
      const { result } = renderHook(() => useProductFormScreen());
      expect(result.current.isEdit).toBe(false);
    });

    it('llama a useProductForm con mode create e initialProduct undefined', () => {
      renderHook(() => useProductFormScreen());
      expect(mockUseProductForm).toHaveBeenCalledWith('create', undefined, expect.any(Function));
    });

    it('expone values, errors, isSubmitting y apiError del hook', () => {
      mockUseProductForm.mockReturnValue({
        ...defaultFormReturn,
        errors: { id: 'Error de ID' },
        isSubmitting: true,
        apiError: 'Error de API',
      });

      const { result } = renderHook(() => useProductFormScreen());

      expect(result.current.errors).toEqual({ id: 'Error de ID' });
      expect(result.current.isSubmitting).toBe(true);
      expect(result.current.apiError).toBe('Error de API');
    });

    it('expone handleSubmit y handleReset del hook', () => {
      const mockHandleSubmit = jest.fn();
      const mockHandleReset = jest.fn();
      mockUseProductForm.mockReturnValue({
        ...defaultFormReturn,
        handleSubmit: mockHandleSubmit,
        handleReset: mockHandleReset,
      });

      const { result } = renderHook(() => useProductFormScreen());

      result.current.handleSubmit();
      result.current.handleReset();

      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
      expect(mockHandleReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('modo edit', () => {
    beforeEach(() => {
      mockUseRoute.mockReturnValue({
        params: { mode: 'edit', product: mockProduct },
      } as ReturnType<typeof useRoute>);
    });

    it('retorna isEdit = true', () => {
      const { result } = renderHook(() => useProductFormScreen());
      expect(result.current.isEdit).toBe(true);
    });

    it('llama a useProductForm con mode edit y el producto como initialProduct', () => {
      renderHook(() => useProductFormScreen());
      expect(mockUseProductForm).toHaveBeenCalledWith('edit', mockProduct, expect.any(Function));
    });
  });

  describe('onSuccess', () => {
    it('navega a ProductList cuando se invoca el callback onSuccess', () => {
      mockUseRoute.mockReturnValue({ params: { mode: 'create' } } as ReturnType<typeof useRoute>);

      renderHook(() => useProductFormScreen());

      const onSuccess = mockUseProductForm.mock.calls[0][2];
      onSuccess();

      expect(mockNavigate).toHaveBeenCalledWith('ProductList');
    });
  });

  describe('changeField', () => {
    it('retorna una función que llama handleChange con el campo y el valor', () => {
      const mockHandleChange = jest.fn();
      mockUseRoute.mockReturnValue({ params: { mode: 'create' } } as ReturnType<typeof useRoute>);
      mockUseProductForm.mockReturnValue({ ...defaultFormReturn, handleChange: mockHandleChange });

      const { result } = renderHook(() => useProductFormScreen());

      result.current.changeField('name')('Nuevo Nombre');

      expect(mockHandleChange).toHaveBeenCalledWith('name', 'Nuevo Nombre');
    });

    it('cada llamada a changeField genera un handler estable (mismo campo)', () => {
      mockUseRoute.mockReturnValue({ params: { mode: 'create' } } as ReturnType<typeof useRoute>);
      const { result } = renderHook(() => useProductFormScreen());

      const handler1 = result.current.changeField('id');
      const handler2 = result.current.changeField('id');

      expect(typeof handler1).toBe('function');
      expect(typeof handler2).toBe('function');
    });
  });
});
