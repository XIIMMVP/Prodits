---
name: rendimiento-fluidez-web
description: Optimiza la carga de la página, el tamaño del bundle y la fluidez de renderizado para maximizar Core Web Vitals y retención de usuarios. Úsala al detectar lentitud o al diseñar páginas de alto tráfico.
---

# Rendimiento y Fluidez Web (60fps)

## Cuándo usar esta habilidad
- Al añadir bibliotecas externas pesadas.
- Al mostrar listas largas o contenido multimedia masivo.
- Cuando el objetivo central sea una experiencia "fluida y rápida" (como una App nativa).

## Instrucciones paso a paso
1. **Carga Diferida (Lazy Loading)**: Divide el código (Code Splitting). Carga componentes de UI complejos, rutas secundarias y scripts pesados de forma asíncrona solo cuando se necesiten (ej. `React.lazy()` + `Suspense`, o dynamic imports en JS vainilla). Imágenes y vídeos deben usar el atributo `loading="lazy"`.
2. **Optimización de Activos (Assets)**:
   - Usa formatos modernos para imágenes (WebP, AVIF) en lugar de PNG o JPEG pesados.
   - Especifica dimensiones explícitas (width, height) en imágenes para prevenir el "Cumulative Layout Shift" (CLS).
3. **Optimización del Renderizado (React/Frameworks)**: 
   - Previene re-renderizados innecesarios usando memoización solo donde las pruebas demuestren cuellos de botella (`React.memo`, `useMemo`, `useCallback`). 
   - Evita pasar funciones anónimas o objetos inline masivos como props a componentes hijos profundos si provocan re-renderizados costosos.
4. **Debounce y Throttle**: Funciones atadas a eventos frecuentes (scroll, resize, inputs de búsqueda en tiempo real) deben limitarse mediante técnicas de `debounce` o `throttle`.

## Reglas y Convenciones
- **Evitar Bloqueos del Hilo Principal (Main Thread)**: Mueve tareas computacionales intensivas a Web Workers o fracciona la ejecución usando `requestAnimationFrame` o `setTimeout` para no congelar la interfaz del usuario. La interfaz siempre debe poder responder en menos de 100ms.
