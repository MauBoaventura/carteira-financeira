# Etapa 1: Build
FROM node:18-alpine AS builder

RUN corepack enable

WORKDIR /app

# Copia tudo de uma vez (evita erro do prisma generate)
COPY . .

# Instala dependências e executa postinstall (prisma generate)
RUN pnpm install

# Build do Prisma já acontece aqui via postinstall
RUN pnpm build

# Etapa 2: Produção
FROM node:18-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Ignora scripts de prepare (ex: husky)
ENV HUSKY=0

RUN pnpm install --prod --ignore-scripts

# Copia os arquivos necessários para rodar a aplicação
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["pnpm", "start"]
