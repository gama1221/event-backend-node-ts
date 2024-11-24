# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if exists) to the working directory
COPY package*.json ./

# Install dependencies (both production and development dependencies)
RUN npm install --frozen-lockfile

# Install TypeScript globally (if not already included in your devDependencies)
RUN npm install -g typescript

# Copy the entire application code into the container
COPY . .

# Build the TypeScript code (compiling from src/ to dist/)
RUN npm run build

# Expose the port your app will run on (change this if needed)
EXPOSE 3000

# Set the command to run the app (using the compiled JavaScript in dist/)
CMD ["npm", "run", "start"]
