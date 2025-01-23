#!/bin/sh

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

# Iniciar NGINX
nginx -g "daemon off;"
