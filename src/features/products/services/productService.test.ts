import { productService } from './productService';
import type { Product } from '../../../types/product.types';

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
];

describe('productService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getAll', () => {
    it('retorna array de Product[] parseando el campo data', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: mockProducts }),
      } as unknown as Response);

      const result = await productService.getAll();

      expect(result).toEqual(mockProducts);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3002/bp/products',
      );
    });

    it('retorna array vacío cuando data es []', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      } as unknown as Response);

      const result = await productService.getAll();

      expect(result).toEqual([]);
    });

    it('lanza Error cuando la respuesta es HTTP 500', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      } as unknown as Response);

      await expect(productService.getAll()).rejects.toThrow(
        'Error 500: No se pudieron cargar los productos',
      );
    });

    it('lanza Error cuando la respuesta es HTTP 404', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      } as unknown as Response);

      await expect(productService.getAll()).rejects.toThrow('Error 404');
    });

    it('propaga error de red cuando fetch rechaza', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(productService.getAll()).rejects.toThrow('Network error');
    });
  });
});
