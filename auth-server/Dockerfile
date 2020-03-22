FROM node:10-alpine as build

WORKDIR /app
COPY package.json app.js ./
RUN npm install

FROM node:10-alpine

COPY --from=build /app /
EXPOSE 8888
CMD ["node", "app.js"]