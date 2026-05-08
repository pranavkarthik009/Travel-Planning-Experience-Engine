# Stage 1: Build the React Application
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application with Node.js
FROM node:22-alpine
WORKDIR /app
# Copy the built app
COPY --from=build /app/dist ./dist
# Copy backend files
COPY package*.json ./
COPY server.js ./
# Install production dependencies
RUN npm install --omit=dev

# Efficiency: Set NODE_ENV to production for framework optimizations
ENV NODE_ENV=production

# Cloud Run expects the container to listen on PORT 8080 by default
EXPOSE 8080
CMD ["npm", "start"]
