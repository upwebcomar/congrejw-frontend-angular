#!/bin/sh

# Imprime el valor de API_URL para verificación
echo "Valor de API_URL dentro del contenedor: $API_URL"

# Si el archivo sw.js existe, realiza el reemplazo
if [ -f /usr/share/nginx/html/sw.js ]; then
  echo "Reemplazando __API_URL__ con $API_URL en sw.js..."
  sed -i "s|__API_URL__|$API_URL|g" /usr/share/nginx/html/sw.js
else
  echo "Advertencia: /usr/share/nginx/html/sw.js no encontrado"
fi

echo "Generando env.js..."

# Generar el archivo env.js dinámicamente con las variables de entorno pasadas por docker compose
#<script src="/assets/env.js"></script> <!-- Archivo dinámico --> en el index.html carga las variables de entorno
cat <<EOF > /usr/share/nginx/html/assets/env.js
window['env'] = {
  apiUrl: '${API_URL}',
  appName: '${APP_NAME}',
  allowedDomains: ['${ALLOWED_DOMAINS}'],
  disallowedRoutes: ['${DISALLOWED_ROUTES}']
};
EOF

# Inicia Nginx
exec nginx -g "daemon off;"
