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
| Xcode | 15+ (solo macOS, para simulador iOS) |
| Java (JDK) | 17 |

---

## Configuración del entorno

Sigue la guía oficial de React Native para configurar el entorno antes de continuar:
[https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd bancapp-frontend

# 2. Instalar dependencias
npm install

# 3. Instalar pods (solo macOS/iOS)
cd ios && pod install && cd ..
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

### 4. Ejecutar en iOS (solo macOS)

```bash
npm run ios
```

> Requiere Xcode instalado y los pods configurados (`pod install`).

---

## Pruebas

```bash
# Ejecutar todos los tests
npm test

# Con reporte de cobertura
npm test -- --coverage

# Modo CI (sin modo watch)
npm test -- --coverage --watchAll=false
```

Cobertura mínima requerida: **70%** en services, hooks, components y screens.

---

## Estructura del proyecto

```
src/
├── config/
│   └── api.config.ts          # BASE_URL de la API
├── features/
│   └── products/
│       ├── components/        # Componentes presentacionales
│       ├── hooks/             # Estado y lógica de negocio
│       ├── screens/           # Pantallas rutables
│       └── services/          # Llamadas fetch a la API
├── navigation/
│   └── AppNavigator.tsx       # Stack Navigator (React Navigation v6)
├── shared/
│   └── components/            # Componentes reutilizables
└── types/                     # Tipos TypeScript compartidos
```

---

## Funcionalidades

| ID | Funcionalidad | Estado |
|----|--------------|--------|
| F1 | Listado de productos financieros | Implementado |
| F2 | Búsqueda por texto | Implementado |
| F3 | Conteo de resultados filtrados | Implementado |
| F4 | Agregar producto con validaciones | Implementado |
| F5 | Editar producto | Implementado |

---

## Validaciones del formulario

Las validaciones del frontend están alineadas con el DTO del backend (`ProductDTO`):

| Campo | Regla |
|-------|-------|
| ID | Requerido · entre 3 y 10 caracteres · único (verificado vía API) |
| Nombre | Requerido · entre **6** y 100 caracteres |
| Descripción | Requerido · entre 10 y 200 caracteres |
| Logo | Requerido · URL de imagen accesible desde el dispositivo/emulador |
| Fecha Liberación | Requerida · formato `AAAA-MM-DD` · debe ser igual o mayor a la fecha actual |
| Fecha Revisión | Calculada automáticamente (Fecha Liberación + 1 año exacto) · solo lectura |

> **Nota sobre logos**: el frontend carga la imagen directamente desde la URL proporcionada. Si la URL no es accesible desde el emulador (URL inválida, caída o bloqueada), se muestra "Sin imagen disponible". Para pruebas se recomienda usar `https://picsum.photos/seed/bancapp/400/200`.

---

## API — Endpoints principales

Base URL: `http://localhost:3002`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/bp/products` | Listar productos |
| GET | `/bp/products/verification/:id` | Verificar si un ID ya existe |
| POST | `/bp/products` | Crear producto |
| PUT | `/bp/products/:id` | Editar producto |

---

## Convención de commits

```
feat(<scope>): descripción
test(<scope>): descripción
refactor(<scope>): descripción
fix(<scope>): descripción
chore: descripción
```

Scope: nombre del archivo principal modificado sin extensión (ej. `useProducts`, `ProductListScreen`).
