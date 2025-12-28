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
import { APPLICATION_STATUS_OPTIONS, ACCOUNT_TYPE_OPTIONS } from '../../constants/accountTypes';

/**
 * Account Application Resource Operations
 */
export const accountApplicationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['accountApplication'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new account application',
        action: 'Create an account application',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get account application details',
        action: 'Get an account application',
      },
      {
        name: 'Get Requirements',
        value: 'getRequirements',
        description: 'Get application requirements',
        action: 'Get application requirements',
      },
      {
        name: 'Get Status',
        value: 'getStatus',
        description: 'Get application status',
        action: 'Get application status',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List all account applications',
        action: 'List account applications',
      },
      {
        name: 'Submit',
        value: 'submit',
        description: 'Submit an account application',
        action: 'Submit an account application',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an account application',
        action: 'Update an account application',
      },
      {
        name: 'Upload Document',
        value: 'uploadDocument',
        description: 'Upload document for application',
        action: 'Upload application document',
      },
    ],
    default: 'list',
  },
];

/**
 * Account Application Resource Fields
 */
export const accountApplicationFields: INodeProperties[] = [
  // Application ID field
  {
    displayName: 'Application ID',
    name: 'applicationId',
    type: 'string',
    required: true,
    default: '',
    description: 'The unique identifier of the account application',
    displayOptions: {
      show: {
        resource: ['accountApplication'],
        operation: ['get', 'update', 'submit', 'getStatus', 'getRequirements', 'uploadDocument'],
      },
    },
  },

  // Create application fields
  {
    displayName: 'Account Type',
    name: 'accountType',
    type: 'options',
    required: true,
    options: [...ACCOUNT_TYPE_OPTIONS],
    default: 'checking',
    description: 'Type of account being applied for',
    displayOptions: {
      show: {
        resource: ['accountApplication'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Applicant Type',
    name: 'applicantType',
    type: 'options',
    required: true,
    options: [
      { name: 'Person', value: 'person' },
      { name: 'Business', value: 'business' },
    ],
    default: 'person',
    description: 'Whether the applicant is a person or business',
    displayOptions: {
      show: {
        resource: ['accountApplication'],
        operation: ['create'],
      },
    },
  },

  // Person applicant fields
  {
    displayName: 'Person Details',
    name: 'personDetails',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['accountApplication'],
        operation: ['create'],
        applicantType: ['person'],
      },
    },
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        required: true,
        description: "Applicant's first name",
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        required: true,
        description: "Applicant's last name",
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: "Applicant's email address",
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        description: "Applicant's phone number (E.164 format)",
      },
      {
        displayName: 'Date of Birth',
        name: 'dateOfBirth',
        type: 'string',
        default: '',
        description: 'Date of birth (YYYY-MM-DD)',
      },
      {
        displayName: 'SSN',
        name: 'ssn',
        type: 'string',
        default: '',
        description: 'Social Security Number',
      },
      {
        displayName: 'Address Line 1',
        name: 'addressLine1',
        type: 'string',
        default: '',
        description: 'Street address',
      },
      {
        displayName: 'Address Line 2',
        name: 'addressLine2',
        type: 'string',
        default: '',
        description: 'Apartment, suite, etc.',
      },
      {
        displayName: 'City',
        name: 'city',
        type: 'string',
        default: '',
        description: 'City',
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'string',
        default: '',
        description: 'State (2-letter code)',
      },
      {
        displayName: 'Postal Code',
        name: 'postalCode',
        type: 'string',
        default: '',
        description: 'ZIP code',
      },
      {
        displayName: 'Country',
        name: 'country',
        type: 'string',
        default: 'US',
        description: 'Country (ISO 3166-1 alpha-2)',
      },
    ],
  },

  // Business applicant fields
  {
    displayName: 'Business Details',
    name: 'businessDetails',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['accountApplication'],
        operation: ['create'],
        applicantType: ['business'],
      },
    },
    options: [
      {
        displayName: 'Legal Name',
        name: 'legalName',
        type: 'string',
        default: '',
        required: true,
        description: 'Legal business name',
      },
      {
        displayName: 'DBA Name',
        name: 'dbaName',
        type: 'string',
        default: '',
        description: 'Doing Business As name',
      },
      {
        displayName: 'EIN',
        name: 'ein',
        type: 'string',
        default: '',
        description: 'Employer Identification Number',
      },
      {
        displayName: 'Business Type',
        name: 'businessType',
        type: 'options',
        options: [
          { name: 'Sole Proprietorship', value: 'sole_proprietorship' },
          { name: 'Partnership', value: 'partnership' },
          { name: 'LLC', value: 'llc' },
          { name: 'Corporation', value: 'corporation' },
          { name: 'Non-Profit', value: 'non_profit' },
        ],
        default: 'llc',
        description: 'Type of business entity',
      },
      {
        displayName: 'State of Incorporation',
        name: 'stateOfIncorporation',
        type: 'string',
        default: '',
        description: 'State where business was incorporated',
      },
      {
        displayName: 'Date of Incorporation',
        name: 'dateOfIncorporation',
        type: 'string',
        default: '',
        description: 'Date of incorporation (YYYY-MM-DD)',
      },
      {
        displayName: 'Website',
        name: 'website',
        type: 'string',
        default: '',
        description: 'Business website URL',
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'Business phone number',
      },
      {
        displayName: 'Address Line 1',
        name: 'addressLine1',
        type: 'string',
        default: '',
        description: 'Business street address',
      },
      {
        displayName: 'City',
        name: 'city',
        type: 'string',
        default: '',
        description: 'City',
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'string',
        default: '',
        description: 'State (2-letter code)',
      },
      {
        displayName: 'Postal Code',
        name: 'postalCode',
        type: 'string',
        default: '',
        description: 'ZIP code',
      },
    ],
  },

  // Update fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['accountApplication'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'json',
        default: '{}',
        description: 'Application metadata',
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
        resource: ['accountApplication'],
        operation: ['list'],
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
        resource: ['accountApplication'],
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
        resource: ['accountApplication'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [...APPLICATION_STATUS_OPTIONS],
        default: '',
        description: 'Filter by application status',
      },
    ],
  },

  // Upload document fields
  {
    displayName: 'Document Type',
    name: 'documentType',
    type: 'options',
    required: true,
    options: [
      { name: "Driver's License", value: 'drivers_license' },
      { name: 'Passport', value: 'passport' },
      { name: 'State ID', value: 'state_id' },
      { name: 'Utility Bill', value: 'utility_bill' },
      { name: 'Bank Statement', value: 'bank_statement' },
      { name: 'Articles of Incorporation', value: 'articles_of_incorporation' },
      { name: 'EIN Letter', value: 'ein_letter' },
      { name: 'Other', value: 'other' },
    ],
    default: 'drivers_license',
    description: 'Type of document being uploaded',
    displayOptions: {
      show: {
        resource: ['accountApplication'],
        operation: ['uploadDocument'],
      },
    },
  },
  {
    displayName: 'Binary Property',
    name: 'binaryPropertyName',
    type: 'string',
    required: true,
    default: 'data',
    description: 'Name of the binary property containing the file',
    displayOptions: {
      show: {
        resource: ['accountApplication'],
        operation: ['uploadDocument'],
      },
    },
  },
];

