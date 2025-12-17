# Build stage
FROM node:20-alpine AS builder
WORKDIR /workspace
COPY package*.json nx.json tsconfig.base.json .npmrc* .prettier* .eslintrc* ./
COPY apps ./apps
COPY libs ./libs
COPY .nx ./.nx
RUN npm install
RUN npm run build:frontend

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /workspace/dist/apps/frontend-vite ./dist
COPY --from=builder /workspace/package*.json ./
RUN npm install --omit=dev && npm install -g http-server
EXPOSE 4173
CMD ["npx", "http-server", "./dist", "-p", "4173", "-a", "0.0.0.0"]
