/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHttpRequestMethods,
  NodeApiError,
  IDataObject,
  IHttpRequestOptions,
} from 'n8n-workflow';
import { getCredentials, getApiBaseUrl, ITreasuryPrimeCredentials } from '../utils/authUtils';
import { generateIdempotencyKey } from '../utils/signatureUtils';

/**
 * Treasury Prime API Response Interface
 */
export interface ITreasuryPrimeResponse<T = IDataObject> {
  data: T;
  pagination?: {
    page_number: number;
    page_size: number;
    total_count: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

/**
 * Treasury Prime List Response Interface
 */
export interface ITreasuryPrimeListResponse<T = IDataObject> {
  data: T[];
  pagination: {
    page_number: number;
    page_size: number;
    total_count: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

/**
 * Treasury Prime Error Response Interface
 */
export interface ITreasuryPrimeError {
  error: {
    code: string;
    message: string;
    details?: IDataObject;
  };
}

/**
 * Request Options Interface
 */
export interface IRequestOptions {
  method: IHttpRequestMethods;
  endpoint: string;
  body?: IDataObject;
  query?: IDataObject;
  idempotencyKey?: string;
  headers?: Record<string, string>;
}

/**
 * Treasury Prime API Client
 *
 * Handles all API communication with Treasury Prime platform.
 */
export class TreasuryPrimeClient {
  private context: IExecuteFunctions | ILoadOptionsFunctions;
  private credentials: ITreasuryPrimeCredentials | null = null;
  private axiosInstance: AxiosInstance | null = null;

  constructor(context: IExecuteFunctions | ILoadOptionsFunctions) {
    this.context = context;
  }

  /**
   * Initialize the client with credentials
   */
  async initialize(): Promise<void> {
    this.credentials = await getCredentials(this.context);
    const baseURL = getApiBaseUrl(this.credentials);

    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Bank-Id': this.credentials.bankId,
      },
      auth: {
        username: this.credentials.apiKeyId,
        password: this.credentials.apiSecretKey,
      },
    });

    // Add request interceptor for logging (non-sensitive)
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Log request method and URL (no sensitive data)
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(this.formatError(error));
      },
    );
  }

  /**
   * Format API errors into consistent structure
   */
  private formatError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      if (response?.data) {
        const errorData = response.data as ITreasuryPrimeError;
        if (errorData.error) {
          return new Error(
            `Treasury Prime API Error [${errorData.error.code}]: ${errorData.error.message}`,
          );
        }
      }
      return new Error(`Treasury Prime API Error: ${error.message}`);
    }
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }

  /**
   * Make an API request
   */
  async request<T = IDataObject>(options: IRequestOptions): Promise<T> {
    if (!this.axiosInstance) {
      await this.initialize();
    }

    const config: AxiosRequestConfig = {
      method: options.method,
      url: options.endpoint,
      params: options.query,
      data: options.body,
      headers: {
        ...options.headers,
      },
    };

    // Add idempotency key for write operations
    if (['POST', 'PUT', 'PATCH'].includes(options.method.toUpperCase())) {
      config.headers = {
        ...config.headers,
        'Idempotency-Key': options.idempotencyKey || generateIdempotencyKey(),
      };
    }

    try {
      const response: AxiosResponse<T> = await this.axiosInstance!.request(config);
      return response.data;
    } catch (error) {
      throw new NodeApiError(this.context.getNode(), {
        message: error instanceof Error ? error.message : 'API request failed',
      });
    }
  }

  /**
   * GET request helper
   */
  async get<T = IDataObject>(
    endpoint: string,
    query?: IDataObject,
  ): Promise<T> {
    return this.request<T>({
      method: 'GET',
      endpoint,
      query,
    });
  }

  /**
   * POST request helper
   */
  async post<T = IDataObject>(
    endpoint: string,
    body?: IDataObject,
    idempotencyKey?: string,
  ): Promise<T> {
    return this.request<T>({
      method: 'POST',
      endpoint,
      body,
      idempotencyKey,
    });
  }

  /**
   * PUT request helper
   */
  async put<T = IDataObject>(
    endpoint: string,
    body?: IDataObject,
    idempotencyKey?: string,
  ): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      endpoint,
      body,
      idempotencyKey,
    });
  }

  /**
   * PATCH request helper
   */
  async patch<T = IDataObject>(
    endpoint: string,
    body?: IDataObject,
    idempotencyKey?: string,
  ): Promise<T> {
    return this.request<T>({
      method: 'PATCH',
      endpoint,
      body,
      idempotencyKey,
    });
  }

  /**
   * DELETE request helper
   */
  async delete<T = IDataObject>(endpoint: string): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      endpoint,
    });
  }

  /**
   * Paginated GET request - returns all pages
   */
  async getAll<T = IDataObject>(
    endpoint: string,
    query?: IDataObject,
    limit?: number,
  ): Promise<T[]> {
    const results: T[] = [];
    let page = 1;
    const pageSize = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await this.get<ITreasuryPrimeListResponse<T>>(endpoint, {
        ...query,
        page_number: page,
        page_size: pageSize,
      });

      results.push(...response.data);

      if (limit && results.length >= limit) {
        return results.slice(0, limit);
      }

      hasMore = response.pagination?.has_next ?? false;
      page++;

      // Safety limit to prevent infinite loops
      if (page > 1000) {
        break;
      }
    }

    return results;
  }

  /**
   * Upload a document/file
   */
  async uploadFile(
    endpoint: string,
    fileData: Buffer,
    fileName: string,
    mimeType: string,
    additionalFields?: IDataObject,
  ): Promise<IDataObject> {
    if (!this.axiosInstance) {
      await this.initialize();
    }

    const formData = new FormData();
    const blob = new Blob([fileData], { type: mimeType });
    formData.append('file', blob, fileName);

    if (additionalFields) {
      for (const [key, value] of Object.entries(additionalFields)) {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }
    }

    try {
      const response = await this.axiosInstance!.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Idempotency-Key': generateIdempotencyKey(),
        },
      });
      return response.data;
    } catch (error) {
      throw new NodeApiError(this.context.getNode(), {
        message: error instanceof Error ? error.message : 'File upload failed',
      });
    }
  }

  /**
   * Download a file/document
   */
  async downloadFile(endpoint: string): Promise<Buffer> {
    if (!this.axiosInstance) {
      await this.initialize();
    }

    try {
      const response = await this.axiosInstance!.get(endpoint, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      throw new NodeApiError(this.context.getNode(), {
        message: error instanceof Error ? error.message : 'File download failed',
      });
    }
  }

  /**
   * Get credentials for webhook verification
   */
  getWebhookSecret(): string | undefined {
    return this.credentials?.webhookSecret;
  }
}

