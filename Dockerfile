# Etapa 1: Compilar la aplicación Angular
FROM node:18 AS build

WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install --force or --legacy-peer-deps


# Copiar el código de la aplicación Angular al contenedor
COPY . .

# Construir la aplicación Angular en modo producción
RUN npm run build -- --configuration production

# Generar el Service Worker con Workbox (opcional)
RUN npx workbox injectManifest workbox-config.js

# Etapa 2: Servir la aplicación con un servidor web
FROM nginx:alpine

# Copiar los archivos compilados de Angular desde la etapa anterior
COPY --from=build /app/dist/congrejw/browser /usr/share/nginx/html

# Copiar el archivo de configuración personalizado de NGINX (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el script de inicialización (init.sh) al contenedor
COPY ./init.sh /init.sh

# Darle permisos de ejecución al script
RUN chmod +x /init.sh

# Exponer el puerto 80 para que el contenedor sirva la aplicación
EXPOSE 80

# Comando para ejecutar el script de inicialización y luego iniciar NGINX
CMD ["/bin/sh", "/init.sh"]
