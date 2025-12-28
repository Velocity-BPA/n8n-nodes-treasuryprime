/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ICredentialType, INodeProperties } from 'n8n-workflow';

/**
 * Treasury Prime OAuth Credentials
 *
 * Supports OAuth 2.0 authentication for Treasury Prime platform
 * when using partner integrations that require OAuth flow.
 */
export class TreasuryPrimeOAuth implements ICredentialType {
  name = 'treasuryPrimeOAuth';
  displayName = 'Treasury Prime OAuth2';
  documentationUrl = 'https://developers.treasuryprime.com/docs/oauth';
  extends = ['oAuth2Api'];

  properties: INodeProperties[] = [
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
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
      ],
      default: 'sandbox',
      description: 'Select the Treasury Prime environment',
    },
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default:
        '={{$self.environment === "production" ? "https://auth.treasuryprime.com/oauth/authorize" : "https://auth.sandbox.treasuryprime.com/oauth/authorize"}}',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default:
        '={{$self.environment === "production" ? "https://auth.treasuryprime.com/oauth/token" : "https://auth.sandbox.treasuryprime.com/oauth/token"}}',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'string',
      default: 'accounts:read accounts:write transfers:read transfers:write',
      description: 'Space-separated list of OAuth scopes',
    },
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      default: '',
      required: true,
      description: 'OAuth Client ID from Treasury Prime',
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'OAuth Client Secret from Treasury Prime',
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
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'header',
    },
  ];
}
