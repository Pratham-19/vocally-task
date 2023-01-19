FROM node:19-alpine

WORKDIR /usr/src/app

COPY ./package*.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

EXPOSE 3003

CMD ["npm", "start"]