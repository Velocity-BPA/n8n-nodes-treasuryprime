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

/**
 * Person Resource Operations
 */
export const personOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['person'],
      },
    },
    options: [
      {
        name: 'Archive',
        value: 'archive',
        description: 'Archive a person record',
        action: 'Archive a person',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new person (individual account holder)',
        action: 'Create a person',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get person details',
        action: 'Get a person',
      },
      {
        name: 'Get Accounts',
        value: 'getAccounts',
        description: 'Get all accounts belonging to this person',
        action: 'Get person accounts',
      },
      {
        name: 'Get Documents',
        value: 'getDocuments',
        description: 'Get all documents for this person',
        action: 'Get person documents',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List all persons',
        action: 'List persons',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a person',
        action: 'Update a person',
      },
    ],
    default: 'list',
  },
];

/**
 * Person Resource Fields
 */
export const personFields: INodeProperties[] = [
  // Person ID field
  {
    displayName: 'Person ID',
    name: 'personId',
    type: 'string',
    required: true,
    default: '',
    description: 'The unique identifier of the person',
    displayOptions: {
      show: {
        resource: ['person'],
        operation: ['get', 'update', 'archive', 'getAccounts', 'getDocuments'],
      },
    },
  },

  // Create person fields
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    required: true,
    default: '',
    description: 'Person\'s legal first name',
    displayOptions: {
      show: {
        resource: ['person'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    required: true,
    default: '',
    description: 'Person\'s legal last name',
    displayOptions: {
      show: {
        resource: ['person'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    default: '',
    description: 'Person\'s email address',
    displayOptions: {
      show: {
        resource: ['person'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Date of Birth',
    name: 'dateOfBirth',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'YYYY-MM-DD',
    description: 'Person\'s date of birth (YYYY-MM-DD format)',
    displayOptions: {
      show: {
        resource: ['person'],
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
        resource: ['person'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Middle Name',
        name: 'middleName',
        type: 'string',
        default: '',
        description: 'Person\'s middle name',
      },
      {
        displayName: 'SSN',
        name: 'ssn',
        type: 'string',
        default: '',
        placeholder: 'XXX-XX-XXXX',
        description: 'Social Security Number (required for KYC)',
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        description: 'Phone number in E.164 format',
      },
      {
        displayName: 'Street Address',
        name: 'streetAddress',
        type: 'string',
        default: '',
        description: 'Street address line 1',
      },
      {
        displayName: 'Street Address Line 2',
        name: 'streetAddress2',
        type: 'string',
        default: '',
        description: 'Street address line 2 (apt, suite, etc.)',
      },
      {
        displayName: 'City',
        name: 'city',
        type: 'string',
        default: '',
        description: 'City name',
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'string',
        default: '',
        description: 'State/province code (e.g., CA, NY)',
      },
      {
        displayName: 'Postal Code',
        name: 'postalCode',
        type: 'string',
        default: '',
        description: 'ZIP or postal code',
      },
      {
        displayName: 'Country',
        name: 'country',
        type: 'string',
        default: 'US',
        description: 'Country code (ISO 3166-1 alpha-2)',
      },
      {
        displayName: 'Citizenship',
        name: 'citizenship',
        type: 'string',
        default: 'US',
        description: 'Country of citizenship (ISO 3166-1 alpha-2)',
      },
      {
        displayName: 'ID Type',
        name: 'idType',
        type: 'options',
        options: [
          { name: 'Driver License', value: 'drivers_license' },
          { name: 'Passport', value: 'passport' },
          { name: 'State ID', value: 'state_id' },
        ],
        default: 'drivers_license',
        description: 'Government ID type',
      },
      {
        displayName: 'ID Number',
        name: 'idNumber',
        type: 'string',
        default: '',
        description: 'Government ID number',
      },
      {
        displayName: 'ID State',
        name: 'idState',
        type: 'string',
        default: '',
        description: 'State that issued the ID',
      },
      {
        displayName: 'ID Expiration',
        name: 'idExpiration',
        type: 'string',
        default: '',
        placeholder: 'YYYY-MM-DD',
        description: 'ID expiration date',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'json',
        default: '{}',
        description: 'Custom metadata for the person',
      },
    ],
  },

  // Update person fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['person'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'Person\'s legal first name',
      },
      {
        displayName: 'Middle Name',
        name: 'middleName',
        type: 'string',
        default: '',
        description: 'Person\'s middle name',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'Person\'s legal last name',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Person\'s email address',
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        description: 'Phone number in E.164 format',
      },
      {
        displayName: 'Street Address',
        name: 'streetAddress',
        type: 'string',
        default: '',
        description: 'Street address line 1',
      },
      {
        displayName: 'City',
        name: 'city',
        type: 'string',
        default: '',
        description: 'City name',
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'string',
        default: '',
        description: 'State/province code',
      },
      {
        displayName: 'Postal Code',
        name: 'postalCode',
        type: 'string',
        default: '',
        description: 'ZIP or postal code',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'json',
        default: '{}',
        description: 'Custom metadata for the person',
      },
    ],
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
        resource: ['person'],
        operation: ['list'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    description: 'Max number of results to return',
    displayOptions: {
      show: {
        resource: ['person'],
        operation: ['list'],
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
        resource: ['person'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Filter by email address',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Active', value: 'active' },
          { name: 'Archived', value: 'archived' },
          { name: 'Pending', value: 'pending' },
        ],
        default: 'active',
        description: 'Filter by person status',
      },
      {
        displayName: 'KYC Status',
        name: 'kycStatus',
        type: 'options',
        options: [
          { name: 'Approved', value: 'approved' },
          { name: 'Denied', value: 'denied' },
          { name: 'Pending', value: 'pending' },
          { name: 'Review', value: 'review' },
        ],
        default: '',
        description: 'Filter by KYC verification status',
      },
    ],
  },
];

/**
 * Execute Person Operations
 */
export async function executePersonOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'create': {
      const firstName = this.getNodeParameter('firstName', index) as string;
      const lastName = this.getNodeParameter('lastName', index) as string;
      const email = this.getNodeParameter('email', index) as string;
      const dateOfBirth = this.getNodeParameter('dateOfBirth', index) as string;
      const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

      const body: IDataObject = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        date_of_birth: dateOfBirth,
      };

      if (additionalFields.middleName) body.middle_name = additionalFields.middleName;
      if (additionalFields.ssn) body.ssn = additionalFields.ssn;
      if (additionalFields.phoneNumber) body.phone_number = additionalFields.phoneNumber;
      if (additionalFields.citizenship) body.citizenship = additionalFields.citizenship;

      // Build address object if any address fields provided
      if (additionalFields.streetAddress || additionalFields.city || additionalFields.state) {
        body.address = {
          street_line_1: additionalFields.streetAddress || '',
          street_line_2: additionalFields.streetAddress2 || '',
          city: additionalFields.city || '',
          state: additionalFields.state || '',
          postal_code: additionalFields.postalCode || '',
          country: additionalFields.country || 'US',
        };
      }

      // Build government ID object if provided
      if (additionalFields.idType && additionalFields.idNumber) {
        body.government_id = {
          type: additionalFields.idType,
          number: additionalFields.idNumber,
          state: additionalFields.idState || '',
          expiration: additionalFields.idExpiration || '',
        };
      }

      if (additionalFields.metadata) {
        body.metadata = typeof additionalFields.metadata === 'string'
          ? JSON.parse(additionalFields.metadata)
          : additionalFields.metadata;
      }

      responseData = await treasuryPrimeApiRequest.call(this, 'POST', API_PATHS.PERSONS, body);
      break;
    }

    case 'get': {
      const personId = this.getNodeParameter('personId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(this, 'GET', `${API_PATHS.PERSONS}/${personId}`);
      break;
    }

    case 'update': {
      const personId = this.getNodeParameter('personId', index) as string;
      const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

      const body: IDataObject = {};
      if (updateFields.firstName) body.first_name = updateFields.firstName;
      if (updateFields.middleName) body.middle_name = updateFields.middleName;
      if (updateFields.lastName) body.last_name = updateFields.lastName;
      if (updateFields.email) body.email = updateFields.email;
      if (updateFields.phoneNumber) body.phone_number = updateFields.phoneNumber;

      if (updateFields.streetAddress || updateFields.city || updateFields.state) {
        body.address = {
          street_line_1: updateFields.streetAddress || '',
          city: updateFields.city || '',
          state: updateFields.state || '',
          postal_code: updateFields.postalCode || '',
        };
      }

      if (updateFields.metadata) {
        body.metadata = typeof updateFields.metadata === 'string'
          ? JSON.parse(updateFields.metadata)
          : updateFields.metadata;
      }

      responseData = await treasuryPrimeApiRequest.call(this, 'PATCH', `${API_PATHS.PERSONS}/${personId}`, body);
      break;
    }

    case 'list': {
      const returnAll = this.getNodeParameter('returnAll', index) as boolean;
      const filters = this.getNodeParameter('filters', index) as IDataObject;

      const query: IDataObject = {};
      if (filters.email) query.email = filters.email;
      if (filters.status) query.status = filters.status;
      if (filters.kycStatus) query.kyc_status = filters.kycStatus;

      if (returnAll) {
        responseData = await treasuryPrimeApiRequestAllItems.call(this, 'GET', API_PATHS.PERSONS, {}, query);
      } else {
        const limit = this.getNodeParameter('limit', index) as number;
        query.page_size = limit;
        const response = await treasuryPrimeApiRequest.call(this, 'GET', API_PATHS.PERSONS, {}, query);
        responseData = (response.data as IDataObject[]) || response;
      }
      break;
    }

    case 'archive': {
      const personId = this.getNodeParameter('personId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(this, 'POST', `${API_PATHS.PERSONS}/${personId}/archive`);
      break;
    }

    case 'getAccounts': {
      const personId = this.getNodeParameter('personId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(this, 'GET', API_PATHS.ACCOUNTS, {}, { person_id: personId });
      break;
    }

    case 'getDocuments': {
      const personId = this.getNodeParameter('personId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(this, 'GET', API_PATHS.DOCUMENTS, {}, { person_id: personId });
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
export const execute = executePersonOperation;
