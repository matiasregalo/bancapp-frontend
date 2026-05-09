import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductFormScreen } from './ProductFormScreen';
import { useProductFormScreen } from './useProductFormScreen';
import type { Product, ProductFormValues, ProductFormErrors } from '../../../types/product.types';

jest.mock('./useProductFormScreen');
const mockUseProductFormScreen = useProductFormScreen as jest.MockedFunction<typeof useProductFormScreen>;

const mockHandleSubmit = jest.fn();
const mockHandleReset = jest.fn();
const mockChangeField = jest.fn(() => jest.fn());

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

const defaultHookReturn = {
  isEdit: false,
  values: emptyValues,
  errors: {} as ProductFormErrors,
  isSubmitting: false,
  apiError: null,
  changeField: mockChangeField,
  handleSubmit: mockHandleSubmit,
  handleReset: mockHandleReset,
};

describe('ProductFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProductFormScreen.mockReturnValue(defaultHookReturn);
  });

  describe('modo create', () => {
    it('muestra el título "Formulario de Registro"', () => {
      const { getByText } = render(<ProductFormScreen />);
      expect(getByText('Formulario de Registro')).toBeTruthy();
    });

    it('muestra las 6 etiquetas de los campos', () => {
      const { getByText } = render(<ProductFormScreen />);
      expect(getByText('ID')).toBeTruthy();
      expect(getByText('Nombre')).toBeTruthy();
      expect(getByText('Descripción')).toBeTruthy();
      expect(getByText('Logo')).toBeTruthy();
      expect(getByText('Fecha Liberación')).toBeTruthy();
      expect(getByText('Fecha Revisión')).toBeTruthy();
    });

    it('campo Fecha Revisión siempre está deshabilitado', () => {
      const { getByTestId } = render(<ProductFormScreen />);
      expect(getByTestId('field-date-revision').props.editable).toBe(false);
    });

    it('campo ID está habilitado en modo create', () => {
      const { getByTestId } = render(<ProductFormScreen />);
      expect(getByTestId('field-id').props.editable).toBe(true);
    });

    it('muestra el botón Enviar', () => {
      const { getByTestId } = render(<ProductFormScreen />);
      expect(getByTestId('submit-button')).toBeTruthy();
    });

    it('muestra el botón Reiniciar', () => {
      const { getByTestId } = render(<ProductFormScreen />);
      expect(getByTestId('reset-button')).toBeTruthy();
    });

    it('botón Enviar llama handleSubmit al presionar', () => {
      const { getByTestId } = render(<ProductFormScreen />);
      fireEvent.press(getByTestId('submit-button'));
      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it('botón Reiniciar llama handleReset al presionar', () => {
      const { getByTestId } = render(<ProductFormScreen />);
      fireEvent.press(getByTestId('reset-button'));
      expect(mockHandleReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('modo edit', () => {
    beforeEach(() => {
      mockUseProductFormScreen.mockReturnValue({
        ...defaultHookReturn,
        isEdit: true,
        values: { ...mockProduct },
      });
    });

    it('muestra el título "Formulario de Edición"', () => {
      const { getByText } = render(<ProductFormScreen />);
      expect(getByText('Formulario de Edición')).toBeTruthy();
    });

    it('campo ID está deshabilitado', () => {
      const { getByTestId } = render(<ProductFormScreen />);
      expect(getByTestId('field-id').props.editable).toBe(false);
    });

    it('los demás campos están habilitados', () => {
      const { getByTestId } = render(<ProductFormScreen />);
      expect(getByTestId('field-name').props.editable).toBe(true);
      expect(getByTestId('field-description').props.editable).toBe(true);
      expect(getByTestId('field-logo').props.editable).toBe(true);
    });

    it('campos están precargados con los valores del producto', () => {
      const { getByTestId } = render(<ProductFormScreen />);
      expect(getByTestId('field-id').props.value).toBe(mockProduct.id);
      expect(getByTestId('field-name').props.value).toBe(mockProduct.name);
      expect(getByTestId('field-date-release').props.value).toBe(mockProduct.date_release);
    });
  });

  describe('estados de error', () => {
    it('muestra texto de error de campo ID cuando errors.id tiene valor', () => {
      mockUseProductFormScreen.mockReturnValue({
        ...defaultHookReturn,
        errors: { id: 'Este campo es requerido!' },
      });
      const { getByText } = render(<ProductFormScreen />);
      expect(getByText('Este campo es requerido!')).toBeTruthy();
    });

    it('muestra texto de error de campo Nombre cuando errors.name tiene valor', () => {
      mockUseProductFormScreen.mockReturnValue({
        ...defaultHookReturn,
        errors: { name: 'Mínimo 5 caracteres' },
      });
      const { getByText } = render(<ProductFormScreen />);
      expect(getByText('Mínimo 5 caracteres')).toBeTruthy();
    });

    it('muestra apiError cuando tiene valor', () => {
      mockUseProductFormScreen.mockReturnValue({
        ...defaultHookReturn,
        apiError: 'Error al guardar el producto',
      });
      const { getByTestId } = render(<ProductFormScreen />);
      expect(getByTestId('api-error')).toBeTruthy();
    });

    it('no muestra apiError cuando es null', () => {
      const { queryByTestId } = render(<ProductFormScreen />);
      expect(queryByTestId('api-error')).toBeNull();
    });

    it('muestra "ID no válido!" cuando el ID ya existe', () => {
      mockUseProductFormScreen.mockReturnValue({
        ...defaultHookReturn,
        errors: { id: 'ID no válido!' },
      });
      const { getByText } = render(<ProductFormScreen />);
      expect(getByText('ID no válido!')).toBeTruthy();
    });
  });

  describe('estado de carga', () => {
    it('botón Enviar está deshabilitado cuando isSubmitting=true', () => {
      mockUseProductFormScreen.mockReturnValue({
        ...defaultHookReturn,
        isSubmitting: true,
      });
      const { getByTestId } = render(<ProductFormScreen />);
      expect(getByTestId('submit-button').props.accessibilityState?.disabled).toBeTruthy();
    });

    it('muestra ActivityIndicator en lugar del texto Enviar cuando isSubmitting=true', () => {
      mockUseProductFormScreen.mockReturnValue({
        ...defaultHookReturn,
        isSubmitting: true,
      });
      const { getByTestId, queryByText } = render(<ProductFormScreen />);
      expect(getByTestId('submit-loading')).toBeTruthy();
      expect(queryByText('Enviar')).toBeNull();
    });
  });
});
