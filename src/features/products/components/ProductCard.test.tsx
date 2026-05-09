import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductCard } from './ProductCard';
import type { Product } from '../../../types/product.types';

const mockProduct: Product = {
  id: 'trj-crd',
  name: 'Tarjeta de Credito',
  description: 'Tarjeta de consumo bajo la modalidad de credito',
  logo: 'https://example.com/visa.jpg',
  date_release: '2023-02-01',
  date_revision: '2024-02-01',
};

describe('ProductCard', () => {
  it('renderiza el nombre del producto', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onPress={jest.fn()} />,
    );
    expect(getByText('Tarjeta de Credito')).toBeTruthy();
  });

  it('renderiza el ID del producto con prefijo "ID:"', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onPress={jest.fn()} />,
    );
    expect(getByText('ID: trj-crd')).toBeTruthy();
  });

  it('renderiza el chevron ">"', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onPress={jest.fn()} />,
    );
    expect(getByText('>')).toBeTruthy();
  });

  it('llama onPress con el producto al hacer tap', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <ProductCard product={mockProduct} onPress={handlePress} />,
    );

    fireEvent.press(getByTestId('product-card'));

    expect(handlePress).toHaveBeenCalledTimes(1);
    expect(handlePress).toHaveBeenCalledWith(mockProduct);
  });

  it('no llama onPress cuando no se toca', () => {
    const handlePress = jest.fn();
    render(<ProductCard product={mockProduct} onPress={handlePress} />);
    expect(handlePress).not.toHaveBeenCalled();
  });
});
