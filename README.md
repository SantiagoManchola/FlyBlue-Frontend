# FlyBlue Frontend

Repositorio del frontend de FlyBlue — una base React + Vite (TypeScript soporte incluido) preparada para desarrollo local rápido y despliegue en Vercel.

## Resumen rápido

- Framework: Vite + React
- Comando de desarrollo: `pnpm dev`
- Comando de build (producción): `npm run build` (genera `dist/`)
- Directorio de salida para producción: `dist`

## Requisitos

- Node.js (16+ recomendable)
- npm o yarn

## Comandos locales

Instalar dependencias:

```bash
pnpm install
```

Arrancar en modo desarrollo (hot-reload):

```bash
pnpm dev
```

Generar build de producción:

```bash
npm run build
```

Servir el build localmente (para verificar el artefacto de producción):

```bash
# instala un servidor estático (si no lo tienes)
npm install -g serve

# después de `npm run build`:
serve -s dist -l 3000
```

# Aerolínea Low Cost Web Vistas

This is a code bundle for Aerolínea Low Cost Web Vistas. The original project is available at https://www.figma.com/design/hhL8W5Kz26ejI0XpfA4GSR/Aerol%C3%ADnea-Low-Cost-Web-Vistas.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.
