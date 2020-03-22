FROM node:10 as build

WORKDIR /app
COPY package.json app.js ./
RUN npm install

FROM node:10-alpine

COPY --from=build /app /
EXPOSE 3000
CMD ["npm", "start"]