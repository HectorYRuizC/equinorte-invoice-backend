
## Stack y versiones

| Capa | Tecnologia | Version |
| --- | --- | --- |
| Backend | Java | 17 |
| Backend | Spring Boot | 4.0.6 |
| Backend | Maven Wrapper | 3.9.16 |
| Base de datos | PostgreSQL | 15 |
| Frontend | Angular | 21.2.x |
| Frontend | Angular CLI | 21.2.14 |
| Frontend | Node.js | 22 recomendado |
| Frontend | npm | 10.9.3 definido en `package.json` |
| Contenedores | Docker / Docker Compose | Docker Compose compatible |

Imagenes usadas en Docker:

- `postgres:15`
- `maven:3.9-eclipse-temurin-17`
- `eclipse-temurin:17-jre-jammy`
- `node:22-alpine`
- `nginx:1.27-alpine`

## Estructura del proyecto

```text
equinorte-invoice/
├── backend/
│   ├── src/main/java/com/equinorte/invoice/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── enums/
│   │   └── exception/
│   ├── src/main/resources/
│   │   └── application.yaml
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/app/
│   ├── proxy.conf.json
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Ejecucion rapida con Docker

Esta es la forma mas sencilla para levantar todo el sistema: base de datos, backend y frontend.

### Requisitos

- Docker instalado.
- Docker Compose instalado o disponible como `docker compose`.
- Puertos libres:
  - `5432` para PostgreSQL.
  - `8080` para el backend.
  - `4200` para el frontend.

### Levantar la aplicacion

Desde la raiz del repositorio:

```bash
docker compose up --build
```

En otra terminal, carga los datos de prueba desde el script de la raiz:

```bash
docker compose exec -T postgres psql -U postgres -d invoice_db < script-db.sql
```

Cuando los servicios terminen de iniciar:

- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api/invoices
- PostgreSQL:
  - Host: `localhost`
  - Puerto: `5432`
  - Base de datos: `invoice_db`
  - Usuario: `postgres`
  - Password: `postgres`

### Detener la aplicacion

```bash
docker compose down
```

Para eliminar tambien el volumen de PostgreSQL y reiniciar los datos desde cero:

```bash
docker compose down -v
```

## Ejecucion local sin Docker completo

Tambien puedes correr cada capa por separado. Este modo es util para desarrollo.

### 1. Levantar solo PostgreSQL

Puedes usar una instancia local de PostgreSQL o levantar solo el contenedor de base de datos:

```bash
docker compose up -d postgres
```

La configuracion esperada por defecto esta en `backend/src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/invoice_db
    username: postgres
    password: postgres
```

### 2. Correr el backend

En macOS/Linux, si el wrapper no tiene permisos de ejecucion despues de clonar el repo, aplica una vez:

```bash
chmod +x backend/mvnw
```

Luego ejecuta:

```bash
cd backend
./mvnw spring-boot:run
```

Alternativa sin cambiar permisos:

```bash
cd backend
sh ./mvnw spring-boot:run
```

El backend queda disponible en:

```text
http://localhost:8080
```

### 3. Correr el frontend

En otra terminal:

```bash
cd frontend
npm ci
npm start
``[README.md](README.md)`

Angular queda disponible en:

```text
http://localhost:4200
```

El frontend usa `frontend/proxy.conf.json` para enviar las peticiones `/api` al backend en `http://localhost:8080`.

## Script de base de datos

En la raiz del repositorio esta el archivo `script-db.sql`. Este script crea las tablas `invoice` e `invoice_details`, carga 2 facturas de prueba con 3 productos cada una y deja consultas finales de verificacion.

Para ejecutarlo contra PostgreSQL desde Docker:

```bash
docker compose exec -T postgres psql -U postgres -d invoice_db < script-db.sql
```

Para ejecutarlo con un cliente `psql` instalado localmente:

```bash
psql -h localhost -p 5432 -U postgres -d invoice_db -f script-db.sql
```

Nota: el script elimina y recrea las tablas para dejar un ambiente limpio de prueba.

## Datos de prueba

El archivo `script-db.sql`, ubicado en la raiz del repositorio, carga 2 facturas iniciales, cada una con 3 productos.

Factura `1`:

| Producto | Precio | IVA | Total |
| --- | ---: | ---: | ---: |
| Excavadora Caterpillar 320D | 80.000 | 15.200 | 95.200 |
| Mezcladora de concreto industrial | 40.000 | 7.600 | 47.600 |
| Andamios metalicos | 30.000 | 5.700 | 35.700 |

Subtotal: `150.000`  
IVA: `28.500`  
Total: `178.500`

Factura `2`:

| Producto | Precio | IVA | Total |
| --- | ---: | ---: | ---: |
| Compactadora de suelo | 70.000 | 13.300 | 83.300 |
| Generador electrico 15kVA | 90.000 | 17.100 | 107.100 |
| Vibrador de concreto | 60.000 | 11.400 | 71.400 |

Subtotal: `220.000`  
IVA: `41.800`  
Total: `261.800`

Nota: el backend no carga datos automaticamente al iniciar. Esto evita duplicidad de scripts y deja `script-db.sql` como unica fuente de datos de prueba.


## Endpoints principales

Base URL:

```text
http://localhost:8080/api/invoices
```

### Listar facturas

```bash
curl http://localhost:8080/api/invoices
```

### Consultar una factura

```bash
curl http://localhost:8080/api/invoices/1
```

### Crear una factura

```bash
curl -X POST http://localhost:8080/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "details": [
      { "productName": "Retroexcavadora", "price": 100000 },
      { "productName": "Martillo demoledor", "price": 50000 },
      { "productName": "Planta electrica", "price": 75000 }
    ]
  }'
```

### Previsualizar recálculo

Este endpoint calcula los nuevos valores, pero no modifica la factura.

```bash
curl -X POST http://localhost:8080/api/invoices/recalculate \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": 1,
    "newSubtotal": 160000,
    "userType": "TYPE_A"
  }'
```

### Aplicar recálculo

Este endpoint guarda los nuevos valores en base de datos.

```bash
curl -X POST http://localhost:8080/api/invoices/recalculate/apply \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": 1,
    "newSubtotal": 160000,
    "userType": "TYPE_A"
  }'
```

### Ejemplo de error por limite

`TYPE_A` no puede aumentar mas de `20.000`. Para la factura `1`, cuyo subtotal es `150.000`, este request debe fallar porque intenta subir a `180.001`.

```bash
curl -X POST http://localhost:8080/api/invoices/recalculate \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": 1,
    "newSubtotal": 180001,
    "userType": "TYPE_A"
  }'
```

Respuesta esperada:

```json
{
  "status": 400,
  "error": "Business Error",
  "message": "Increase exceeds allowed limit for user type. Max allowed: 20000"
}
```

## Flujo recomendado para probar desde la interfaz

1. Abre http://localhost:4200.
2. Selecciona una factura de la lista.
3. Elige el tipo de usuario:
   - Tipo A / Operador.
   - Tipo B / Supervisor.
4. Ingresa un nuevo subtotal.
5. Presiona `Previsualizar recalculo`.
6. Revisa la tabla con los nuevos valores de cada producto.
7. Confirma para guardar el recálculo.

## Comandos utiles

### Backend

```bash
cd backend
sh ./mvnw clean package
sh ./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm ci
npm run build
npm start
```

### Docker

```bash
docker compose up --build
docker compose exec -T postgres psql -U postgres -d invoice_db < script-db.sql
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose down
docker compose down -v
```

