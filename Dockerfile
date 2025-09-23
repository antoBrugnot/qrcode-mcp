# Use official Node.js LTS Alpine image for security and smaller size
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install security updates and required packages
RUN apk --no-cache add \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S qrcode -u 1001 -G nodejs

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci for reproducible builds
RUN npm ci --only=production && \
    npm cache clean --force

# Development stage
FROM base AS development
ENV NODE_ENV=development
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS production

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy built application from development stage
COPY --from=development --chown=qrcode:nodejs /app/dist ./dist
COPY --from=development --chown=qrcode:nodejs /app/package*.json ./

# Security: Remove unnecessary packages and clean up
RUN npm prune --production && \
    rm -rf /root/.npm /tmp/* /var/tmp/* && \
    chmod -R 755 /app

# Switch to non-root user
USER qrcode

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node --version || exit 1

# Expose port (though MCP typically uses stdio)
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command
CMD ["node", "dist/index.js"]