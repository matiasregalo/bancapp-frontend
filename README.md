# BancApp — Productos Financieros

Aplicación móvil React Native para la gestión de productos financieros. Consume una API REST en `http://localhost:3002`.

---

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js | 18+ |
| npm | 9+ |
| React Native CLI | última |
| Android Studio | Hedgehog+ (para emulador Android) |
| Java (JDK) | 17 |

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd bancapp-frontend

# 2. Instalar dependencias
npm install

```

---

## Ejecución

### 1. Levantar el backend (API)

El frontend depende de la API REST corriendo en el puerto `3002`. Levantar el servidor antes de iniciar la app:

```bash
# Desde el directorio del backend
cd repo-interview-main
npm install
npm run start:dev
```

La API quedará disponible en `http://localhost:3002`.

### 2. Iniciar el Metro Bundler

```bash
npm start
```

### 3. Ejecutar en Android

```bash
npm run android
```

> Asegúrate de tener un emulador Android activo o un dispositivo físico conectado con depuración USB habilitada.

## Pruebas

```bash
# Ejecutar todos los tests
npm test

# Con reporte de cobertura
npm test -- --coverage

# Modo CI (sin modo watch)
npm test -- --coverage --watchAll=false
```