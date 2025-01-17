# Build stage
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY AngularNoSTD/package*.json ./

# Install dependencies
RUN npm install --silent

# Copy the project files
COPY AngularNoSTD/ ./

# Build the Angular application
RUN npm run build --prod

# Production stage
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY AngularNoSTD/nginx/nginx-custom.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
