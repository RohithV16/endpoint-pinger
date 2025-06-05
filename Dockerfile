# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if you have one)
# to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose any ports if your app serves anything (not strictly needed for a pinger, but good practice if you expand)
# EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]