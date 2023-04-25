FROM node:10


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
RUN chmod 755 ./utils/wait-for-it.sh

EXPOSE 8080
CMD [ "npm", "start" ]
