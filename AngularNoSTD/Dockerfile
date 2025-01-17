# Build stage
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY AngularNoSTD/package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY AngularNoSTD/ ./

# Build the application
RUN npm run build --prod

# Production stage
FROM nginx:alpine

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY AngularNoSTD/nginx/nginx-custom.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage to nginx html directory
COPY --from=builder /app/dist/angular-no-std /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
