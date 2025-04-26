FROM node:22.2.0-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm dlx prisma generate

RUN pnpm build

EXPOSE 8000

CMD ["pnpm", "start:prod"]