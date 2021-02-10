FROM node:15.6

EXPOSE 8080

WORKDIR /the-website

COPY package*.json ./

COPY src src

RUN npm install

CMD npm run start