/**
 * Create and initialize a Treasury Prime client
 */
export async function createTreasuryPrimeClient(
  context: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<TreasuryPrimeClient> {
  const client = new TreasuryPrimeClient(context);
  await client.initialize();
  return client;
}

/**
 * Make a simple API request using n8n's built-in HTTP helper
 * This is an alternative approach that uses n8n's native request handling
 */
export async function treasuryPrimeApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  options: IDataObject = {},
): Promise<IDataObject> {
  const credentials = await getCredentials(this);
  const baseUrl = getApiBaseUrl(credentials);

  const extraHeaders = (options.headers as IDataObject) || {};

  const requestOptions: IHttpRequestOptions = {
    method,
    url: `${baseUrl}${endpoint}`,
    body,
    qs: query,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Bank-Id': credentials.bankId,
      Authorization: `Basic ${Buffer.from(
        `${credentials.apiKeyId}:${credentials.apiSecretKey}`,
      ).toString('base64')}`,
      ...extraHeaders,
    },
    json: true,
  };

  // Apply optional settings
  if (options.encoding !== undefined) {
    (requestOptions as unknown as Record<string, unknown>).encoding = options.encoding;
  }
  if (options.formData !== undefined) {
    (requestOptions as unknown as Record<string, unknown>).formData = options.formData;
    delete requestOptions.body;
    delete requestOptions.headers!['Content-Type'];
  }
  if (options.returnFullResponse || options.resolveWithFullResponse) {
    requestOptions.returnFullResponse = true;
  }

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    requestOptions.headers!['Idempotency-Key'] = generateIdempotencyKey();
  }

  if (Object.keys(body).length === 0) {
    delete requestOptions.body;
  }

  if (Object.keys(query).length === 0) {
    delete requestOptions.qs;
  }

  try {
    const response = await this.helpers.httpRequest(requestOptions);
    return response as IDataObject;
  } catch (error) {
    throw new NodeApiError(this.getNode(), {
      message: error instanceof Error ? error.message : 'API request failed',
    });
  }
}

/**
 * Make a paginated API request to get all results
 */
export async function treasuryPrimeApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  limit?: number,
): Promise<IDataObject[]> {
  const results: IDataObject[] = [];
  let page = 1;
  const pageSize = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await treasuryPrimeApiRequest.call(this, method, endpoint, body, {
      ...query,
      page_number: page,
      page_size: pageSize,
    });

    const responseData = response as unknown as ITreasuryPrimeListResponse;
    if (responseData.data && Array.isArray(responseData.data)) {
      results.push(...responseData.data);
    }

    if (limit && results.length >= limit) {
      return results.slice(0, limit);
    }

    hasMore = responseData.pagination?.has_next ?? false;
    page++;

    // Safety limit
    if (page > 1000) {
      break;
    }
  }

  return results;
}
