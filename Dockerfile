FROM node:latest

WORKDIR /app
COPY package.json .
RUN npm install --registry=https://registry.npm.taobao.org
COPY . .
CMD [ "node", "nekonekostatus.js" ]