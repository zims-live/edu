FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY ./tsconfig.json ./

COPY ./src/ ./src/

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
