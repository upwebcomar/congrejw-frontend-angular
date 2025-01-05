# Etapa 1: Compilar la aplicación Angular
FROM node:18 AS build

WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el código de la aplicación Angular al contenedor
COPY . .

# Construir la aplicación Angular en modo producción
RUN npm run build -- --configuration production

# Generar el Service Worker con Workbox
RUN npx workbox generateSW workbox-config.js

# Etapa 2: Servir la aplicación con un servidor web
FROM nginx:alpine

# Copiar los archivos compilados de Angular desde la etapa anterior
COPY --from=build /app/dist/congrejw/browser /usr/share/nginx/html

# Copiar el archivo de configuración personalizado de Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para que el contenedor sirva la aplicación
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
