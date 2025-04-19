# Etapa 1: Compilar la aplicación Angular
FROM node:23-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servir la aplicación con NGINX
FROM nginx:alpine

COPY --from=build /app/dist/congrejw/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./start.sh /start.sh

RUN  sed -i 's/\r$//' /start.sh && chmod +x /start.sh

EXPOSE 80
