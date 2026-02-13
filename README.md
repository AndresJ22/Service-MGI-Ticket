# MGI Tickets Challenge

Sistema de venta de entradas con alta concurrencia, implementado con DDD + arquitectura hexagonal.

## 📋 Documento de diseño

Ver [docs/design.md](docs/design.md) para la solución completa de alto nivel.

## 🏗️ Arquitectura

```
src/
  domain/
    tickets/           # Entidades de tipos de entrada
    reservations/      # Reservas y estados (PENDING, CONFIRMED, EXPIRED)
    ports/             # Interfaces (repositorios, clock, pagos)
  application/
    services/          # Casos de uso con lógica de negocio
  infrastructure/
    clock/             # SystemClock y TestClock
    repositories/      # Implementaciones en memoria
  interfaces/
    controllers/       # Endpoints HTTP REST
```

## 🚀 Instalación

```bash
npm install
```

## ▶️ Ejecutar la aplicación

```bash
# desarrollo
npm run start:dev

# producción
npm run start:prod
```

La aplicación arranca en `http://localhost:3001`

### 📖 Documentación Swagger

Una vez iniciada la aplicación, la documentación interactiva está disponible en:

**http://localhost:3001/api**

Swagger UI permite probar todos los endpoints directamente desde el navegador.

## 🧪 Ejecutar pruebas

```bash
# pruebas unitarias
npm run test

# con cobertura
npm run test:cov
```

## 📡 API Endpoints

### 1. Reservar entradas

```http
POST /reservations
Content-Type: application/json

{
  "ticketTypeId": "tt-1",
  "quantity": 2,
  "userId": "user-123"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "uuid-generado",
  "ticketTypeId": "tt-1",
  "quantity": 2,
  "userId": "user-123",
  "status": "PENDING",
  "createdAt": "2026-02-13T...",
  "expiresAt": "2026-02-13T..." // +5 minutos
}
```

**Error - sin inventario (409):**
```json
{
  "statusCode": 409,
  "message": "INSUFFICIENT_INVENTORY"
}
```

### 2. Confirmar pago

```http
POST /payments/confirm
Content-Type: application/json

{
  "reservationId": "uuid-de-reserva",
  "paymentId": "pay-123"
}
```

**Respuesta exitosa (201):**
```json
{
  "status": "CONFIRMED"
}
```

**Idempotencia (duplicado):**
```json
{
  "status": "ALREADY_PROCESSED"
}
```

### 3. Expirar reservas (manual)

```http
POST /reservations/expire
```

**Respuesta:**
```json
{
  "expiredCount": 2
}
```

## 🔑 Características implementadas

✅ **Reserva con expiración automática** (5 minutos TTL)  
✅ **Confirmación de pago idempotente** (evita duplicados)  
✅ **Anti-sobreventa** (validación atómica de inventario)  
✅ **Liberación automática** de inventario al expirar  
✅ **Arquitectura hexagonal** con puertos e infraestructura  
✅ **Pruebas unitarias** con cobertura de casos críticos

## 🧩 Flujo completo

1. Usuario reserva 2 entradas → inventario se reduce
2. Reserva queda `PENDING` por 5 minutos
3. Usuario paga → reserva pasa a `CONFIRMED`
4. Si no paga a tiempo → expira y libera inventario

## 🏭 Deployment (AWS)

Para desplegar en AWS Lambda + API Gateway:

```bash
# Instalar serverless framework
npm i -g serverless

# Configurar serverless.yml
# Desplegar
serverless deploy
```

Para ECS/Fargate:
```bash
# Build de imagen
docker build -t mgi-tickets .

# Push a ECR
aws ecr get-login-password | docker login --username AWS ...
docker tag mgi-tickets:latest <ECR_URI>
docker push <ECR_URI>

# Desplegar en ECS
# (configurar task definition + service)
```

## 📝 Supuestos técnicos

- Repos en memoria (producción requiere PostgreSQL/Redis)
- Sin autenticación/autorización
- TTL de reserva fijo (5 min)
- Un solo tipo de ticket seed (`tt-1` con 100 unidades)

## 👤 Autor

Reto técnico para MGI - 2026
