FROM node:10-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json .
RUN npm install

FROM base AS builder 
COPY ./src src
RUN npm run build

FROM builder as lint
COPY ./.eslint* ./
RUN npm run lint

FROM builder as test
RUN npm run test

FROM node:10-alpine AS prod
WORKDIR /app
COPY --from=test /app/dist dist
COPY --from=test /app/node_modules node_modules
COPY --from=test /app/package.json package.json
CMD ["npm", "run", "start"]
