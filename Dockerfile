FROM node:20-alpine

WORKDIR /app

COPY .output /app/.output
COPY package*.json ./

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node .output/server/index.mjs"]
