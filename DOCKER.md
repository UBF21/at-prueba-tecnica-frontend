# Ejecutar Frontend con Docker

## Build de la imagen

```bash
docker build -t at-prueba-tecnica-frontend .
```

## Ejecutar el contenedor

```bash
docker run -p 5173:80 \
  -e VITE_API_URL=http://localhost:5000 \
  at-prueba-tecnica-frontend
```

## Con docker-compose (opcional)

Si prefieres usar docker-compose:

```bash
docker-compose up --build
```

Ver `docker-compose.yml` en este directorio.

## Acceder

- Frontend: http://localhost:5173
- API: http://localhost:5000 (backend debe estar corriendo)

## Variables de entorno

- `VITE_API_URL`: URL base de la API backend (default: http://localhost:5000)
