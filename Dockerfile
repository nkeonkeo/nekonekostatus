FROM node:latest

WORKDIR /app
COPY package.json ./
RUN npm install --registry=https://registry.npm.taobao.org
CMD [ "node", "nekonekostatus.js" ]