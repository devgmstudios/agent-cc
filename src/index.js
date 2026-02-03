#!/usr/bin/env node

/**
 * Agent Credit Cards (agent-cc) CLI
 *
 * Commands:
 *   agent-cc list                                    - List all cards
 *   agent-cc get <token>                             - Get full card details
 *   agent-cc create <memo> <type> <limit>            - Create a new card
 *   agent-cc transactions                            - List transactions
 *   agent-cc onboard                                 - Configure API key
 */

import https from 'https';
import { URL } from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://api.botwallet.ai';
const CONFIG_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.agent-cc-config.json');

// Load API key from config or environment
function getApiKey() {
  // First check environment variable
  if (process.env.BOTWALLET_API_KEY) {
    return process.env.BOTWALLET_API_KEY;
  }

  // Then check config file
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      return config.apiKey;
    } catch (e) {
      // Ignore parse errors
    }
  }

  return null;
}

// Save API key to config
function saveApiKey(apiKey) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ apiKey }, null, 2));
}

/**
 * Make an HTTP request to the BotWallet API
 */
function apiRequest(method, endpoint, body = null) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return Promise.reject(new Error('Not configured. Run: agent-cc onboard'));
  }

  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Api-Key ${apiKey}`,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error || `HTTP ${res.statusCode}`));
          }
        } catch (e) {
          reject(new Error(`Invalid JSON response: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Commands

async function listCards() {
  const result = await apiRequest('GET', '/v1/cards');

  if (result.data.length === 0) {
    console.log('No cards found. Create one with: agent-cc create <memo> <type> <limit>');
    return;
  }

  console.log(`\n  Found ${result.total_entries} card(s):\n`);

  for (const card of result.data) {
    console.log(`  Token:       ${card.token}`);
    console.log(`  Last Four:   ****${card.last_four}`);
    console.log(`  Type:        ${card.type}`);
    console.log(`  State:       ${card.state}`);
    console.log(`  Limit:       ${card.spend_limit === 0 ? 'Unlimited' : '$' + card.spend_limit}`);
    console.log(`  Memo:        ${card.memo || '(none)'}`);
    console.log(`  Created:     ${card.created}`);
    console.log('  ---');
  }
}

async function getCard(token) {
  if (!token) {
    console.error('Usage: agent-cc get <card_token>');
    process.exit(1);
  }

  const card = await apiRequest('GET', `/v1/cards/${token}`);

  console.log('\n  Card Details:\n');
  console.log(`  Card Number: ${card.pan}`);
  console.log(`  CVV:         ${card.cvv}`);
  console.log(`  Expires:     ${card.exp_month}/${card.exp_year}`);
  console.log(`  Type:        ${card.type}`);
  console.log(`  State:       ${card.state}`);
  console.log(`  Limit:       ${card.spend_limit === 0 ? 'Unlimited' : '$' + card.spend_limit}`);
  console.log(`  Memo:        ${card.memo || '(none)'}`);
  console.log(`  Token:       ${card.token}`);
  console.log('');
}

async function createCard(memo, type, limit) {
  // Defaults
  memo = memo || 'Agent Card';
  type = (type || 'SINGLE_USE').toUpperCase();
  limit = parseInt(limit) || 0;

  if (!['SINGLE_USE', 'UNLOCKED'].includes(type)) {
    console.error('Error: Type must be SINGLE_USE or UNLOCKED');
    process.exit(1);
  }

  const card = await apiRequest('POST', '/v1/cards', {
    memo,
    type,
    spend_limit: limit
  });

  console.log('\n  Card Created Successfully!\n');
  console.log(`  Card Number: ${card.pan}`);
  console.log(`  CVV:         ${card.cvv}`);
  console.log(`  Expires:     ${card.exp_month}/${card.exp_year}`);
  console.log(`  Type:        ${card.type}`);
  console.log(`  Limit:       ${card.spend_limit === 0 ? 'Unlimited' : '$' + card.spend_limit}`);
  console.log(`  Memo:        ${card.memo}`);
  console.log(`  Token:       ${card.token}`);
  console.log('');
}

async function listTransactions() {
  const result = await apiRequest('GET', '/v1/transactions');

  if (result.data.length === 0) {
    console.log('\n  No transactions found.\n');
    return;
  }

  console.log(`\n  Found ${result.total_entries} transaction(s):\n`);

  for (const tx of result.data) {
    console.log(`  ${JSON.stringify(tx, null, 2)}`);
    console.log('  ---');
  }
}

async function onboard() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n  Agent Credit Cards Setup\n');
  console.log('  Get your API key from https://botwallet.ai\n');

  rl.question('  Enter your BotWallet API Key: ', async (apiKey) => {
    rl.close();

    if (!apiKey || apiKey.trim().length === 0) {
      console.error('\n  Error: API key is required\n');
      process.exit(1);
    }

    // Test the API key
    const testApiKey = apiKey.trim();

    try {
      // Temporarily set for testing
      process.env.BOTWALLET_API_KEY = testApiKey;
      await apiRequest('GET', '/v1/cards');

      // Save if successful
      saveApiKey(testApiKey);
      console.log('\n  Success! API key saved.\n');
      console.log('  Try: agent-cc list\n');
    } catch (error) {
      console.error(`\n  Error: Invalid API key - ${error.message}\n`);
      process.exit(1);
    }
  });
}

function showHelp() {
  console.log(`
  Agent Credit Cards (agent-cc) v1.0.0

  Give your agents single and multiuse credit cards
  so they can securely make purchases with fixed balances.

  COMMANDS:

    agent-cc onboard                         Configure your BotWallet API key
    agent-cc list                            List all cards
    agent-cc get <token>                     Get full card details (number, CVV, expiry)
    agent-cc create <memo> <type> <limit>    Create a new card
    agent-cc transactions                    List transaction history

  CARD TYPES:

    SINGLE_USE    Card closes after one transaction (recommended)
    UNLOCKED      Card stays open for multiple transactions

  EXAMPLES:

    agent-cc create "Netflix" SINGLE_USE 20      Create a $20 single-use card
    agent-cc create "Shopping" UNLOCKED 100      Create a $100 multi-use card
    agent-cc get abc123-def456                   Get full details for a card

  SETUP:

    1. Get your API key from https://botwallet.ai
    2. Run: agent-cc onboard
    3. Enter your API key when prompted

  `);
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  try {
    switch (command) {
      case 'onboard':
        await onboard();
        break;

      case 'list':
        await listCards();
        break;

      case 'get':
        await getCard(args[1]);
        break;

      case 'create':
        await createCard(args[1], args[2], args[3]);
        break;

      case 'transactions':
        await listTransactions();
        break;

      default:
        console.error(`Unknown command: ${command}`);
        console.log('Run "agent-cc help" for usage.');
        process.exit(1);
    }
  } catch (error) {
    console.error(`\n  Error: ${error.message}\n`);
    process.exit(1);
  }
}

main();
