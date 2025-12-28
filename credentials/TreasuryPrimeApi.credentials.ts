/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

/**
 * Treasury Prime API Credentials
 *
 * Supports authentication to Treasury Prime BaaS platform
 * with API key authentication for multiple environments.
 */
export class TreasuryPrimeApi implements ICredentialType {
  name = 'treasuryPrimeApi';
  displayName = 'Treasury Prime API';
  documentationUrl = 'https://developers.treasuryprime.com/docs/authentication';

  properties: INodeProperties[] = [
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        {
          name: 'Sandbox',
          value: 'sandbox',
          description: 'Use Treasury Prime sandbox environment for testing',
        },
        {
          name: 'Production',
          value: 'production',
          description: 'Use Treasury Prime production environment',
        },
        {
          name: 'Custom',
          value: 'custom',
          description: 'Use a custom endpoint URL',
        },
      ],
      default: 'sandbox',
      description: 'Select the Treasury Prime environment to connect to',
    },
    {
      displayName: 'Custom Endpoint URL',
      name: 'customEndpoint',
      type: 'string',
      default: '',
      placeholder: 'https://api.custom.treasuryprime.com',
      description: 'Custom API endpoint URL (only used when Environment is set to Custom)',
      displayOptions: {
        show: {
          environment: ['custom'],
        },
      },
    },
    {
      displayName: 'API Key ID',
      name: 'apiKeyId',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Treasury Prime API Key ID',
    },
    {
      displayName: 'API Secret Key',
      name: 'apiSecretKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Treasury Prime API Secret Key',
    },
    {
      displayName: 'Bank ID',
      name: 'bankId',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Treasury Prime Bank Partner ID',
    },
    {
      displayName: 'Webhook Secret',
      name: 'webhookSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Webhook signing secret for verifying webhook payloads (optional)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.apiKeyId}}',
        password: '={{$credentials.apiSecretKey}}',
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Bank-Id': '={{$credentials.bankId}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.environment === "production" ? "https://api.treasuryprime.com" : $credentials.environment === "sandbox" ? "https://api.sandbox.treasuryprime.com" : $credentials.customEndpoint}}',
      url: '/bank',
      method: 'GET',
    },
  };
}
