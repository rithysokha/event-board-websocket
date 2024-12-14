FROM node:18-alpine

WORKDIR /app

COPY .output /app/.output
COPY package*.json ./

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npx", "nuxt-start", "--port", "3000", "--hostname", "0.0.0.0"]
