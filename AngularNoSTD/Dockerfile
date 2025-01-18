# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Copy all project files
COPY . ./

# Build the Angular application
RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx/nginx-custom.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage - Path matches your angular.json outputPath
COPY --from=builder /app/dist/angular-no-std /usr/share/nginx/html
# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
