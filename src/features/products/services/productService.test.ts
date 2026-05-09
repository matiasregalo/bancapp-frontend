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

const mockProduct = mockProducts[0];

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
        'http://10.0.2.2:3002/bp/products',
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

  describe('verifyId', () => {
    it('retorna true cuando el ID ya existe', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(true),
      } as unknown as Response);

      const result = await productService.verifyId('trj-crd');

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://10.0.2.2:3002/bp/products/verification/trj-crd',
      );
    });

    it('retorna false cuando el ID no existe', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(false),
      } as unknown as Response);

      const result = await productService.verifyId('nuevo-id');

      expect(result).toBe(false);
    });

    it('lanza Error cuando la API responde con error HTTP', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      } as unknown as Response);

      await expect(productService.verifyId('trj-crd')).rejects.toThrow(
        'Error 500: No se pudo verificar el ID',
      );
    });
  });

  describe('create', () => {
    const newProduct: Product = {
      id: 'p001',
      name: 'Producto Nuevo',
      description: 'Descripcion larga de producto nuevo de prueba',
      logo: 'https://example.com/logo.png',
      date_release: '2030-01-01',
      date_revision: '2031-01-01',
    };

    it('envía POST con body correcto y retorna Product creado', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          message: 'Product added successfully',
          data: newProduct,
        }),
      } as unknown as Response);

      const result = await productService.create(newProduct);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://10.0.2.2:3002/bp/products',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        }),
      );
      expect(result).toEqual(newProduct);
    });

    it('lanza Error con el mensaje de la API cuando responde con 400', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({
          name: 'BadRequestError',
          message: 'El ID ya existe',
        }),
      } as unknown as Response);

      await expect(productService.create(newProduct)).rejects.toThrow(
        'El ID ya existe',
      );
    });

    it('lanza Error genérico cuando el body de error no es JSON válido', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: jest.fn().mockRejectedValue(new Error('invalid json')),
      } as unknown as Response);

      await expect(productService.create(newProduct)).rejects.toThrow(
        'Error 503',
      );
    });
  });

  describe('update', () => {
    const updateData = {
      name: 'Tarjeta Actualizada',
      description: 'Descripcion actualizada con longitud suficiente',
      logo: 'https://example.com/logo.png',
      date_release: '2030-06-01',
      date_revision: '2031-06-01',
    };
    const updatedProduct: Product = { id: 'trj-crd', ...updateData };

    it('envía PUT a la URL correcta con body sin id y retorna Product', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          message: 'Product updated successfully',
          data: updatedProduct,
        }),
      } as unknown as Response);

      const result = await productService.update('trj-crd', updateData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://10.0.2.2:3002/bp/products/trj-crd',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      const body = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body,
      );
      expect(body).not.toHaveProperty('id');
      expect(result).toEqual(updatedProduct);
    });

    it('lanza Error con mensaje de la API cuando responde con 404', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({
          message: 'Not product found with that identifier',
        }),
      } as unknown as Response);

      await expect(
        productService.update('no-existe', updateData),
      ).rejects.toThrow('Not product found with that identifier');
    });
  });

  // Keep reference to mockProduct to avoid TS unused warning
  it('tiene un producto de referencia para tests', () => {
    expect(mockProduct.id).toBe('trj-crd');
  });
});
