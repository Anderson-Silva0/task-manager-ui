FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Angular default port
EXPOSE 4200

# Start the application
CMD ["npm", "start", "--", "--configuration=docker", "--host", "0.0.0.0", "--disable-host-check"]
