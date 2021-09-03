FROM node:14-alpine as build

WORKDIR /app
COPY package.json app.mjs ./
RUN npm install

FROM node:14-alpine

COPY --from=build /app /
EXPOSE 8888
CMD ["node", "app.mjs"]