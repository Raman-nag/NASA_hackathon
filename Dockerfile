# Multi-stage build for NASA Exoplanet AI Application

# Stage 1: Build React frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Stage 2: Build Node.js backend
FROM node:18-alpine as backend-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# Stage 3: Python AI environment
FROM python:3.9-slim as ai-build
WORKDIR /app/ai
COPY ai/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY ai/ ./
RUN python train_model.py

# Stage 4: Production image
FROM node:18-alpine
WORKDIR /app

# Install Python for AI model
RUN apk add --no-cache python3 py3-pip
RUN ln -sf python3 /usr/bin/python

# Copy backend
COPY --from=backend-build /app/server ./
RUN npm install

# Copy frontend build
COPY --from=frontend-build /app/client/build ./client/build

# Copy AI model
COPY --from=ai-build /app/ai ./ai
RUN pip3 install --no-cache-dir -r ai/requirements.txt

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]

