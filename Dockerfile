FROM node:16-alpine
WORKDIR /usr/src/record-selector/server
COPY ./server/package*.json ./
RUN npm i
WORKDIR /usr/src/record-selector
COPY . .
WORKDIR /usr/src/record-selector/server
EXPOSE 3000
CMD ["npm", "start"]