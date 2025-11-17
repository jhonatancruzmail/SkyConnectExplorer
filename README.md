# SkyConnect Explorer

Aplicación web para explorar y buscar información de aeropuertos, construida con Next.js 16, React 19 y TypeScript.

## 🚀 Inicio rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (copiar .env.example a .env.local)
AVIATIONSTACK_API_KEY=tu_api_key
NEXT_PUBLIC_USE_MOCK_DATA=false

# Ejecutar en desarrollo
npm run dev
```

<span style="color: red;">IMPORTANTE:</span><br>
<span style="color: orange;">La primera vez que el servidor se inicia, la consulta inicial puede tardar 1–2 segundos. Esto ocurre porque el sistema carga y almacena en caché del servidor 10.000 aeropuertos en una sola llamada a la API externa. Esta estrategia reduce drásticamente los costos de API y mejora el rendimiento, ya que todas las búsquedas posteriores se realizan sobre datos en memoria sin necesidad de nuevas llamadas externas.</span><br>
<span style="color: green;">Este proceso ocurre solo una vez por reinicio del servidor. Después de esa carga inicial, todas las peticiones (incluso de múltiples usuarios simultáneos) utilizan el caché del servidor, por lo que los resultados serán instantáneos sin generar costos adicionales de API. Para más detalles sobre esta decisión arquitectónica, consulta la sección <strong>"1. Sistema de cache en 3 capas"</strong> más abajo.</span>

## 🏗️ Arquitectura y decisiones técnicas

### Características destacadas

#### 1. Sistema de cache en 3 capas

**Problema**: Las APIs externas como Aviationstack cobran por cada llamada. Si el sistema creciera y cada usuario hiciera múltiples búsquedas, los costos se dispararían rápidamente. Además, cada llamada genera latencia y consume recursos del servidor.

**Solución**: Implementé un sistema de cache en 3 capas que minimiza drásticamente las llamadas a la API, reduciendo costos y mejorando el rendimiento:

**a) Client Cache (localStorage)** - 24h

- Verifico primero si hay datos en localStorage antes de hacer cualquier fetch
- Los usuarios que regresan no generan costos adicionales durante 24 horas
- Respuestas instantáneas sin tocar el servidor

**b) Server Cache (memoria)** - `serverCache.ts`

- Cargo 10,000 aeropuertos una sola vez en la primera petición a `/api/airports`
- Todas las peticiones subsecuentes usan el cache, sin costos adicionales
- Uso una Promise compartida para prevenir múltiples llamadas simultáneas
- Si hay una carga en progreso, las otras peticiones esperan a que termine
- Fallback a mock data si no hay API key (solo en desarrollo)

**c) Store (Zustand)** - Memoria del cliente

- Mantengo `allAirports` y `filteredAirports` en memoria
- Cuando cambia el query, filtro directamente en el store sin nuevas peticiones
- Cada búsqueda del usuario es gratuita, sin costos de API

**Flujo:**

```
Usuario → Store → localStorage → /api/airports → Server Cache → Aviationstack API
```

**Resultado**: Una sola llamada a la API externa por instancia del servidor, independientemente de cuántos usuarios o búsquedas haya. Esto significa que si el sistema creciera a miles de usuarios, los costos de API se mantendrían constantes, no escalarían con el uso.

#### 2. Filtrado en el cliente

**Problema**: Aviationstack no permite hacer búsquedas (search) en su plan gratuito sin paginación. Para hacer búsquedas necesitaría pagar o hacer múltiples requests paginadas, lo cual es costoso y lento.

**Solución**: Cargo todos los aeropuertos (10,000) una vez en el servidor y filtro en el cliente. Esto me permite:

- Búsquedas instantáneas sin límites de paginación
- No depender de la funcionalidad de búsqueda de la API
- Control total sobre la lógica de filtrado
- Sin costos adicionales por cada búsqueda

**Trade-off**: La carga inicial de 10,000 aeropuertos puede ser lenta la primera vez, y si el servidor se reinicia, hay que volver a cargar todo. Sin embargo, esto es aceptable porque los aeropuertos son datos relativamente estáticos que no cambian frecuentemente, y el cache del servidor persiste durante toda la vida del proceso.

#### 3. Reuso de componentes con animaciones fluidas

**Problema**: Necesitaba usar la misma barra de búsqueda en dos o más páginas diferentes (inicio y búsqueda) con layouts distintos (vertical y horizontal), pero quería que la transición entre páginas fuera fluida y animada sin duplicar código.

**Solución**: Reutilicé el componente `SearchBar` usando `layoutId` de Framer Motion. El mismo componente se adapta a diferentes layouts y Framer Motion automáticamente crea una transición animada fluida entre páginas:

```typescript
// Mismo componente, diferentes layouts
<SearchBar layout="vertical" />   // Página de inicio
<SearchBar layout="horizontal" /> // Página de búsqueda
```

**Resultado**: Una sola barra de búsqueda reutilizable, animaciones automáticas entre estados sin manejar manualmente las transiciones.

### Estructura del proyecto

Decidí organizar el código por **features** en lugar de por tipo de archivo. Me parece más escalable y fácil de mantener, considero que el orden siempre es importante, y dado que es una prueba técnica, el código debe ser legible y fácil de entender:

```
src/
├── app/                    # Next.js App Router
│   ├── (airports)/         # Rutas: /search y /search/[id]
│   ├── api/airports/       # API route con server cache
│   └── page.tsx            # Página de inicio
│
├── features/airports/       # Feature completa
│   ├── api/                # Cliente de API externa
│   ├── components/        # Cards y listas
│   ├── hooks/              # useAirports
│   ├── services/           # Cache, transformación y filtrado
│   └── stores/             # Store Zustand
│
├── shared/                 # Componentes reutilizables
│   ├── components/         # SearchBar, Pagination, HeroTitle
│   └── utils/              # Utilidades de formateo
│
├── types/                   # Tipos TypeScript
└── data/                    # Mock data
```

La ventaja es que todo lo relacionado con "aeropuertos" está junto en `features/airports/`, y los componentes compartidos están separados en `shared/`. Esto hace que sea más fácil encontrar código y escalar el proyecto.

## 🎨 Stack tecnológico

- **Next.js 16** + **React 19** + **TypeScript**
- **Tailwind CSS 4** - Utility-first
- **Framer Motion** - Animaciones con `layoutId` para transiciones fluidas
- **Zustand** - Estado global ligero
- **Leaflet** - Mapas interactivos
- **Jest + React Testing Library** - Testing

## 🎯 Features

- Búsqueda por nombre, ciudad, país o código IATA
- Vista de lista con paginación
- Vista de detalle con tabs organizadas
- Mapa interactivo de ubicación
- Animaciones fluidas entre páginas
- Diseño responsive

## 📝 Variables de entorno

| Variable                    | Descripción              | Requerida       |
| --------------------------- | ------------------------ | --------------- |
| `AVIATIONSTACK_API_KEY`     | API key de Aviationstack | Sí (producción) |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Activar datos mock       | No              |

**Nota**: Los datos mock contienen solo un registro de ejemplo. No se incluye la base de datos completa de aeropuertos de Aviationstack por razones de tamaño del repositorio y para evitar que se use el mock de manera incorrecta.

## 🧪 Testing

Agregué tests unitarios para componentes clave. Por ejemplo, `SearchBar` tiene cobertura completa de sus funcionalidades. Ejecutar con `npm test`.

## ✅ Requisitos de la prueba técnica

| Requisito                                                                                    | Estado | Notas                                           |
| -------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------- |
| **Listado de aeropuertos**                                                                   |        |                                                 |
| Consumir la API de Aviationstack para obtener una lista de aeropuertos                       | ✅ Sí  | Integrado con sistema de cache en 3 capas       |
| Mostrar los resultados en una tabla paginada                                                 | ✅ Sí  | Implementado con cards y paginación             |
| Agregar un campo de búsqueda para filtrar por nombre o código del aeropuerto                 | ✅ Sí  | Búsqueda por nombre, ciudad, país o código IATA |
| **Detalles del aeropuerto**                                                                  |        |                                                 |
| Al hacer clic en un aeropuerto, navegar a una página de detalles                             | ✅ Sí  | Ruta `/search/[id]`                             |
| Mostrar información como nombre, código IATA/ICAO, ciudad, país y zona horaria               | ✅ Sí  | Información completa en tabs organizadas        |
| Usar Zustand para gestionar el estado de la API y el estado de carga                         | ✅ Sí  | Store completo con estado de carga y errores    |
| **Mapa con la ubicación del aeropuerto**                                                     |        |                                                 |
| Integrar un mapa (Leaflet con OpenStreetMap o Google Maps)                                   | ✅ Sí  | Leaflet con OpenStreetMap                       |
| Mostrar un marcador con la ubicación del aeropuerto en el mapa                               | ✅ Sí  | Marcador interactivo en la tab de ubicación     |
| **Arquitectura y buenas prácticas**                                                          |        |                                                 |
| Código modular y organizado (separar servicios de API, lógica de estado y UI)                | ✅ Sí  | Estructura por features con separación clara    |
| Buen uso de Next.js para SSR o ISR donde sea necesario                                       | ✅ Sí  | API routes con server cache                     |
| Estilización con Tailwind CSS                                                                | ✅ Sí  | Tailwind CSS 4 con utilidades personalizadas    |
| **Testing**                                                                                  |        |                                                 |
| Agregar pruebas unitarias con Jest + React Testing Library para al menos un componente clave | ✅ Sí  | Tests completos para `SearchBar`                |
| **Bonus (opcional)**                                                                         |        |                                                 |
| Mejorar la UI con animaciones o transiciones suaves                                          | ✅ Sí  | Framer Motion con animaciones fluidas           |
| Agregar un historial de búsqueda almacenado en Zustand                                       | ❌ No  | No implementado                                 |
| Implementar Dark Mode                                                                        | ❌ No  | No implementado                                 |
| Pruebas de integración en Next.js para asegurar que la API se consume correctamente          | ❌ No  | Solo tests unitarios                            |
| Hacerlo Responsive                                                                           | ❌ No  | Se puede mejorar, es un to-do por hacer         |

## 📌 Uso de datos

Este proyecto **no incluye datos reales** de Aviationstack.  
Se utiliza únicamente un **mock ficticio con un solo aeropuerto**, creado para pruebas y para replicar la estructura de la API.

Los datos reales deben obtenerse mediante una **API key propia**.  
Este repositorio no almacena, distribuye ni publica información proveniente de Aviationstack ni contiene datasets.
