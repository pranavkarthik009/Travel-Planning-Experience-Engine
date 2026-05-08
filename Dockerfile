# Stage 1: Build the React Application
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
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
COPY server/ ./server/
COPY prisma/ ./prisma/
# Install production dependencies
RUN npm ci --omit=dev
# Generate Prisma Client
RUN npx prisma generate

# Cloud Run expects the container to listen on PORT 8080 by default
EXPOSE 8080
CMD ["npm", "start"]
