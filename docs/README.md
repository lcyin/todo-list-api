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
