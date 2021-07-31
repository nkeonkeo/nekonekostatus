FROM node:16 as build

WORKDIR /app
COPY . ./
RUN npm install --registry=https://registry.npm.taobao.org
FROM node:16-alpine
COPY --from=build /app /
CMD [ "node", "nekonekostatus.js" ]