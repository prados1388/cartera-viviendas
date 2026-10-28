# Cartera

Plataforma para inversores que gestionan varias viviendas en alquiler: gastos, contratos, alarmas de revisión y control de plagas.

La suscripción con tarjeta (Stripe) se dejará para más adelante. Ahora cada cuenta nace con **30 días de prueba**.

## Qué incluye este primer corte

- Registro / login (JWT)
- Varias viviendas por usuario
- Gastos por inmueble
- Contrato de alquiler (inquilino, documento, fechas, renta, fianza)
- Alarmas de revisión, plagas o vencimiento
- Historial de tratamientos de plagas
- Panel con avisos y contratos que caducan en 60 días

## Arranque local

Necesitas **Node.js** y **MongoDB** en marcha (`mongodb://127.0.0.1:27017`).

```bash
cd server
npm install
# El archivo .env ya apunta a Mongo local y al cliente en el puerto 5173

cd ../client
npm install
```

En dos terminales:

```bash
# terminal 1
npm run dev:server

# terminal 2
npm run dev:client
```

Abre [http://127.0.0.1:5173](http://127.0.0.1:5173). Crea una cuenta y añade la primera vivienda.

## Precios

- 30 días de prueba
- 8 € / mes
- 85 € / año

El cobro con tarjeta (Stripe) aún no está conectado.

## Publicar (Render)

Un servicio web. En el panel de Render, `MONGODB_URI` apunta a Atlas (otra base, no la de la clínica).

## Stack

React + Vite · Express · MongoDB · JWT. El mismo que CRM Boutique y la clínica.
