#!/bin/bash

docker compose down

# Configuración
IMAGE_NAME="upwebcomar/congrejw-angular"
TAG="latest"

# Función para mostrar mensajes con formato
log() {
  echo -e "\033[1;32m$1\033[0m"
}

# Salir si ocurre un error
set -e

log "Iniciando el proceso de construcción de la imagen Docker..."

# Construir la imagen
log "Construyendo la imagen Docker: $IMAGE_NAME:$TAG"
docker build  -t $IMAGE_NAME:$TAG .     # docker build --no-cache -t $IMAGE_NAME:$TAG . para build desde cero

log "Imagen construida exitosamente."


docker compose up -d

