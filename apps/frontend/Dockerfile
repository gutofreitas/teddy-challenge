# Frontend (Next.js) image
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY nx.json tsconfig*.json ./
COPY apps ./apps
COPY libs ./libs

RUN npm ci
RUN npm run nx -- build frontend --configuration=production

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4200
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3000/api}

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=build /app/apps/frontend/next.config.js ./apps/frontend/next.config.js
COPY --from=build /app/apps/frontend/public ./apps/frontend/public

EXPOSE 4200
CMD ["npx", "next", "start", "apps/frontend", "-p", "4200"]
