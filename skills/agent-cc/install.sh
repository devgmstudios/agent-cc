#!/bin/bash

# Agent Credit Cards (agent-cc) Installer
# Installs the CLI globally so you can use: agent-cc list, agent-cc create, etc.

echo ""
echo "  Installing Agent Credit Cards..."
echo ""

# Install globally with npm
npm install -g .

if [ $? -eq 0 ]; then
  echo ""
  echo "  Installation complete!"
  echo ""
  echo "  Next steps:"
  echo "    1. Run: agent-cc onboard"
  echo "    2. Enter your BotWallet API key"
  echo "    3. Try: agent-cc list"
  echo ""
else
  echo ""
  echo "  Installation failed. Try running with sudo:"
  echo "    sudo npm install -g ."
  echo ""
  exit 1
fi