/**
 * Execute Account Application Operations
 */
export async function executeAccountApplicationOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'create': {
      const accountType = this.getNodeParameter('accountType', index) as string;
      const applicantType = this.getNodeParameter('applicantType', index) as string;

      const body: IDataObject = {
        account_type: accountType,
      };

      if (applicantType === 'person') {
        const personDetails = this.getNodeParameter('personDetails', index) as IDataObject;
        body.person = {
          first_name: personDetails.firstName,
          last_name: personDetails.lastName,
          email: personDetails.email,
          phone: personDetails.phone,
          date_of_birth: personDetails.dateOfBirth,
          ssn: personDetails.ssn,
          address: {
            line1: personDetails.addressLine1,
            line2: personDetails.addressLine2,
            city: personDetails.city,
            state: personDetails.state,
            postal_code: personDetails.postalCode,
            country: personDetails.country || 'US',
          },
        };
      } else {
        const businessDetails = this.getNodeParameter('businessDetails', index) as IDataObject;
        body.business = {
          legal_name: businessDetails.legalName,
          dba_name: businessDetails.dbaName,
          ein: businessDetails.ein,
          business_type: businessDetails.businessType,
          state_of_incorporation: businessDetails.stateOfIncorporation,
          date_of_incorporation: businessDetails.dateOfIncorporation,
          website: businessDetails.website,
          phone: businessDetails.phone,
          address: {
            line1: businessDetails.addressLine1,
            city: businessDetails.city,
            state: businessDetails.state,
            postal_code: businessDetails.postalCode,
          },
        };
      }

      responseData = await treasuryPrimeApiRequest.call(
        this,
        'POST',
        API_PATHS.ACCOUNT_APPLICATIONS,
        body,
      );
      break;
    }

    case 'get': {
      const applicationId = this.getNodeParameter('applicationId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(
        this,
        'GET',
        `${API_PATHS.ACCOUNT_APPLICATIONS}/${applicationId}`,
      );
      break;
    }

    case 'update': {
      const applicationId = this.getNodeParameter('applicationId', index) as string;
      const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

      const body: IDataObject = {};
      if (updateFields.metadata) {
        body.metadata =
          typeof updateFields.metadata === 'string'
            ? JSON.parse(updateFields.metadata)
            : updateFields.metadata;
      }

      responseData = await treasuryPrimeApiRequest.call(
        this,
        'PATCH',
        `${API_PATHS.ACCOUNT_APPLICATIONS}/${applicationId}`,
        body,
      );
      break;
    }

    case 'list': {
      const returnAll = this.getNodeParameter('returnAll', index) as boolean;
      const filters = this.getNodeParameter('filters', index) as IDataObject;

      const query: IDataObject = {};
      if (filters.status) {
        query.status = filters.status;
      }

      if (returnAll) {
        responseData = await treasuryPrimeApiRequestAllItems.call(
          this,
          'GET',
          API_PATHS.ACCOUNT_APPLICATIONS,
          {},
          query,
        );
      } else {
        const limit = this.getNodeParameter('limit', index) as number;
        query.page_size = limit;
        const response = await treasuryPrimeApiRequest.call(
          this,
          'GET',
          API_PATHS.ACCOUNT_APPLICATIONS,
          {},
          query,
        );
        responseData = (response.data as IDataObject[]) || response;
      }
      break;
    }

    case 'submit': {
      const applicationId = this.getNodeParameter('applicationId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(
        this,
        'POST',
        `${API_PATHS.ACCOUNT_APPLICATIONS}/${applicationId}/submit`,
        {},
      );
      break;
    }

    case 'getStatus': {
      const applicationId = this.getNodeParameter('applicationId', index) as string;
      const response = await treasuryPrimeApiRequest.call(
        this,
        'GET',
        `${API_PATHS.ACCOUNT_APPLICATIONS}/${applicationId}`,
      );
      responseData = {
        id: (response as IDataObject).id,
        status: (response as IDataObject).status,
        status_details: (response as IDataObject).status_details,
      };
      break;
    }

    case 'getRequirements': {
      const applicationId = this.getNodeParameter('applicationId', index) as string;
      responseData = await treasuryPrimeApiRequest.call(
        this,
        'GET',
        `${API_PATHS.ACCOUNT_APPLICATIONS}/${applicationId}/requirements`,
      );
      break;
    }

    case 'uploadDocument': {
      const applicationId = this.getNodeParameter('applicationId', index) as string;
      const documentType = this.getNodeParameter('documentType', index) as string;
      const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;

      const binaryData = this.helpers.assertBinaryData(index, binaryPropertyName);
      const buffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);

      const formData = {
        file: {
          value: buffer,
          options: {
            filename: binaryData.fileName || 'document',
            contentType: binaryData.mimeType,
          },
        },
        document_type: documentType,
        account_application_id: applicationId,
      };

      responseData = await treasuryPrimeApiRequest.call(
        this,
        'POST',
        API_PATHS.DOCUMENTS,
        formData as unknown as IDataObject,
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
export const execute = executeAccountApplicationOperation;
