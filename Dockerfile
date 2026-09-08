# syntax=docker/dockerfile:1

# ---- build ---------------------------------------------------------------
FROM node:22.18.0-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- serve --------------------------------------------------------------
FROM nginx:1.27-alpine

# Cloud Run (and most PaaS) inject PORT at runtime; default for local `docker run`.
ENV PORT=8080

# nginx:alpine's entrypoint runs envsubst over /etc/nginx/templates/*.template.
# Restrict substitution to ${PORT} so nginx's own $uri / $host survive.
ENV NGINX_ENVSUBST_FILTER=PORT
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist/app/browser /usr/share/nginx/html

EXPOSE 8080
