FROM node:10-alpine

WORKDIR /usr/src/auth

COPY package*.json ./

RUN npm install


COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
