FROM node:15.6

EXPOSE 3000


WORKDIR /website

COPY package*.json ./

RUN npm install


COPY src src

CMD ["npm", "run" , "start"]