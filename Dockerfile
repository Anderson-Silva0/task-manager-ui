FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY . .

EXPOSE 4200

CMD ["npm", "start", "--", "--configuration=docker", "--host", "0.0.0.0", "--disable-host-check"] 