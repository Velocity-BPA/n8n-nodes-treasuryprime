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
import { BUSINESS_TYPE_OPTIONS, PERSON_ROLE_OPTIONS } from '../../constants/accountTypes';

/**
 * Business Resource Operations
 */
export const businessOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['business'],
      },
    },
    options: [
      {
        name: 'Add Officer',
        value: 'addOfficer',
        description: 'Add a person as an officer of the business',
        action: 'Add business officer',
      },
      {
        name: 'Archive',
        value: 'archive',
        description: 'Archive a business record',
        action: 'Archive a business',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new business (company account holder)',
        action: 'Create a business',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get business details',
        action: 'Get a business',
      },
      {
        name: 'Get Accounts',
        value: 'getAccounts',
        description: 'Get all accounts belonging to this business',
        action: 'Get business accounts',
      },
      {
        name: 'Get Documents',
        value: 'getDocuments',
        description: 'Get all documents for this business',
        action: 'Get business documents',
      },
      {
        name: 'Get Officers',
        value: 'getOfficers',
        description: 'Get all officers of this business',
        action: 'Get business officers',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List all businesses',
        action: 'List businesses',
      },
      {
        name: 'Remove Officer',
        value: 'removeOfficer',
        description: 'Remove an officer from the business',
        action: 'Remove business officer',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a business',
        action: 'Update a business',
      },
    ],
    default: 'list',
  },
];

/**
 * Business Resource Fields
 */
export const businessFields: INodeProperties[] = [
  // Business ID field
  {
    displayName: 'Business ID',
    name: 'businessId',
    type: 'string',
    required: true,
    default: '',
    description: 'The unique identifier of the business',
    displayOptions: {
      show: {
        resource: ['business'],
        operation: ['get', 'update', 'archive', 'getAccounts', 'getDocuments', 'getOfficers', 'addOfficer', 'removeOfficer'],
      },
    },
  },

  // Create business fields
  {
    displayName: 'Legal Name',
    name: 'legalName',
    type: 'string',
    required: true,
    default: '',
    description: 'Legal name of the business',
    displayOptions: {
      show: {
        resource: ['business'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Business Type',
    name: 'businessType',
    type: 'options',
    required: true,
    options: [...BUSINESS_TYPE_OPTIONS],
    default: 'llc',
    description: 'Type of business entity',
    displayOptions: {
      show: {
        resource: ['business'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'EIN',
    name: 'ein',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'XX-XXXXXXX',
    description: 'Employer Identification Number (required for KYB)',
    displayOptions: {
      show: {
        resource: ['business'],
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
        resource: ['business'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'DBA Name',
        name: 'dbaName',
        type: 'string',
        default: '',
        description: 'Doing Business As name',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Business email address',
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        description: 'Business phone number',
      },
      {
        displayName: 'Website',
        name: 'website',
        type: 'string',
        default: '',
        description: 'Business website URL',
      },
      {
        displayName: 'Formation Date',
        name: 'formationDate',
        type: 'string',
        default: '',
        placeholder: 'YYYY-MM-DD',
        description: 'Date of business formation',
      },
      {
        displayName: 'Formation State',
        name: 'formationState',
        type: 'string',
        default: '',
        description: 'State where business was formed',
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
        description: 'Street address line 2',
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
        description: 'State code',
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
        description: 'Country code',
      },
      {
        displayName: 'Industry',
        name: 'industry',
        type: 'string',
        default: '',
        description: 'Industry or NAICS code',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'Business description',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'json',
        default: '{}',
        description: 'Custom metadata for the business',
      },
    ],
  },

  // Add officer fields
  {
    displayName: 'Person ID',
    name: 'officerPersonId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the person to add as an officer',
    displayOptions: {
      show: {
        resource: ['business'],
        operation: ['addOfficer', 'removeOfficer'],
      },
    },
  },
  {
    displayName: 'Role',
    name: 'officerRole',
    type: 'options',
    required: true,
    options: [...PERSON_ROLE_OPTIONS],
    default: 'owner',
    description: 'Role of the officer in the business',
    displayOptions: {
      show: {
        resource: ['business'],
        operation: ['addOfficer'],
      },
    },
  },
  {
    displayName: 'Officer Details',
    name: 'officerDetails',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['business'],
        operation: ['addOfficer'],
      },
    },
    options: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'Job title of the officer',
      },
      {
        displayName: 'Ownership Percentage',
        name: 'ownershipPercentage',
        type: 'number',
        typeOptions: {
          minValue: 0,
          maxValue: 100,
        },
        default: 0,
        description: 'Percentage of ownership in the business',
      },
      {
        displayName: 'Is Control Person',
        name: 'isControlPerson',
        type: 'boolean',
        default: false,
        description: 'Whether this person has significant control over the business',
      },
      {
        displayName: 'Is Signer',
        name: 'isSigner',
        type: 'boolean',
        default: false,
        description: 'Whether this person is an authorized signer',
      },
    ],
  },

  // Update business fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['business'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Legal Name',
        name: 'legalName',
        type: 'string',
        default: '',
        description: 'Legal name of the business',
      },
      {
        displayName: 'DBA Name',
        name: 'dbaName',
        type: 'string',
        default: '',
        description: 'Doing Business As name',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Business email address',
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        description: 'Business phone number',
      },
      {
        displayName: 'Website',
        name: 'website',
        type: 'string',
        default: '',
        description: 'Business website URL',
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
        description: 'State code',
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
        description: 'Custom metadata for the business',
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
        resource: ['business'],
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
        resource: ['business'],
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
        resource: ['business'],
        operation: ['list'],
      },
    },
    options: [
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
        description: 'Filter by business status',
      },
      {
        displayName: 'KYB Status',
        name: 'kybStatus',
        type: 'options',
        options: [
          { name: 'Approved', value: 'approved' },
          { name: 'Denied', value: 'denied' },
          { name: 'Pending', value: 'pending' },
          { name: 'Review', value: 'review' },
        ],
        default: '',
        description: 'Filter by KYB verification status',
      },
    ],
  },
];

