# Dockerfile para Cloud Run
FROM node:20-slim

WORKDIR /app

# Instalar dependencias primero para aprovechar cache de Docker
COPY package.json package-lock.json* ./
RUN npm install --production

# Copiar el resto del código
COPY . .

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Usar exec form para mejor manejo de señales
CMD ["node", "--es-module-specifier-resolution=node", "server-groq.js"]
