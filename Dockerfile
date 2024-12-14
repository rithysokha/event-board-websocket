FROM node:20-alpine

WORKDIR /app

COPY .output /app/.output
COPY package*.json ./
COPY .env /app/

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm","run","production"]
