# Etapa 1: Build
FROM node:18-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

# Etapa 2: Produção
FROM node:18-alpine

RUN corepack enable

WORKDIR /app

# Copia apenas o necessário
COPY package.json pnpm-lock.yaml ./

# Aprova dependências que precisam rodar scripts de instalação (ex: sharp)
RUN pnpm pkg set scripts-allowed.sharp=true

# Instala apenas dependências de produção, sem rodar scripts (ex: prepare)
ENV HUSKY=0
RUN pnpm install --prod --ignore-scripts

# Copia os arquivos de build
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./ 

EXPOSE 3000

CMD ["pnpm", "start"]
