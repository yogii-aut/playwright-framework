import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { env } from '@config/env';
import { TestLogCollector } from '@src/core/logger/test-log-collector';

export interface RequestOptions {
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export class RestClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly logger: TestLogCollector
  ) {}

  async get(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return this.send('GET', endpoint, options);
  }

  async post(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return this.send('POST', endpoint, options);
  }

  async put(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return this.send('PUT', endpoint, options);
  }

  async patch(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return this.send('PATCH', endpoint, options);
  }

  async delete(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return this.send('DELETE', endpoint, options);
  }

  async parseJson<T>(response: APIResponse): Promise<T> {
    return response.json() as Promise<T>;
  }

  async assertStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    expect(response.status(), `Unexpected status for ${response.url()}`).toBe(expectedStatus);
  }

  private async send(method: string, endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    const requestUrl = this.resolveRequestUrl(endpoint, options?.params);
    const startedAt = Date.now();

    this.logger.debug('API request started', {
      method,
      requestUrl,
      endpoint,
      params: options?.params,
      requestHeaders: options?.headers,
      requestBody: options?.data,
      stackTrace: new Error().stack
    });

    try {
      const response = await this.request.fetch(endpoint, {
        method,
        params: options?.params,
        data: options?.data,
        headers: options?.headers
      });

      const responseText = await response.text();
      const durationMs = Date.now() - startedAt;

      this.logger.debug('API response received', {
        method,
        requestUrl,
        endpoint,
        status: response.status(),
        statusText: response.statusText(),
        durationMs,
        responseHeaders: response.headers(),
        responseBody: this.safeParseBody(responseText)
      });

      return response;
    } catch (error) {
      const typedError = error as Error;
      this.logger.error('API request failed', {
        method,
        requestUrl,
        endpoint,
        params: options?.params,
        requestHeaders: options?.headers,
        requestBody: options?.data,
        durationMs: Date.now() - startedAt,
        message: typedError.message,
        stackTrace: typedError.stack
      });
      throw error;
    }
  }

  private resolveRequestUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const requestUrl = endpoint.startsWith('http')
      ? new URL(endpoint)
      : new URL(endpoint, env.apiBaseUrl);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        requestUrl.searchParams.set(key, String(value));
      }
    }

    return requestUrl.toString();
  }

  private safeParseBody(body: string): unknown {
    if (!body) {
      return '';
    }

    try {
      return JSON.parse(body) as unknown;
    } catch {
      return body;
    }
  }
}
