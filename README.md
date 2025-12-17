# Teddy Monorepo (NX)

Monorepo Nx com backend NestJS e frontend Next.js para autenticação (JWT) e CRUD de clientes. As regras de negócio vivem em bibliotecas de domínio reutilizáveis, isolando os apps de detalhes de persistência.

## Estrutura
- `apps/backend` – API NestJS com login, registro e CRUD de clientes (guardado por JWT).
- `apps/frontend` – Next.js (App Router) com login, gestão de clientes e hints de uso.
- `libs/auth` – Domínio de autenticação (entidades, erros, serviço de domínio, portas).
- `libs/clients` – Domínio de clientes (entidades, regras e portas).
- `libs/infra` – Implementações in-memory de repositórios e hasher.

## Rodando localmente
```bash
npm install
npm run dev:backend   # http://localhost:3000/api
npm run dev:frontend  # http://localhost:4200
```
Credenciais seed: `admin@teddy.local` / `admin123` (configuráveis via env).

Principais comandos Nx:
- `npm run build:backend` / `npm run build:frontend`
- `npx nx show project backend` (ou `frontend`) para detalhes de targets.

## Variáveis de ambiente
- Backend: `PORT=3000`, `JWT_SECRET=dev-secret`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- Frontend: `NEXT_PUBLIC_API_URL=http://localhost:3000/api` (já default no código).

## Docker
Imagens específicas em `apps/backend/Dockerfile` e `apps/frontend/Dockerfile`.

Subir tudo com Compose:
```bash
docker-compose up --build
# frontend: http://localhost:4200 | backend: http://localhost:3000/api
```

## API rápida
- `POST /api/auth/login { email, password }`
- `POST /api/auth/register { email, password }`
- `GET /api/clients` (JWT)
- `POST /api/clients` (JWT)
- `PUT /api/clients/:id` (JWT)
- `DELETE /api/clients/:id` (JWT)

## Notas de arquitetura
- Regras de negócio vivem em `libs/auth` e `libs/clients` (não acopladas ao Nest).
- Repositórios e hasher são injetados via tokens (`apps/backend/src/app/common/tokens.ts`).
- Guard JWT global para rotas de clientes; seed de admin em `AuthSeeder`.

## Testes / qualidade
- `npx nx test <projeto>` para libs ou apps (targets disponíveis via `nx show project`).
- `npx nx lint <projeto>` para lint quando necessário.
