# Agent Credit Cards (agent-cc)

Give your AI agents single and multiuse credit cards so they can securely make purchases with fixed balances.

Powered by [BotWallet.ai](https://botwallet.ai)

## Installation

### Via OpenClaw
```
/install https://github.com/anthropics/agent-cc
```

### Manual Installation
```bash
git clone https://github.com/anthropics/agent-cc
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
| `agent-cc get <token>` | Get full card details (number, CVV, expiry) |
| `agent-cc create <memo> <type> <limit>` | Create a new card |
| `agent-cc transactions` | List transaction history |

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
