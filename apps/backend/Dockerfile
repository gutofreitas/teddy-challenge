# Backend (NestJS) image
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY nx.json tsconfig*.json ./
COPY apps ./apps
COPY libs ./libs

RUN npm ci
RUN npm run nx -- build backend --configuration=production

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist/apps/backend ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
