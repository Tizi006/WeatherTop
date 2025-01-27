# Base Node.js image
FROM node:23-slim
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy source code into the container
COPY . .
# Expose app port
EXPOSE 80
# Start the app
CMD ["npm", "start"]
