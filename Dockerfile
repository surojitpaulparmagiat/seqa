FROM node:21.7.3-alpine3.18


WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN rm -rf node_modules

RUN npm install

COPY . .

CMD ["npm", "start"]