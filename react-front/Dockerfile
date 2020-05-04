FROM node:10-alpine as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./package.json
RUN npm install
RUN npm run build
RUN npm install react-scripts@3.4.0 -g --silent
COPY . ./
RUN npm run build

FROM nginx:1.17-alpine

COPY --from=build /app/build /user/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
