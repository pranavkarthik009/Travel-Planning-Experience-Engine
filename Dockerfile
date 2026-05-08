# Stage 1: Build the React Application
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
# Copy the built app to nginx's web root
COPY --from=build /app/dist /usr/share/nginx/html
# Remove default nginx static assets
RUN rm /etc/nginx/conf.d/default.conf
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d

# Cloud Run expects the container to listen on PORT 8080 by default
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
