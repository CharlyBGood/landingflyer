# Dockerfile para Cloud Run
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
