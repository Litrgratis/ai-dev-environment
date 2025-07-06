# Advanced multi-stage build for AI Development Environment
# ---- Base Node image ----
FROM node:20-alpine AS base
WORKDIR /app

# Install security updates and required tools
RUN apk update && apk upgrade && \
    apk add --no-cache \
    bash \
    curl \
    git \
    python3 \
    py3-pip \
    g++ \
    make \
    && rm -rf /var/cache/apk/*

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json* ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies with legacy peer deps for compatibility
RUN npm ci --legacy-peer-deps && \
    cd backend && npm ci --legacy-peer-deps && \
    cd ../frontend && npm ci --legacy-peer-deps

# ---- Build ----
FROM deps AS build
COPY . .
RUN npm run build

# ---- Production ----
FROM base AS prod

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy dependencies and built application
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/backend ./backend
COPY --from=build /app/frontend ./frontend
COPY --from=build /app/config ./config

# Copy environment template
COPY .env.example .env

# Set ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "backend/server.js"]
