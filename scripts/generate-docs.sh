#!/bin/bash

# Script to generate static Swagger UI documentation for GitHub Pages

set -e

echo "🚀 Generating static Swagger UI documentation..."

# Create docs directory
mkdir -p docs

# Start the development server in background
echo "📡 Starting development server..."
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 10

# Download the swagger.json
echo "📥 Downloading OpenAPI specification..."
curl -f http://localhost:3000/api-docs.json > docs/swagger.json

# Stop the server
echo "🛑 Stopping development server..."
kill $SERVER_PID

# Download latest Swagger UI
echo "📦 Downloading Swagger UI..."
SWAGGER_UI_VERSION="5.10.3"
curl -L "https://github.com/swagger-api/swagger-ui/archive/refs/tags/v${SWAGGER_UI_VERSION}.tar.gz" | tar -xz

# Copy Swagger UI dist files
echo "📁 Setting up Swagger UI files..."
cp -r "swagger-ui-${SWAGGER_UI_VERSION}/dist/"* docs/

# Create custom swagger-initializer.js
cat > docs/swagger-initializer.js << 'EOF'
window.onload = function() {
  window.ui = SwaggerUIBundle({
    url: './swagger.json',
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout",
    validatorUrl: null,
    tryItOutEnabled: true,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    onComplete: function() {
      console.log('Todo List API Documentation loaded successfully');
    }
  });
};
EOF

# Update the page title and add custom styling
sed -i 's|<title>Swagger UI</title>|<title>Todo List API Documentation</title>|g' docs/index.html

# Add custom CSS for branding
cat >> docs/index.html << 'EOF'
<style>
  .topbar { display: none; }
  .swagger-ui .info .title {
    color: #3b4151;
    font-family: sans-serif;
  }
  .swagger-ui .info .description {
    color: #3b4151;
    font-family: sans-serif;
  }
</style>
EOF

# Clean up
rm -rf "swagger-ui-${SWAGGER_UI_VERSION}"

# Create README for the docs
cat > docs/README.md << 'EOF'
# Todo List API Documentation

This directory contains the static Swagger UI documentation for the Todo List API.

## Files

- `index.html` - Main Swagger UI interface
- `swagger.json` - OpenAPI 3.0 specification
- `swagger-initializer.js` - Swagger UI configuration
- Other files - Swagger UI assets

## Usage

1. Open `index.html` in a web browser for local viewing
2. Deploy this entire directory to GitHub Pages or any static hosting service

## GitHub Pages Setup

1. Go to your repository settings
2. Navigate to Pages section
3. Set source to "Deploy from a branch"
4. Select the branch containing this docs folder
5. Set folder to "/docs"
6. Save and wait for deployment

Your documentation will be available at:
`https://[username].github.io/[repository-name]/`

## Auto-updating

This documentation can be automatically updated using the GitHub Action workflow in `.github/workflows/deploy-docs.yml`.
EOF

echo "✅ Static Swagger UI documentation generated in ./docs/"
echo "📖 You can now:"
echo "   1. Open docs/index.html in your browser to preview"
echo "   2. Commit and push the docs/ folder"
echo "   3. Enable GitHub Pages pointing to the docs/ folder"
echo ""
echo "🌐 Once deployed, your documentation will be available at:"
echo "   https://[your-username].github.io/todo-list-api/"
