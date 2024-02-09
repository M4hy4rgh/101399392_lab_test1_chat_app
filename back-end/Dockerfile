# Use Node.js as the base image
FROM node:latest as builder
# LABEL version="1.0"
# LABEL description="This is the base docker image for the back-end of the application."
# LABEL maintainer = "Mahyar Ghasemi Khah"

# Create and set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy all the application files to the working directory in the container
COPY . .

# Expose the port on which your Express app runs
EXPOSE 8089

# Define the command to run your application
CMD ["npm", "start"]