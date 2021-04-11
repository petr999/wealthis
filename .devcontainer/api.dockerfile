FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY *.js .env lib ./
COPY lib lib

EXPOSE 8080
CMD [ "node", "index.js" ]
