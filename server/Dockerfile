FROM node:22.2.0-alpine

WORKDIR /app

RUN npm install -g pnpm @nestjs/cli

COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

RUN pnpm install

COPY . .

RUN pnpm dlx prisma generate

CMD ["pnpm", "start:dev"]