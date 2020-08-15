FROM node:12-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --quiet
COPY . .
RUN npm install -g nodemon
RUN npm install express
RUN npm install swagger-jsdoc
RUN npm install swagger-ui-express
RUN npm install nyc
EXPOSE 5000
CMD ["npm", "dev"]