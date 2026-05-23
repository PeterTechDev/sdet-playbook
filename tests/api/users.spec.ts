import { test, expect } from '@playwright/test';
import { api } from '@/utils/api-client';

type Product = { id: string; name: string; price: number };

test.describe('Products API @smoke', () => {
  test('GET /products returns a non-empty list', async () => {
    const products = await api.get<{ data: Product[] }>('/products');

    expect(products.data.length).toBeGreaterThan(0);
    expect(products.data[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
    });
  });

  test('GET /products/:id returns the product', async () => {
    const list = await api.get<{ data: Product[] }>('/products');
    const first = list.data[0];
    if (!first) throw new Error('No products available to test detail endpoint');

    const product = await api.get<Product>(`/products/${first.id}`);

    expect(product.id).toBe(first.id);
  });
});
