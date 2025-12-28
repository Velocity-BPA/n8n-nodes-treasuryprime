# n8n-nodes-treasuryprime

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Treasury Prime Banking-as-a-Service (BaaS) platform, providing 25 resources and 200+ operations for complete banking automation including accounts, ACH/wire transfers, card issuing, KYC/KYB compliance, and real-time webhooks.

![n8n version](https://img.shields.io/badge/n8n-%3E%3D1.0.0-blue)
![Node version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Treasury Prime API](https://img.shields.io/badge/Treasury%20Prime-API%20v1-orange)

## Features

- **25 Resource Categories**: Complete coverage of Treasury Prime BaaS platform
- **200+ Operations**: Comprehensive banking operations from account creation to compliance
- **Real-time Webhooks**: 60+ event types with signature verification
- **Multi-environment Support**: Production, sandbox, and custom endpoints
- **Compliance Ready**: Built-in KYC/KYB/AML support with SAR/CTR filing
- **Card Issuing**: Full card lifecycle management with PIN operations
- **ACH & Wire Transfers**: Same-day ACH, international wires, and book transfers
- **Sandbox Testing**: Simulate returns, NOCs, and advance time for testing

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-treasuryprime`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the node
npm install n8n-nodes-treasuryprime
```

### Development Installation

```bash
# Clone or extract the package
cd n8n-nodes-treasuryprime

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-treasuryprime

# Restart n8n
n8n start
```

## Credentials Setup

### Treasury Prime API Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Environment | Production, Sandbox, or Custom | Yes |
| API Key ID | Your Treasury Prime API key ID | Yes |
| API Secret Key | Your Treasury Prime API secret | Yes |
| Bank ID | Your assigned bank partner ID | Yes |
| Webhook Secret | Secret for verifying webhook signatures | No |
| Custom Endpoint | Custom API URL (for Custom environment) | Conditional |

### Treasury Prime OAuth Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Client ID | OAuth application client ID | Yes |
| Client Secret | OAuth application client secret | Yes |
| Authorization URL | OAuth authorization endpoint | Yes |
| Token URL | OAuth token endpoint | Yes |

## Resources & Operations

### Account Resource
Manage bank accounts (checking, savings, money market).

| Operation | Description |
|-----------|-------------|
| Create | Create a new bank account |
| Get | Retrieve account details |
| Update | Update account information |
| List | List all accounts with filters |
| Close | Close an account |
| Get Balance | Get current balance |
| Get All Balances | Get all balance types |
| Get Pending Balance | Get pending balance |
| Get Available Balance | Get available balance |
| Get Account Numbers | Get routing/account numbers |
| Get Statement | Retrieve account statement |
| Get Transactions | List account transactions |
| Update Status | Change account status |

### Account Application Resource
Handle account onboarding applications.

| Operation | Description |
|-----------|-------------|
| Create | Start new application |
| Get | Retrieve application |
| Update | Update application data |
| List | List all applications |
| Submit | Submit for review |
| Get Status | Check application status |
| Upload Document | Attach required document |
| Get Requirements | List required documents |

### Person Resource
Manage individual account holders.

| Operation | Description |
|-----------|-------------|
| Create | Create person record |
| Get | Retrieve person details |
| Update | Update person information |
| List | List all persons |
| Get Accounts | List person's accounts |
| Get Documents | List person's documents |
| Archive | Archive person record |

### Business Resource
Manage business/company account holders.

| Operation | Description |
|-----------|-------------|
| Create | Create business record |
| Get | Retrieve business details |
| Update | Update business information |
| List | List all businesses |
| Get Accounts | List business accounts |
| Get Documents | List business documents |
| Add Officer | Add business officer |
| Remove Officer | Remove business officer |
| Get Officers | List business officers |
| Archive | Archive business record |

### Document Resource
Manage identity and verification documents.

| Operation | Description |
|-----------|-------------|
| Upload | Upload new document |
| Get | Retrieve document |
| List | List all documents |
| Get by Account | Documents for account |
| Get by Person | Documents for person |
| Get Status | Check processing status |
| Delete | Remove document |

### ACH Resource
Automated Clearing House transfers.

| Operation | Description |
|-----------|-------------|
| Create | Initiate ACH transfer |
| Get | Retrieve transfer details |
| List | List all transfers |
| Cancel | Cancel pending transfer |
| Get Status | Check transfer status |
| Get Return | Get return details |
| Get Return Codes | List ACH return codes |
| Create Same Day | Same-day ACH transfer |
| Get Limits | Get ACH limits |
| Create Reversal | Reverse a transfer |

### Wire Resource
Domestic and international wire transfers.

| Operation | Description |
|-----------|-------------|
| Create Domestic | Send domestic wire |
| Create International | Send international wire |
| Get | Retrieve wire details |
| List | List all wires |
| Cancel | Cancel pending wire |
| Get Status | Check wire status |
| Get Fees | Get wire fee schedule |
| Get Limits | Get wire limits |

### Book Transfer Resource
Internal transfers between accounts.

| Operation | Description |
|-----------|-------------|
| Create | Create internal transfer |
| Get | Retrieve transfer details |
| List | List all book transfers |
| Get Status | Check transfer status |

### Check Resource
Check operations and deposits.

| Operation | Description |
|-----------|-------------|
| Create | Issue a check |
| Get | Retrieve check details |
| List | List all checks |
| Cancel | Cancel pending check |
| Stop Payment | Stop check payment |
| Get Status | Check status |
| Get Image | Get check image |
| Create Deposit | Deposit a check |
| Get Deposit | Retrieve deposit details |
| Get Deposit Image | Get deposit images |

### Card Resource
Debit/credit card issuing and management.

| Operation | Description |
|-----------|-------------|
| Create | Issue new card |
| Get | Retrieve card details |
| List | List all cards |
| Activate | Activate card |
| Lock | Temporarily lock card |
| Unlock | Unlock locked card |
| Replace | Order replacement card |
| Close | Close/cancel card |
| Get PIN | Retrieve card PIN |
| Set PIN | Set new PIN |
| Update Limits | Change spending limits |
| Get Transactions | Card transaction history |

### Counterparty Resource
External transfer recipients.

| Operation | Description |
|-----------|-------------|
| Create | Add new counterparty |
| Get | Retrieve counterparty |
| Update | Update counterparty |
| List | List all counterparties |
| Delete | Remove counterparty |
| Verify | Verify account ownership |
| Get by Account Number | Find by account number |

### Transaction Resource
Transaction history and search.

| Operation | Description |
|-----------|-------------|
| Get | Retrieve transaction |
| List | List all transactions |
| Get by Account | Account transactions |
| Get by Date Range | Filter by dates |
| Search | Search transactions |
| Get Pending | Pending transactions |
| Get Posted | Posted transactions |
| Export | Export transaction data |
| Categorize | Categorize transaction |

### Payment Resource
Payment scheduling and management.

| Operation | Description |
|-----------|-------------|
| Create | Create payment |
| Get | Retrieve payment |
| List | List all payments |
| Cancel | Cancel payment |
| Get Status | Check payment status |
| Schedule | Schedule future payment |
| Get Recurring | List recurring payments |
| Create Recurring | Set up recurring payment |
| Cancel Recurring | Cancel recurring payment |

### Bill Pay Resource
Bill payment operations.

| Operation | Description |
|-----------|-------------|
| Create | Create bill payment |
| Get | Retrieve payment details |
| List | List bill payments |
| Cancel | Cancel bill payment |
| Get Billers | List saved billers |
| Search Billers | Search biller directory |
| Add Biller | Add new biller |
| Remove Biller | Remove saved biller |

### Statement Resource
Account statements.

| Operation | Description |
|-----------|-------------|
| Get | Retrieve statement |
| List | List all statements |
| Get PDF | Download statement PDF |
| Get by Account | Statements for account |
| Get Transactions | Statement transactions |

### Interest Resource
Interest rate and earnings management.

| Operation | Description |
|-----------|-------------|
| Get Rate | Current interest rate |
| Get Earned | Interest earned |
| Get Paid | Interest paid |
| Get Settings | Interest settings |
| Update Settings | Update interest settings |

### Fee Resource
Fee schedule and management.

| Operation | Description |
|-----------|-------------|
| Get Schedule | Fee schedule |
| Create | Create fee charge |
| Get | Retrieve fee details |
| List | List all fees |
| Waive | Waive a fee |
| Get by Account | Account fees |
| Get Types | Available fee types |

### Hold Resource
Balance hold management.

| Operation | Description |
|-----------|-------------|
| Create | Place balance hold |
| Get | Retrieve hold details |
| List | List all holds |
| Release | Release hold |
| Get by Account | Account holds |
| Update Amount | Modify hold amount |

### Alert Resource
Account alerts and notifications.

| Operation | Description |
|-----------|-------------|
| Create | Create alert |
| Get | Retrieve alert |
| List | List all alerts |
| Update | Update alert settings |
| Delete | Remove alert |
| Get by Account | Account alerts |
| Get Types | Available alert types |

### Webhook Resource
Webhook management.

| Operation | Description |
|-----------|-------------|
| Create | Register webhook |
| Get | Retrieve webhook |
| Update | Update webhook URL |
| Delete | Remove webhook |
| List | List all webhooks |
| Test | Send test event |
| Get Events | List event types |
| Get Deliveries | Delivery history |
| Retry | Retry failed delivery |
| Verify Signature | Verify webhook signature |

### Compliance Resource
KYC/KYB/AML compliance operations.

| Operation | Description |
|-----------|-------------|
| Get Status | Compliance status |
| Submit Data | Submit compliance data |
| Get Requirements | Required compliance items |
| Get SAR Status | SAR filing status |
| Get CTR Status | CTR filing status |
| Get OFAC Check | OFAC screening result |
| Get Report | Compliance report |

### Bank Resource
Bank partner information.

| Operation | Description |
|-----------|-------------|
| Get Info | Bank information |
| Get Routing Number | Bank routing number |
| Get Products | Available products |
| Get Limits | Transaction limits |
| Get Hours | Business hours |
| Get Features | Supported features |

### Reporting Resource
Generate and download reports.

| Operation | Description |
|-----------|-------------|
| Generate | Generate new report |
| Get | Retrieve report |
| List | List all reports |
| Download | Download report file |
| Schedule | Schedule recurring report |
| Get Types | Available report types |
| Get Custom | Custom report query |

### Sandbox Resource
Testing and simulation tools.

| Operation | Description |
|-----------|-------------|
| Simulate ACH Return | Simulate ACH return |
| Simulate ACH NOC | Simulate NOC |
| Simulate Wire Return | Simulate wire return |
| Simulate Check Return | Simulate check return |
| Simulate Card Transaction | Simulate card txn |
| Advance Time | Advance sandbox date |
| Reset Sandbox | Reset to initial state |

### Utility Resource
Utility operations.

| Operation | Description |
|-----------|-------------|
| Validate Routing Number | Validate ABA routing |
| Validate Account Number | Validate account number |
| Get API Status | API health status |
| Get Rate Limits | Current rate limits |
| Test Connection | Test API connection |

## Trigger Node

The **Treasury Prime Trigger** node provides real-time event notifications.

### Supported Events

**Account Events**: account.created, account.updated, account.closed, account.balance_changed, account.status_changed

**Application Events**: application.created, application.submitted, application.approved, application.denied, application.document_required

**Person/Business Events**: person.created, person.updated, business.created, business.updated, kyc.status_changed

**ACH Events**: ach.initiated, ach.pending, ach.completed, ach.returned, ach.canceled, ach.noc_received

**Wire Events**: wire.initiated, wire.pending, wire.completed, wire.returned, wire.canceled

**Book Transfer Events**: book_transfer.created, book_transfer.completed

**Check Events**: check.created, check.mailed, check.cashed, check.voided, check_deposit.received, check_deposit.cleared, check_deposit.returned

**Card Events**: card.created, card.activated, card.locked, card.unlocked, card.replaced, card.transaction

**Transaction Events**: transaction.created, transaction.posted, transaction.pending, transaction.returned

**Compliance Events**: compliance.alert, compliance.document_required, compliance.review_required

## Usage Examples

### Create an Account

```javascript
// Create a new checking account for a person
{
  "resource": "account",
  "operation": "create",
  "accountType": "checking",
  "personId": "psn_abc123",
  "name": "Primary Checking",
  "currency": "USD"
}
```

### Initiate ACH Transfer

```javascript
// Send an ACH credit transfer
{
  "resource": "ach",
  "operation": "create",
  "accountId": "acct_abc123",
  "counterpartyId": "cpty_xyz789",
  "amount": 15000,  // $150.00 in cents
  "direction": "credit",
  "secCode": "PPD",
  "description": "Payroll deposit"
}
```

### Send Domestic Wire

```javascript
// Send a same-day wire transfer
{
  "resource": "wire",
  "operation": "createDomestic",
  "accountId": "acct_abc123",
  "amount": 5000000,  // $50,000.00 in cents
  "beneficiaryName": "Acme Corporation",
  "beneficiaryAccountNumber": "123456789",
  "beneficiaryRoutingNumber": "021000021",
  "beneficiaryAddress": "123 Main St, New York, NY 10001",
  "memo": "Invoice #12345 payment"
}
```

### Issue a Debit Card

```javascript
// Create and ship a new debit card
{
  "resource": "card",
  "operation": "create",
  "accountId": "acct_abc123",
  "personId": "psn_abc123",
  "cardType": "debit",
  "shippingMethod": "standard",
  "dailyLimit": 100000,  // $1,000.00 daily limit
  "monthlyLimit": 500000  // $5,000.00 monthly limit
}
```

### Submit KYC Data

```javascript
// Submit identity verification data
{
  "resource": "compliance",
  "operation": "submitData",
  "entityType": "person",
  "entityId": "psn_abc123",
  "dataType": "kyc",
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1985-06-15",
    "ssn": "123-45-6789",
    "address": {
      "line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001"
    }
  }
}
```

### Sandbox: Simulate ACH Return

```javascript
// Test ACH return handling in sandbox
{
  "resource": "sandbox",
  "operation": "simulateAchReturn",
  "achId": "ach_abc123",
  "returnCode": "R01",  // Insufficient Funds
  "returnReason": "Account has insufficient funds"
}
```

### Webhook Integration

```javascript
// Register webhook for account events
{
  "resource": "webhook",
  "operation": "create",
  "url": "https://your-server.com/webhooks/treasury-prime",
  "events": [
    "account.created",
    "account.updated",
    "ach.completed",
    "ach.returned"
  ],
  "active": true
}
```

## Banking Concepts

### KYC/KYB (Know Your Customer/Business)
Identity verification requirements for individuals and businesses. Treasury Prime supports CIP (Customer Identification Program), CDD (Customer Due Diligence), and beneficial ownership verification.

### ACH SEC Codes
Standard Entry Class codes define the type of ACH transaction:
- **PPD**: Prearranged Payment and Deposit (consumer)
- **CCD**: Corporate Credit or Debit (business)
- **WEB**: Internet-initiated entries
- **TEL**: Telephone-initiated entries

### ACH Return Codes
Common return codes:
- **R01**: Insufficient Funds
- **R02**: Account Closed
- **R03**: No Account/Unable to Locate
- **R04**: Invalid Account Number
- **R08**: Payment Stopped
- **R10**: Customer Advises Unauthorized

### ACH NOC Codes (Notification of Change)
Change notification codes:
- **C01**: Incorrect account number
- **C02**: Incorrect routing number
- **C03**: Incorrect routing and account number
- **C05**: Incorrect transaction code

### Compliance Requirements
- **SAR**: Suspicious Activity Report (suspicious transactions)
- **CTR**: Currency Transaction Report (transactions >$10,000)
- **OFAC**: Office of Foreign Assets Control (sanctions screening)
- **BSA**: Bank Secrecy Act (anti-money laundering)

## Error Handling

The node provides detailed error messages for common issues:

| Error Code | Description | Resolution |
|------------|-------------|------------|
| 400 | Invalid request parameters | Check field values and formats |
| 401 | Authentication failed | Verify API credentials |
| 403 | Insufficient permissions | Check API key permissions |
| 404 | Resource not found | Verify resource ID exists |
| 409 | Conflict (duplicate) | Use idempotency key |
| 422 | Validation failed | Check required fields |
| 429 | Rate limit exceeded | Reduce request frequency |
| 500 | Server error | Retry with exponential backoff |

## Security Best Practices

1. **Credential Storage**: Store API credentials in n8n credentials, never in workflow nodes
2. **Webhook Verification**: Always verify webhook signatures in production
3. **Idempotency Keys**: Use idempotency keys for all financial operations
4. **Audit Logging**: Enable logging for compliance and debugging
5. **Environment Separation**: Use sandbox for testing, production for live operations
6. **Rate Limiting**: Implement appropriate delays between bulk operations
7. **PII Handling**: Never log sensitive customer data (SSN, account numbers)

## Development

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the project
npm run build

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code:
- Passes all linting checks
- Includes appropriate tests
- Follows existing code style
- Updates documentation as needed

## Support

- **Documentation**: [Treasury Prime API Docs](https://docs.treasuryprime.com)
- **Issues**: GitHub Issues
- **Commercial Support**: licensing@velobpa.com

## Acknowledgments

- [Treasury Prime](https://treasuryprime.com) for their comprehensive BaaS platform
- [n8n](https://n8n.io) for the workflow automation platform
- The open-source community for inspiration and best practices
