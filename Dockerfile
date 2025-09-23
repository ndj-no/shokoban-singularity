## Multi-stage Dockerfile for building and serving a Vite (Vue 3 + TS) app
## Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install deps separately for better layer caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN npm set fund false \
    && npm set audit false \
    && if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
       else npm install --legacy-peer-deps; fi

# Copy the rest of the source
COPY . .

# Build (includes type-check because build script runs vue-tsc + vite)
RUN npm run build-only

## Runtime stage (Nginx lightweight static serve)
FROM nginx:1.27-alpine AS runtime

LABEL org.opencontainers.image.source="https://github.com/ndj-no/shokoban-singularity" \
      org.opencontainers.image.description="Sokoban Enhanced - static build served by Nginx" \
      org.opencontainers.image.licenses="MIT"

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# (Optional) Add a non-root user (Nginx runs as nginx already in alpine variant)
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -q -O /dev/null http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
