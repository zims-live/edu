FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY ./ ./

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
