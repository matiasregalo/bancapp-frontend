import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductDetailScreen } from './ProductDetailScreen';
import type { Product } from '../../../types/product.types';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({
    params: {
      product: mockProduct,
    },
  }),
}));

const mockProduct: Product = {
  id: 'trj-crd',
  name: 'Tarjeta de Credito',
  description: 'Tarjeta de consumo bajo la modalidad de credito',
  logo: 'https://example.com/visa.jpg',
  date_release: '2023-02-01',
  date_revision: '2024-02-01',
};

describe('ProductDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra "ID: {id}" como título principal', () => {
    const { getByTestId } = render(<ProductDetailScreen />);
    expect(getByTestId('product-id').props.children).toContain('trj-crd');
  });

  it('muestra el nombre del producto', () => {
    const { getByText } = render(<ProductDetailScreen />);
    expect(getByText('Tarjeta de Credito')).toBeTruthy();
  });

  it('muestra la descripción del producto', () => {
    const { getByText } = render(<ProductDetailScreen />);
    expect(getByText('Tarjeta de consumo bajo la modalidad de credito')).toBeTruthy();
  });

  it('muestra la fecha de liberación', () => {
    const { getByText } = render(<ProductDetailScreen />);
    expect(getByText('2023-02-01')).toBeTruthy();
  });

  it('muestra la fecha de revisión', () => {
    const { getByText } = render(<ProductDetailScreen />);
    expect(getByText('2024-02-01')).toBeTruthy();
  });

  it('muestra la imagen del logo con la URL correcta', () => {
    const { getByTestId } = render(<ProductDetailScreen />);
    const logo = getByTestId('product-logo');
    expect(logo.props.source.uri).toBe('https://example.com/visa.jpg');
  });

  it('muestra el botón Editar', () => {
    const { getByTestId } = render(<ProductDetailScreen />);
    expect(getByTestId('edit-button')).toBeTruthy();
  });

  it('botón Editar navega a ProductForm con mode edit y el producto', () => {
    const { getByTestId } = render(<ProductDetailScreen />);
    fireEvent.press(getByTestId('edit-button'));
    expect(mockNavigate).toHaveBeenCalledWith('ProductForm', {
      mode: 'edit',
      product: mockProduct,
    });
  });

  it('muestra el botón Eliminar (sin funcionalidad)', () => {
    const { getByTestId } = render(<ProductDetailScreen />);
    expect(getByTestId('delete-button')).toBeTruthy();
  });

  it('muestra las etiquetas de las filas de detalle', () => {
    const { getByText } = render(<ProductDetailScreen />);
    expect(getByText('Nombre')).toBeTruthy();
    expect(getByText('Descripción')).toBeTruthy();
    expect(getByText('Fecha liberación')).toBeTruthy();
    expect(getByText('Fecha revisión')).toBeTruthy();
  });

  it('muestra el subtítulo "Información extra"', () => {
    const { getByText } = render(<ProductDetailScreen />);
    expect(getByText('Información extra')).toBeTruthy();
  });
});
