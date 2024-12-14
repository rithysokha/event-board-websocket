FROM node:20-alpine

WORKDIR /app

COPY .env /app/.env
COPY .output /app/.output
COPY package*.json /app/

RUN npm install --omit=dev

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "production"]
