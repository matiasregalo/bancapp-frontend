import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ProductListScreen } from './ProductListScreen';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../../../types/product.types';
import { ROUTES } from '../../../types/navigation.types';

jest.mock('../hooks/useProducts');

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const mockUseProducts = useProducts as jest.MockedFunction<typeof useProducts>;

const makeProducts = (count: number): Product[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `prod-${i}`,
    name: `Producto ${i}`,
    description: `Descripcion del producto ${i} con texto largo`,
    logo: `https://example.com/logo${i}.png`,
    date_release: '2023-01-01',
    date_revision: '2024-01-01',
  }));

const defaultHookState = {
  products: [],
  filteredProducts: [],
  searchText: '',
  setSearchText: jest.fn(),
  loading: false,
  error: null,
  refetch: jest.fn(),
};

const renderScreen = () =>
  render(
    <NavigationContainer>
      <ProductListScreen />
    </NavigationContainer>,
  );

describe('ProductListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReset();
  });

  it('muestra ActivityIndicator cuando loading es true', () => {
    mockUseProducts.mockReturnValue({ ...defaultHookState, loading: true });
    const { getByTestId } = renderScreen();
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('muestra 7 ProductCard cuando hook retorna 7 productos', () => {
    const products = makeProducts(7);
    mockUseProducts.mockReturnValue({
      ...defaultHookState,
      filteredProducts: products,
    });

    const { getAllByTestId } = renderScreen();
    expect(getAllByTestId('product-card')).toHaveLength(7);
  });

  it('muestra "7 productos" como contador', () => {
    const products = makeProducts(7);
    mockUseProducts.mockReturnValue({
      ...defaultHookState,
      filteredProducts: products,
    });

    const { getByText } = renderScreen();
    expect(getByText('7 productos')).toBeTruthy();
  });

  it('muestra "0 productos" cuando lista filtrada está vacía', () => {
    mockUseProducts.mockReturnValue({
      ...defaultHookState,
      filteredProducts: [],
    });

    const { getByText } = renderScreen();
    expect(getByText('0 productos')).toBeTruthy();
  });

  it('muestra mensaje de error cuando error no es null', () => {
    mockUseProducts.mockReturnValue({
      ...defaultHookState,
      error: 'Error de conexión',
    });

    const { getByTestId } = renderScreen();
    expect(getByTestId('error-message')).toBeTruthy();
    expect(getByTestId('error-message').props.children).toBe('Error de conexión');
  });

  it('no muestra la lista cuando hay error', () => {
    mockUseProducts.mockReturnValue({
      ...defaultHookState,
      error: 'Error de conexión',
    });

    const { queryByTestId } = renderScreen();
    expect(queryByTestId('product-count')).toBeNull();
  });

  it('llama setSearchText al escribir en campo de búsqueda', () => {
    const setSearchText = jest.fn();
    mockUseProducts.mockReturnValue({
      ...defaultHookState,
      setSearchText,
    });

    const { getByTestId } = renderScreen();
    fireEvent.changeText(getByTestId('search-input'), 'Tarjeta');

    expect(setSearchText).toHaveBeenCalledWith('Tarjeta');
  });

  it('muestra el campo de búsqueda con placeholder "Search..."', () => {
    mockUseProducts.mockReturnValue(defaultHookState);
    const { getByPlaceholderText } = renderScreen();
    expect(getByPlaceholderText('Search...')).toBeTruthy();
  });

  it('muestra el botón Agregar', () => {
    mockUseProducts.mockReturnValue(defaultHookState);
    const { getByTestId } = renderScreen();
    expect(getByTestId('add-button')).toBeTruthy();
  });

  it('muestra el texto del campo de búsqueda pasado por el hook', () => {
    mockUseProducts.mockReturnValue({
      ...defaultHookState,
      searchText: 'Tarjeta',
    });

    const { getByTestId } = renderScreen();
    expect(getByTestId('search-input').props.value).toBe('Tarjeta');
  });

  it('botón Agregar navega a ProductForm con mode create', () => {
    mockUseProducts.mockReturnValue(defaultHookState);
    const { getByTestId } = renderScreen();
    fireEvent.press(getByTestId('add-button'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ProductForm, { mode: 'create' });
  });

  it('tap en ProductCard navega a ProductDetail con el producto', () => {
    const products = makeProducts(1);
    mockUseProducts.mockReturnValue({
      ...defaultHookState,
      filteredProducts: products,
    });
    const { getByTestId } = renderScreen();
    fireEvent.press(getByTestId('product-card'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ProductDetail, { product: products[0] });
  });
});
