FROM node:15 AS base
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json .
RUN npm install

FROM base AS builder 
COPY ./jest.config.js .
COPY ./.eslint* ./
COPY ./src src
COPY ./wait-for-it.sh .
RUN npm run build

FROM node:15-alpine AS prod
WORKDIR /app
COPY --from=builder /app/dist dist
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json
CMD ["npm", "run", "start"]
