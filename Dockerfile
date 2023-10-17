# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock for efficient caching
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copy the rest of the application code
COPY . .

# Compile TypeScript into JavaScript
RUN npm run build

# Expose the NestJS application port
EXPOSE 3000

# Run the NestJS application
CMD ["yarn", "start:prod"]