#!/bin/bash

# Setup script for Todo List API development environment
set -e

echo "🚀 Setting up Todo List API development environment..."

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo "❌ nvm is not installed. Please install nvm first:"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and use Node.js version from .nvmrc
echo "📦 Installing Node.js version specified in .nvmrc..."
nvm install
nvm use

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run initial checks
echo "🔍 Running initial checks..."
npm run build
npm run lint

echo "✅ Setup complete! You can now run:"
echo "   npm run dev    # Start development server"
echo "   npm test       # Run tests"
echo "   npm run build  # Build for production"
