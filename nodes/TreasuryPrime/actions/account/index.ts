/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
  IDataObject,
} from 'n8n-workflow';
import { treasuryPrimeApiRequest, treasuryPrimeApiRequestAllItems } from '../../transport';
import { API_PATHS } from '../../constants';
import { ACCOUNT_TYPE_OPTIONS, ACCOUNT_STATUS_OPTIONS } from '../../constants/accountTypes';

/**
 * Account Resource Operations
 */
export const accountOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['account'],
      },
    },
    options: [
      {
        name: 'Close',
        value: 'close',
        description: 'Close a bank account',
        action: 'Close an account',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new bank account',
        action: 'Create an account',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get account details',
        action: 'Get an account',
      },
      {
        name: 'Get Available Balance',
        value: 'getAvailableBalance',
        description: 'Get available balance for an account',
        action: 'Get available balance',
      },
      {
        name: 'Get Balance',
        value: 'getBalance',
        description: 'Get current balance for an account',
        action: 'Get balance',
      },
      {
        name: 'Get Balances',
        value: 'getBalances',
        description: 'Get all balance information for an account',
        action: 'Get all balances',
      },
      {
        name: 'Get Numbers',
        value: 'getNumbers',
        description: 'Get account and routing numbers',
        action: 'Get account numbers',
      },
      {
        name: 'Get Pending Balance',
        value: 'getPendingBalance',
        description: 'Get pending balance for an account',
        action: 'Get pending balance',
      },
      {
        name: 'Get Statement',
        value: 'getStatement',
        description: 'Get account statement',
        action: 'Get statement',
      },
      {
        name: 'Get Transactions',
        value: 'getTransactions',
        description: 'Get transactions for an account',
        action: 'Get transactions',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List all accounts',
        action: 'List accounts',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an account',
        action: 'Update an account',
      },
      {
        name: 'Update Status',
        value: 'updateStatus',
        description: 'Update account status (freeze/unfreeze)',
        action: 'Update account status',
      },
    ],
    default: 'list',
  },
];

/**
 * Account Resource Fields
 */
export const accountFields: INodeProperties[] = [
  // Account ID field (for operations that need it)
  {
    displayName: 'Account ID',
    name: 'accountId',
    type: 'string',
    required: true,
    default: '',
    description: 'The unique identifier of the account',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: [
          'get',
          'update',
          'close',
          'getBalance',
          'getBalances',
          'getPendingBalance',
          'getAvailableBalance',
          'getNumbers',
          'getStatement',
          'getTransactions',
          'updateStatus',
        ],
      },
    },
  },

  // Create account fields
  {
    displayName: 'Account Type',
    name: 'accountType',
    type: 'options',
    required: true,
    options: [...ACCOUNT_TYPE_OPTIONS],
    default: 'checking',
    description: 'Type of bank account to create',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Person ID or Business ID',
    name: 'ownerId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the person or business that owns this account',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Owner Type',
    name: 'ownerType',
    type: 'options',
    required: true,
    options: [
      { name: 'Person', value: 'person' },
      { name: 'Business', value: 'business' },
    ],
    default: 'person',
    description: 'Whether the account owner is a person or business',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Friendly name for the account',
      },
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: 'USD',
        description: 'Account currency (ISO 4217 code)',
      },
      {
        displayName: 'Product ID',
        name: 'productId',
        type: 'string',
        default: '',
        description: 'Bank product ID for this account',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'json',
        default: '{}',
        description: 'Custom metadata for the account',
      },
    ],
  },

  // Update account fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Friendly name for the account',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'json',
        default: '{}',
        description: 'Custom metadata for the account',
      },
    ],
  },

  // Update status field
  {
    displayName: 'New Status',
    name: 'newStatus',
    type: 'options',
    required: true,
    options: [...ACCOUNT_STATUS_OPTIONS],
    default: 'open',
    description: 'The new status for the account',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['updateStatus'],
      },
    },
  },
  {
    displayName: 'Status Reason',
    name: 'statusReason',
    type: 'string',
    default: '',
    description: 'Reason for the status change',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['updateStatus'],
      },
    },
  },

  // List filters
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['list', 'getTransactions'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    description: 'Max number of results to return',
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['list', 'getTransactions'],
        returnAll: [false],
      },
    },
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Person ID',
        name: 'personId',
        type: 'string',
        default: '',
        description: 'Filter by person ID',
      },
      {
        displayName: 'Business ID',
        name: 'businessId',
        type: 'string',
        default: '',
        description: 'Filter by business ID',
      },
      {
        displayName: 'Account Type',
        name: 'accountType',
        type: 'options',
        options: [...ACCOUNT_TYPE_OPTIONS],
        default: '',
        description: 'Filter by account type',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [...ACCOUNT_STATUS_OPTIONS],
        default: '',
        description: 'Filter by account status',
      },
    ],
  },

  // Transaction filters
  {
    displayName: 'Transaction Filters',
    name: 'transactionFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getTransactions'],
      },
    },
    options: [
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        default: '',
        description: 'Filter transactions from this date',
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        default: '',
        description: 'Filter transactions until this date',
      },
      {
        displayName: 'Transaction Type',
        name: 'transactionType',
        type: 'string',
        default: '',
        description: 'Filter by transaction type',
      },
    ],
  },

  // Statement options
  {
    displayName: 'Statement Options',
    name: 'statementOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getStatement'],
      },
    },
    options: [
      {
        displayName: 'Statement ID',
        name: 'statementId',
        type: 'string',
        default: '',
        description: 'Specific statement ID to retrieve',
      },
      {
        displayName: 'Year',
        name: 'year',
        type: 'number',
        default: '',
        description: 'Year for the statement',
      },
      {
        displayName: 'Month',
        name: 'month',
        type: 'number',
        default: '',
        description: 'Month for the statement (1-12)',
        typeOptions: {
          minValue: 1,
          maxValue: 12,
        },
      },
    ],
  },

  // Close account options
  {
    displayName: 'Close Options',
    name: 'closeOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['close'],
      },
    },
    options: [
      {
        displayName: 'Reason',
        name: 'reason',
        type: 'string',
        default: '',
        description: 'Reason for closing the account',
      },
      {
        displayName: 'Transfer Remaining Balance To',
        name: 'transferToAccountId',
        type: 'string',
        default: '',
        description: 'Account ID to transfer remaining balance to',
      },
    ],
  },
];

