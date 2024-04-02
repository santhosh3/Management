FROM node:18-alpine

WORKDIR /app

COPY package.json ./

COPY . .

RUN npm set strict-ssl false

RUN npm install ionic --loglevel verbose

RUN npm install -g @nestjs/cli

RUN set NODE_TLS_REJECT_UNAUTHORIZED=0

# export NODE_TLS_REJECT_UNAUTHORIZED=0

EXPOSE 3002

CMD [ "npm","run","start:dev" ]