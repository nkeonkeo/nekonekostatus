FROM node:latest

WORKDIR /app
COPY package*.json config.js ./
RUN npm install
COPY . .
CMD [ "node", "nekonekostatus.js" ]