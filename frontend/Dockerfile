# Use Node.js base image
FROM node:18

# Set working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json first (for better Docker caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build Next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Run the Next.js server in production mode
CMD ["npm",  "start"]
