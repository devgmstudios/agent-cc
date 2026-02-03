# Agent Credit Cards (agent-cc)

Give your AI agents single and multiuse credit cards so they can securely make purchases with fixed balances.

Powered by [BotWallet.ai](https://botwallet.ai)

## Installation

### Via OpenClaw
```
/install https://github.com/YOUR_USERNAME/botwallet-openclaw
```

### Manual Installation
```bash
git clone https://github.com/YOUR_USERNAME/botwallet-openclaw
cd botwallet-openclaw/skills/agent-cc
npm install -g .
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
| `agent-cc get <token>` | Get full card details (number, CVV, expiry) |
| `agent-cc create <memo> <type> <limit>` | Create a new card |
| `agent-cc transactions` | List transaction history |

## Card Types

- **SINGLE_USE**: Card closes after one transaction (recommended for most purchases)
- **UNLOCKED**: Card stays open for multiple transactions (for subscriptions/recurring)

## Examples

```bash
# Create a $20 single-use card for Netflix
agent-cc create "Netflix trial" SINGLE_USE 20

# Create a $100 multi-use shopping card
agent-cc create "Shopping" UNLOCKED 100

# List all your cards
agent-cc list

# Get full details for a card
agent-cc get abc123-def456-789
```

## How It Works

1. Your agent identifies a purchase to make
2. Agent asks for your confirmation
3. After you approve, agent creates a card with the right limit
4. Agent fills the payment form with card details
5. Purchase complete!

## Security

- Cards have spending limits you control
- Single-use cards auto-close after one transaction
- Agent always asks for confirmation before spending
- API key stored locally, never in code

## License

MIT
