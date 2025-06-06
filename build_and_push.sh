#!/bin/bash

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
docker build -t $IMAGE_NAME:$TAG . #docker build --no-cache -t $IMAGE_NAME:$TAG . con no-cache hace build desde cero

log "Imagen construida exitosamente."

# Empujar la imagen al repositorio
log "Empujando la imagen al repositorio: $IMAGE_NAME:$TAG"
docker push $IMAGE_NAME:$TAG

log "Imagen empujada exitosamente al repositorio."

log "Proceso completado con éxito."
