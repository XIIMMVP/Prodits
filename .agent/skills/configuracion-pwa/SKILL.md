---
name: configuracion-pwa
description: Transforma la aplicación web en una PWA (Progressive Web Application). Úsala para añadir manifest, iconografía y un Service Worker que soporte el modo offline y la instalabilidad.
---
# Configuración PWA (Progressive Web App)

## Cuándo usar esta habilidad
- Al convertir una web estándar del entorno actual en una Aplicación Web Progresiva.
- Cuando el usuario pida explícitamente que la aplicación deba "funcionar offline", "guardarse en la pantalla de inicio del móvil" o "PWA".

## Instrucciones paso a paso
1. **Manifest Web App**: Crear en la carpeta pública del framework web un archivo `manifest.json` (incluyendo nombre corto, descripción, arrastre de dependencias y arreglo de iconos). Configurar un tema de color y color de fondo uniformes con el diseño Premium.
2. **Service Worker**: Crear e implementar la lógica de un `service-worker.js` (o usando un plugin/dependencia como `vite-plugin-pwa` si se está en Vite o `next-pwa` en Next). Éste se encargará de gestionar el caché de las rutas principales, archivos CSS, JS e imágenes clave de la aplicación.
3. **Página Offline**: Preparar o proveer una ruta o vista de reserva clara ("Offline") en el Service Worker, por si el usuario pierde conexión y entra a un lugar sin cachear.
4. **Registro en la App Principal**: Incluir el bloque de JavaScript necesario (en `index.html`, `main.jsx` o equivalente) que se encarga de registrar el service worker si `serviceWorker` existe dentro de la interfaz `navigator`.

## Reglas y Convenciones
- El caché PWA en entorno local (dev) puede ser conflictivo, maneja condicionales lógicas si es necesario.
- Los iconos para el manifest deben estar debidamente especificados en distintos resoluciones para satisfacer las guías de auditoría PWA como en Chrome Lighthouse.
