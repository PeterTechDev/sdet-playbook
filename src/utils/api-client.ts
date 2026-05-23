import { request, APIRequestContext } from '@playwright/test';
import { env } from './env';

export type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
};

class ApiClient {
  private ctx?: APIRequestContext;

  private async context(): Promise<APIRequestContext> {
    if (!this.ctx) {
      this.ctx = await request.newContext({
        baseURL: env.API_URL,
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      });
    }
    return this.ctx;
  }

  async get<T>(path: string, opts: RequestOptions = {}): Promise<T> {
    const ctx = await this.context();
    const res = await ctx.get(path, { headers: opts.headers, params: opts.params });
    if (!res.ok()) throw new Error(`GET ${path} -> ${res.status()}`);
    return (await res.json()) as T;
  }

  async post<T>(path: string, body: unknown, opts: RequestOptions = {}): Promise<T> {
    const ctx = await this.context();
    const res = await ctx.post(path, { data: body, headers: opts.headers });
    if (!res.ok()) throw new Error(`POST ${path} -> ${res.status()}`);
    return (await res.json()) as T;
  }

  async dispose(): Promise<void> {
    await this.ctx?.dispose();
    this.ctx = undefined;
  }
}

export const api = new ApiClient();
