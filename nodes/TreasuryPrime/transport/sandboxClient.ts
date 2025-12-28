/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { TreasuryPrimeClient } from './treasuryPrimeClient';
import { API_PATHS } from '../constants/endpoints';

/**
 * Sandbox Simulation Types
 */
export type SimulationType =
  | 'ach_return'
  | 'ach_noc'
  | 'wire_return'
  | 'check_return'
  | 'card_transaction'
  | 'advance_time';

/**
 * ACH Return Simulation Options
 */
export interface IAchReturnSimulation {
  achId: string;
  returnCode: string;
  returnDate?: string;
}

/**
 * ACH NOC Simulation Options
 */
export interface IAchNocSimulation {
  achId: string;
  nocCode: string;
  correctedData: IDataObject;
}

/**
 * Wire Return Simulation Options
 */
export interface IWireReturnSimulation {
  wireId: string;
  returnReason: string;
  returnDate?: string;
}

/**
 * Check Return Simulation Options
 */
export interface ICheckReturnSimulation {
  checkId: string;
  returnReason: string;
  returnDate?: string;
}

/**
 * Card Transaction Simulation Options
 */
export interface ICardTransactionSimulation {
  cardId: string;
  amount: number;
  merchantName: string;
  merchantCategory?: string;
  transactionType: 'authorization' | 'settlement' | 'reversal' | 'refund';
}

/**
 * Time Advance Simulation Options
 */
export interface ITimeAdvanceSimulation {
  days: number;
}

/**
 * Sandbox Client for Treasury Prime
 *
 * Provides simulation capabilities for testing in sandbox environment.
 */
export class SandboxClient {
  private client: TreasuryPrimeClient;

  constructor(client: TreasuryPrimeClient, _context: IExecuteFunctions) {
    this.client = client;
  }

  /**
   * Simulate an ACH return
   */
  async simulateAchReturn(options: IAchReturnSimulation): Promise<IDataObject> {
    const body: IDataObject = {
      ach_id: options.achId,
      return_code: options.returnCode,
    };

    if (options.returnDate) {
      body.return_date = options.returnDate;
    }

    return this.client.post(`${API_PATHS.SANDBOX}/ach/return`, body);
  }

  /**
   * Simulate an ACH Notification of Change (NOC)
   */
  async simulateAchNoc(options: IAchNocSimulation): Promise<IDataObject> {
    return this.client.post(`${API_PATHS.SANDBOX}/ach/noc`, {
      ach_id: options.achId,
      noc_code: options.nocCode,
      corrected_data: options.correctedData,
    });
  }

  /**
   * Simulate a wire return
   */
  async simulateWireReturn(options: IWireReturnSimulation): Promise<IDataObject> {
    const body: IDataObject = {
      wire_id: options.wireId,
      return_reason: options.returnReason,
    };

    if (options.returnDate) {
      body.return_date = options.returnDate;
    }

    return this.client.post(`${API_PATHS.SANDBOX}/wire/return`, body);
  }

  /**
   * Simulate a check return
   */
  async simulateCheckReturn(options: ICheckReturnSimulation): Promise<IDataObject> {
    const body: IDataObject = {
      check_id: options.checkId,
      return_reason: options.returnReason,
    };

    if (options.returnDate) {
      body.return_date = options.returnDate;
    }

    return this.client.post(`${API_PATHS.SANDBOX}/check/return`, body);
  }

  /**
   * Simulate a card transaction
   */
  async simulateCardTransaction(
    options: ICardTransactionSimulation,
  ): Promise<IDataObject> {
    return this.client.post(`${API_PATHS.SANDBOX}/card/transaction`, {
      card_id: options.cardId,
      amount: options.amount,
      merchant_name: options.merchantName,
      merchant_category: options.merchantCategory,
      transaction_type: options.transactionType,
    });
  }

  /**
   * Advance sandbox time
   */
  async advanceTime(options: ITimeAdvanceSimulation): Promise<IDataObject> {
    return this.client.post(`${API_PATHS.SANDBOX}/time/advance`, {
      days: options.days,
    });
  }

  /**
   * Reset sandbox to initial state
   */
  async resetSandbox(): Promise<IDataObject> {
    return this.client.post(`${API_PATHS.SANDBOX}/reset`, {});
  }

  /**
   * Get current sandbox time
   */
  async getSandboxTime(): Promise<IDataObject> {
    return this.client.get(`${API_PATHS.SANDBOX}/time`);
  }

  /**
   * Trigger a webhook event manually (for testing)
   */
  async triggerWebhookEvent(
    eventType: string,
    eventData: IDataObject,
  ): Promise<IDataObject> {
    return this.client.post(`${API_PATHS.SANDBOX}/webhook/trigger`, {
      event_type: eventType,
      data: eventData,
    });
  }

  /**
   * Simulate account balance update
   */
  async simulateBalanceUpdate(
    accountId: string,
    newBalance: number,
  ): Promise<IDataObject> {
    return this.client.post(`${API_PATHS.SANDBOX}/account/balance`, {
      account_id: accountId,
      balance: newBalance,
    });
  }

  /**
   * Simulate KYC/KYB approval
   */
  async simulateVerificationApproval(
    entityType: 'person' | 'business',
    entityId: string,
  ): Promise<IDataObject> {
    return this.client.post(`${API_PATHS.SANDBOX}/verification/approve`, {
      entity_type: entityType,
      entity_id: entityId,
    });
  }

  /**
   * Simulate KYC/KYB denial
   */
  async simulateVerificationDenial(
    entityType: 'person' | 'business',
    entityId: string,
    reason: string,
  ): Promise<IDataObject> {
    return this.client.post(`${API_PATHS.SANDBOX}/verification/deny`, {
      entity_type: entityType,
      entity_id: entityId,
      reason,
    });
  }

  /**
   * Create test data (accounts, persons, etc.)
   */
  async createTestData(dataType: string, count = 1): Promise<IDataObject> {
    return this.client.post(`${API_PATHS.SANDBOX}/test-data`, {
      type: dataType,
      count,
    });
  }
}

/**
 * Create a sandbox client instance
 */
export function createSandboxClient(
  client: TreasuryPrimeClient,
  context: IExecuteFunctions,
): SandboxClient {
  return new SandboxClient(client, context);
}
