/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, ILoadOptionsFunctions, ICredentialDataDecryptedObject } from 'n8n-workflow';
import { getBaseUrl } from '../constants/endpoints';

/**
 * Treasury Prime API Credentials Interface
 */
export interface ITreasuryPrimeCredentials {
  environment: 'production' | 'sandbox' | 'custom';
  customEndpoint?: string;
  apiKeyId: string;
  apiSecretKey: string;
  bankId: string;
  webhookSecret?: string;
}

/**
 * Get Treasury Prime credentials from context
 */
export async function getCredentials(
  context: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<ITreasuryPrimeCredentials> {
  const credentials = (await context.getCredentials('treasuryPrimeApi')) as ICredentialDataDecryptedObject;

  return {
    environment: credentials.environment as ITreasuryPrimeCredentials['environment'],
    customEndpoint: credentials.customEndpoint as string | undefined,
    apiKeyId: credentials.apiKeyId as string,
    apiSecretKey: credentials.apiSecretKey as string,
    bankId: credentials.bankId as string,
    webhookSecret: credentials.webhookSecret as string | undefined,
  };
}

/**
 * Get the API base URL from credentials
 */
export function getApiBaseUrl(credentials: ITreasuryPrimeCredentials): string {
  return getBaseUrl(credentials.environment, credentials.customEndpoint);
}

/**
 * Build Basic Auth header value
 */
export function buildBasicAuthHeader(apiKeyId: string, apiSecretKey: string): string {
  const credentials = `${apiKeyId}:${apiSecretKey}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
}

/**
 * Get authorization headers for API requests
 */
export function getAuthHeaders(credentials: ITreasuryPrimeCredentials): Record<string, string> {
  return {
    Authorization: buildBasicAuthHeader(credentials.apiKeyId, credentials.apiSecretKey),
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Bank-Id': credentials.bankId,
  };
}
