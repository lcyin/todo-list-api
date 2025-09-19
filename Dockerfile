# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for building)
RUN npm ci && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy the rest of the application code
COPY . .

# Build the TypeScript application, remove dev dependencies, and change ownership
RUN npm run build && \
    npx tsc src/scripts/migrate.ts --outDir dist/scripts --moduleResolution node --esModuleInterop --target es2020 && \
    npm prune --production && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]