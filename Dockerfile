# Use a stable, high-compatibility base image
FROM node:20-slim

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install ALL dependencies (needed for build)
RUN npm install

# Copy all source files
COPY . .

# Build the React frontend
RUN npm run build

# Remove development dependencies to keep the image slim
RUN npm prune --omit=dev

# Efficiency: Set NODE_ENV to production
ENV NODE_ENV=production

# Cloud Run defaults
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
