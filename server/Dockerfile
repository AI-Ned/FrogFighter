# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy server code
COPY server.js .

# Expose the WebSocket port
EXPOSE 8080

# Run the server
CMD ["node", "server.js"]
