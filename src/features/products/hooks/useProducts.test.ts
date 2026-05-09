import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProducts } from './useProducts';
import type { Product } from '../../../types/product.types';

const mockGetAll = jest.fn();

jest.mock('../services/productService', () => ({
  productService: {
    getAll: (...args: unknown[]) => mockGetAll(...args),
  },
}));

const mockProducts: Product[] = [
  {
    id: 'trj-crd',
    name: 'Tarjeta de Credito',
    description: 'Tarjeta de consumo bajo la modalidad de credito',
    logo: 'https://example.com/visa.jpg',
    date_release: '2023-02-01',
    date_revision: '2024-02-01',
  },
  {
    id: 'sim-ahor',
    name: 'Simulador de Ahorro',
    description: 'Simulador de ahorro hasta 3 meses sin intereses',
    logo: 'https://example.com/logo.png',
    date_release: '2023-03-01',
    date_revision: '2024-03-01',
  },
  {
    id: 'deb-crd',
    name: 'Tarjeta de Debito',
    description: 'Tarjeta de consumo bajo la modalidad de debito',
    logo: 'https://example.com/debit.jpg',
    date_release: '2023-04-01',
    date_revision: '2024-04-01',
  },
];

describe('useProducts', () => {
  beforeEach(() => {
    mockGetAll.mockReset();
  });

  it('estado inicial tiene loading true', () => {
    mockGetAll.mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useProducts());
    expect(result.current.loading).toBe(true);
  });

  it('estado inicial tiene products vacío', () => {
    mockGetAll.mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useProducts());
    expect(result.current.products).toEqual([]);
  });

  it('loading pasa a false y products se popula después de fetch exitoso', async () => {
    mockGetAll.mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it('filteredProducts retorna todos los productos cuando searchText está vacío', async () => {
    mockGetAll.mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredProducts).toHaveLength(3);
    expect(result.current.filteredProducts).toEqual(mockProducts);
  });

  it('filteredProducts filtra por searchText case-insensitive (minúsculas)', async () => {
    mockGetAll.mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSearchText('tarjeta');
    });

    expect(result.current.filteredProducts).toHaveLength(2);
    expect(result.current.filteredProducts.map(p => p.id)).toEqual(['trj-crd', 'deb-crd']);
  });

  it('filteredProducts filtra por searchText case-insensitive (mayúsculas)', async () => {
    mockGetAll.mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSearchText('TARJETA');
    });

    expect(result.current.filteredProducts).toHaveLength(2);
  });

  it('filteredProducts filtra por searchText case-insensitive (mixto)', async () => {
    mockGetAll.mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSearchText('Tarjeta');
    });

    expect(result.current.filteredProducts).toHaveLength(2);
  });

  it('filteredProducts retorna vacío cuando no hay coincidencias', async () => {
    mockGetAll.mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSearchText('xyz999');
    });

    expect(result.current.filteredProducts).toHaveLength(0);
  });

  it('limpiar searchText restaura lista completa', async () => {
    mockGetAll.mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => { result.current.setSearchText('Tarjeta'); });
    act(() => { result.current.setSearchText(''); });

    expect(result.current.filteredProducts).toHaveLength(3);
  });

  it('error se popula cuando getAll rechaza con Error', async () => {
    mockGetAll.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network error');
    expect(result.current.products).toEqual([]);
  });

  it('error usa fallback cuando getAll rechaza con valor no-Error', async () => {
    mockGetAll.mockRejectedValue('fallo desconocido');
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Error desconocido');
  });

  it('refetch recarga los productos', async () => {
    mockGetAll.mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    mockGetAll.mockResolvedValue([mockProducts[0]]);

    act(() => { result.current.refetch(); });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toHaveLength(1);
  });
});
