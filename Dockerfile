FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm@9.5.0

COPY ./web .

RUN pnpm install

RUN pnpm build

EXPOSE 8080

CMD ["pnpm", "start"]
