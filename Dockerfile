# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy root package files
COPY package*.json ./
RUN npm install

# Copy local files
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy backend code
COPY server/ ./server/

# Copy built frontend from build stage
COPY --from=build /app/dist ./server/public

EXPOSE 5001

ENV NODE_ENV=production

WORKDIR /app/server
CMD ["node", "server.js"]