/**
 * Execute Business Operations
 */
export async function executeBusinessOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'create': {
      const legalName = this.getNodeParameter('legalName', index) as string;
      const businessType = this.getNodeParameter('businessType', index) as string;
      const ein = this.getNodeParameter('ein', index) as string;
      const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

      const body: IDataObject = {
        legal_name: legalName,
        business_type: businessType,
        ein: ein,
      };

      if (additionalFields.dbaName) body.dba_name = additionalFields.dbaName;
      if (additionalFields.email) body.email = additionalFields.email;
      if (additionalFields.phoneNumber) body.phone_number = additionalFields.phoneNumber;
      if (additionalFields.website) body.website = additionalFields.website;
      if (additionalFields.formationDate) body.formation_date = additionalFields.formationDate;
      if (additionalFields.formationState) body.formation_state = additionalFields.formationState;
      if (additionalFields.industry) body.industry = additionalFields.industry;
      if (additionalFields.description) body.description = additionalFields.description;

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

      if (additionalFields.metadata) {
        body.metadata = typeof additionalFields.metadata === 'string'
          ? JSON.parse(additionalFields.metadata)
          : additionalFields.metadata;
      }

      responseData = await treasuryPrimeApiRequest.call(this, 'POST', API_PATHS.BUSINESSES, body);
      break;
    }

    case 'get': {
      const businessId = this.getNodeParameter('businessId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(this, 'GET', `${API_PATHS.BUSINESSES}/${businessId}`);
      break;
    }

    case 'update': {
      const businessId = this.getNodeParameter('businessId', index) as string;
      const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

      const body: IDataObject = {};
      if (updateFields.legalName) body.legal_name = updateFields.legalName;
      if (updateFields.dbaName) body.dba_name = updateFields.dbaName;
      if (updateFields.email) body.email = updateFields.email;
      if (updateFields.phoneNumber) body.phone_number = updateFields.phoneNumber;
      if (updateFields.website) body.website = updateFields.website;

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

      responseData = await treasuryPrimeApiRequest.call(this, 'PATCH', `${API_PATHS.BUSINESSES}/${businessId}`, body);
      break;
    }

    case 'list': {
      const returnAll = this.getNodeParameter('returnAll', index) as boolean;
      const filters = this.getNodeParameter('filters', index) as IDataObject;

      const query: IDataObject = {};
      if (filters.status) query.status = filters.status;
      if (filters.kybStatus) query.kyb_status = filters.kybStatus;

      if (returnAll) {
        responseData = await treasuryPrimeApiRequestAllItems.call(this, 'GET', API_PATHS.BUSINESSES, {}, query);
      } else {
        const limit = this.getNodeParameter('limit', index) as number;
        query.page_size = limit;
        const response = await treasuryPrimeApiRequest.call(this, 'GET', API_PATHS.BUSINESSES, {}, query);
        responseData = (response.data as IDataObject[]) || response;
      }
      break;
    }

    case 'archive': {
      const businessId = this.getNodeParameter('businessId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(this, 'POST', `${API_PATHS.BUSINESSES}/${businessId}/archive`);
      break;
    }

    case 'getAccounts': {
      const businessId = this.getNodeParameter('businessId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(this, 'GET', API_PATHS.ACCOUNTS, {}, { business_id: businessId });
      break;
    }

    case 'getDocuments': {
      const businessId = this.getNodeParameter('businessId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(this, 'GET', API_PATHS.DOCUMENTS, {}, { business_id: businessId });
      break;
    }

    case 'getOfficers': {
      const businessId = this.getNodeParameter('businessId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(this, 'GET', `${API_PATHS.BUSINESSES}/${businessId}/persons`);
      break;
    }

    case 'addOfficer': {
      const businessId = this.getNodeParameter('businessId', index) as string;
      const personId = this.getNodeParameter('officerPersonId', index) as string;
      const role = this.getNodeParameter('officerRole', index) as string;
      const officerDetails = this.getNodeParameter('officerDetails', index) as IDataObject;

      const body: IDataObject = {
        person_id: personId,
        role: role,
      };

      if (officerDetails.title) body.title = officerDetails.title;
      if (officerDetails.ownershipPercentage !== undefined) body.ownership_percentage = officerDetails.ownershipPercentage;
      if (officerDetails.isControlPerson !== undefined) body.is_control_person = officerDetails.isControlPerson;
      if (officerDetails.isSigner !== undefined) body.is_signer = officerDetails.isSigner;

      responseData = await treasuryPrimeApiRequest.call(this, 'POST', `${API_PATHS.BUSINESSES}/${businessId}/persons`, body);
      break;
    }

    case 'removeOfficer': {
      const businessId = this.getNodeParameter('businessId', index) as string;
      const personId = this.getNodeParameter('officerPersonId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(this, 'DELETE', `${API_PATHS.BUSINESSES}/${businessId}/persons/${personId}`);
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
export const execute = executeBusinessOperation;
