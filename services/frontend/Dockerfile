# build for amd64
# docker buildx build --platform linux/amd64 -t frontend .

# Use an official Node.js image as the base
FROM amd64/node as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vue.js application for production
RUN npm run build

# Use a lightweight Nginx image as the base for serving the static files
FROM nginx:1.21-alpine as production-stage

# Copy the built files from the previous stage to the Nginx image
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
