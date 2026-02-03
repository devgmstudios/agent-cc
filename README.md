# Agent Credit Cards (agent-cc)

Give your AI agents single and multiuse credit cards so they can securely make purchases with fixed balances.

Powered by [BotWallet.ai](https://botwallet.ai)

## Installation

### Via OpenClaw
```
/install https://github.com/devgmstudios/agent-cc
```

### Manual Installation
```bash
git clone https://github.com/devgmstudios/agent-cc
cd agent-cc
npm install -g .
```

Or with the install script:
```bash
./install.sh
```

## Setup

1. Get your API key from [BotWallet.ai](https://botwallet.ai)
2. Run the onboarding:
   ```bash
   agent-cc onboard
   ```
3. Enter your API key when prompted

## Commands

| Command | Description |
|---------|-------------|
| `agent-cc onboard` | Configure your BotWallet API key |
| `agent-cc list` | List all cards |
| `agent-cc get <token>` | Retrieve full card details for making a purchase (see below) |
| `agent-cc create <memo> <type> <limit>` | Create a new card (see parameters below) |
| `agent-cc transactions` | List transaction history |

### Get Card Details

```bash
agent-cc get <token>
```

This is how the bot **accesses a card** to make a purchase. It returns:
- **Card Number** (16 digits)
- **CVV** (3-digit security code)
- **Expiry** (month/year)

The bot uses these details to fill out payment forms on websites.

**Note:** Retrieving card details does NOT use the card. The card is only "used" when a merchant actually charges it. For `SINGLE_USE` cards, the card closes after the **first successful transaction**, not after calling `get`.

### Create Card Parameters

```bash
agent-cc create <memo> <type> <limit>
```

| Parameter | Description | Values |
|-----------|-------------|--------|
| `memo` | Description for the card | Any text (e.g., "Netflix", "Amazon purchase") |
| `type` | Card type | `SINGLE_USE` or `UNLOCKED` |
| `limit` | Spending limit in dollars | Number (e.g., `20` for $20, `0` for unlimited) |

## Card Types

| Type | Behavior | Best For |
|------|----------|----------|
| `SINGLE_USE` | Closes after one transaction | One-time purchases, trials, unknown merchants |
| `UNLOCKED` | Stays open for multiple uses | Subscriptions, recurring payments, trusted merchants |

## Examples

```bash
# Create a $20 single-use card for Netflix
agent-cc create "Netflix trial" SINGLE_USE 20

# Create a $100 multi-use shopping card
agent-cc create "Shopping" UNLOCKED 100

# List all your cards
agent-cc list

# Get full details for a card (number, CVV, expiry)
agent-cc get abc123-def456-789

# View transaction history
agent-cc transactions
```

## How It Works

1. Your agent identifies a purchase to make
2. Agent asks for your confirmation (always required)
3. After you approve, agent creates a card with the right limit
4. Agent fills the payment form with card details
5. Purchase complete!

## Security

- Cards have spending limits you control
- Single-use cards auto-close after one transaction
- Agent always asks for confirmation before spending
- API key stored locally in `~/.agent-cc-config.json`, never in code
- No dependencies - pure Node.js

## File Structure

```
agent-cc/
├── SKILL.md        # OpenClaw skill definition
├── README.md       # This file
├── package.json    # CLI definition (bin: agent-cc)
├── install.sh      # Installation script
└── src/
    └── index.js    # CLI implementation
```

## Environment Variables

You can also set your API key via environment variable:
```bash
export BOTWALLET_API_KEY=your_api_key_here
```

## License

MIT
