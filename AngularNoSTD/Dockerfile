# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files from AngularNoSTD directory
COPY AngularNoSTD/package*.json ./

# Install dependencies
RUN npm install

# Copy source code from AngularNoSTD directory
COPY AngularNoSTD/ .

# Build the application
RUN npm run build --prod

# Runtime stage
FROM nginx:1.25-alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist/fintech-web-client /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
