FROM node:10-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json .
RUN npm install

FROM base AS builder 
COPY ./src src
RUN npm run build

FROM node:10-alpine AS prod
WORKDIR /app
COPY --from=builder /app/dist dist
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json
CMD ["npm", "run", "start"]