/**
 * Execute Account Operations
 */
export async function executeAccountOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'create': {
      const accountType = this.getNodeParameter('accountType', index) as string;
      const ownerId = this.getNodeParameter('ownerId', index) as string;
      const ownerType = this.getNodeParameter('ownerType', index) as string;
      const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

      const body: IDataObject = {
        account_type: accountType,
        [ownerType === 'person' ? 'person_id' : 'business_id']: ownerId,
      };

      if (additionalFields.name) {
        body.name = additionalFields.name;
      }
      if (additionalFields.currency) {
        body.currency = additionalFields.currency;
      }
      if (additionalFields.productId) {
        body.product_id = additionalFields.productId;
      }
      if (additionalFields.metadata) {
        body.metadata =
          typeof additionalFields.metadata === 'string'
            ? JSON.parse(additionalFields.metadata)
            : additionalFields.metadata;
      }

      responseData = await treasuryPrimeApiRequest.call(
        this,
        'POST',
        API_PATHS.ACCOUNTS,
        body,
      );
      break;
    }

    case 'get': {
      const accountId = this.getNodeParameter('accountId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(
        this,
        'GET',
        `${API_PATHS.ACCOUNTS}/${accountId}`,
      );
      break;
    }

    case 'update': {
      const accountId = this.getNodeParameter('accountId', index) as string;
      const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

      const body: IDataObject = {};
      if (updateFields.name) {
        body.name = updateFields.name;
      }
      if (updateFields.metadata) {
        body.metadata =
          typeof updateFields.metadata === 'string'
            ? JSON.parse(updateFields.metadata)
            : updateFields.metadata;
      }

      responseData = await treasuryPrimeApiRequest.call(
        this,
        'PATCH',
        `${API_PATHS.ACCOUNTS}/${accountId}`,
        body,
      );
      break;
    }

    case 'list': {
      const returnAll = this.getNodeParameter('returnAll', index) as boolean;
      const filters = this.getNodeParameter('filters', index) as IDataObject;

      const query: IDataObject = {};
      if (filters.personId) {
        query.person_id = filters.personId;
      }
      if (filters.businessId) {
        query.business_id = filters.businessId;
      }
      if (filters.accountType) {
        query.account_type = filters.accountType;
      }
      if (filters.status) {
        query.status = filters.status;
      }

      if (returnAll) {
        responseData = await treasuryPrimeApiRequestAllItems.call(
          this,
          'GET',
          API_PATHS.ACCOUNTS,
          {},
          query,
        );
      } else {
        const limit = this.getNodeParameter('limit', index) as number;
        query.page_size = limit;
        const response = await treasuryPrimeApiRequest.call(
          this,
          'GET',
          API_PATHS.ACCOUNTS,
          {},
          query,
        );
        responseData = (response.data as IDataObject[]) || response;
      }
      break;
    }

    case 'close': {
      const accountId = this.getNodeParameter('accountId', index) as string;
      const closeOptions = this.getNodeParameter('closeOptions', index) as IDataObject;

      const body: IDataObject = {};
      if (closeOptions.reason) {
        body.reason = closeOptions.reason;
      }
      if (closeOptions.transferToAccountId) {
        body.transfer_to_account_id = closeOptions.transferToAccountId;
      }

      responseData = await treasuryPrimeApiRequest.call(
        this,
        'POST',
        `${API_PATHS.ACCOUNTS}/${accountId}/close`,
        body,
      );
      break;
    }

    case 'getBalance': {
      const accountId = this.getNodeParameter('accountId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(
        this,
        'GET',
        `${API_PATHS.ACCOUNTS}/${accountId}/balance`,
      );
      break;
    }

    case 'getBalances': {
      const accountId = this.getNodeParameter('accountId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(
        this,
        'GET',
        `${API_PATHS.ACCOUNTS}/${accountId}/balances`,
      );
      break;
    }

    case 'getPendingBalance': {
      const accountId = this.getNodeParameter('accountId', index) as string;
      const response = await treasuryPrimeApiRequest.call(
        this,
        'GET',
        `${API_PATHS.ACCOUNTS}/${accountId}/balances`,
      );
      responseData = { pending_balance: (response as IDataObject).pending_balance };
      break;
    }

    case 'getAvailableBalance': {
      const accountId = this.getNodeParameter('accountId', index) as string;
      const response = await treasuryPrimeApiRequest.call(
        this,
        'GET',
        `${API_PATHS.ACCOUNTS}/${accountId}/balances`,
      );
      responseData = { available_balance: (response as IDataObject).available_balance };
      break;
    }

    case 'getNumbers': {
      const accountId = this.getNodeParameter('accountId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(
        this,
        'GET',
        `${API_PATHS.ACCOUNTS}/${accountId}/account_number`,
      );
      break;
    }

    case 'getStatement': {
      const accountId = this.getNodeParameter('accountId', index) as string;
      const statementOptions = this.getNodeParameter('statementOptions', index) as IDataObject;

      let endpoint = `${API_PATHS.ACCOUNTS}/${accountId}/statements`;
      const query: IDataObject = {};

      if (statementOptions.statementId) {
        endpoint = `${API_PATHS.STATEMENTS}/${statementOptions.statementId}`;
      } else {
        if (statementOptions.year) {
          query.year = statementOptions.year;
        }
        if (statementOptions.month) {
          query.month = statementOptions.month;
        }
      }

      responseData = await treasuryPrimeApiRequest.call(this, 'GET', endpoint, {}, query);
      break;
    }

    case 'getTransactions': {
      const accountId = this.getNodeParameter('accountId', index) as string;
      const returnAll = this.getNodeParameter('returnAll', index) as boolean;
      const transactionFilters = this.getNodeParameter(
        'transactionFilters',
        index,
      ) as IDataObject;

      const query: IDataObject = {
        account_id: accountId,
      };

      if (transactionFilters.startDate) {
        query.start_date = transactionFilters.startDate;
      }
      if (transactionFilters.endDate) {
        query.end_date = transactionFilters.endDate;
      }
      if (transactionFilters.transactionType) {
        query.transaction_type = transactionFilters.transactionType;
      }

      if (returnAll) {
        responseData = await treasuryPrimeApiRequestAllItems.call(
          this,
          'GET',
          API_PATHS.TRANSACTIONS,
          {},
          query,
        );
      } else {
        const limit = this.getNodeParameter('limit', index) as number;
        query.page_size = limit;
        const response = await treasuryPrimeApiRequest.call(
          this,
          'GET',
          API_PATHS.TRANSACTIONS,
          {},
          query,
        );
        responseData = (response.data as IDataObject[]) || response;
      }
      break;
    }

    case 'updateStatus': {
      const accountId = this.getNodeParameter('accountId', index) as string;
      const newStatus = this.getNodeParameter('newStatus', index) as string;
      const statusReason = this.getNodeParameter('statusReason', index) as string;

      const body: IDataObject = {
        status: newStatus,
      };
      if (statusReason) {
        body.reason = statusReason;
      }

      responseData = await treasuryPrimeApiRequest.call(
        this,
        'PATCH',
        `${API_PATHS.ACCOUNTS}/${accountId}/status`,
        body,
      );
      break;
    }
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(responseData),
    { itemData: { item: index } },
  );

  return executionData;
}

// Export execute alias for main node
export const execute = executeAccountOperation;
