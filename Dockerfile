# # build environment
# FROM node:13.12.0-alpine as build
# WORKDIR /app
# COPY package.json ./
# RUN npm install -g yarn
# RUN yarn install
# COPY . ./
# RUN yarn run build

# production environment
FROM nginx:stable-alpine
COPY ./build /app/build
COPY ./build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
