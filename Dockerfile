# Etapa 1: Compilar la aplicación Angular
FROM node:18 AS build

WORKDIR /app

# Copiar package.json y package-lock.json antes para aprovechar la caché
COPY package*.json ./

# Usar cacheo de dependencias (evita reinstalaciones innecesarias)
RUN npm ci --legacy-peer-deps

# Copiar el código de la aplicación Angular al contenedor
COPY . .

# Construir la aplicación Angular en modo producción
RUN npm run build -- --configuration production

# Etapa 2: Servir la aplicación con NGINX
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa anterior
COPY --from=build /app/dist/congrejw/browser /usr/share/nginx/html

# Copiar configuración personalizada de NGINX (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar script de inicialización (init.sh)

COPY ./start.sh /start.sh

RUN chmod +x /start.sh

# Exponer el puerto 80
EXPOSE 80

