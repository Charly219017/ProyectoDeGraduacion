# Etapa 1: Construcción (Builder)
# Usamos una imagen completa de Node para instalar dependencias, incluyendo las de desarrollo si fueran necesarias para compilar.
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de definición del proyecto
COPY package.json package-lock.json ./

# Instalamos las dependencias de producción. 'npm ci' es más rápido y seguro para builds.
RUN npm ci --only=production

# Copiamos el resto del código fuente de la aplicación
COPY . .

# ---------------------------------------------------

# Etapa 2: Producción (Production)
# Usamos una imagen más ligera para la versión final, lo que reduce el tamaño y la superficie de ataque.
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiamos las dependencias ya instaladas desde la etapa 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copiamos el código de la aplicación desde la etapa 'builder'
COPY --from=builder /usr/src/app .

# Exponemos el puerto en el que corre tu aplicación. Cámbialo si usas otro.
EXPOSE 3001

# El comando para iniciar la aplicación. Asumo que el archivo principal es 'aplicacion.js'.
CMD [ "node", "aplicacion.js" ]