FROM node:15.6

EXPOSE 8080

WORKDIR /website

COPY package*.json ./

RUN npm install

COPY app.js ./

CMD npm run start