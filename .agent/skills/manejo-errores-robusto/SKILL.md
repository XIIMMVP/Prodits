---
name: manejo-errores-robusto
description: Establece un sistema determinista y elegante para capturar, registrar y recuperar la aplicación de errores inesperados. Úsala al integrar APIs, promesas y componentes clave.
---

# Manejo Robusto de Errores y Resiliencia

## Cuándo usar esta habilidad
- Al escribir lógica de conexión de redes (Fetch, Axios, WebSockets).
- Al interactuar con el Service Worker, bases de datos locales o APIs asíncronas.
- Al construir la capa principal de componentes de la UI.

## Instrucciones paso a paso
1. **Bloques Try/Catch Explícitos**: Envuelve todas las llamadas asíncronas (`async/await`) en bloques `try/catch`. Nunca asumas que una petición de red será exitosa.
2. **Error Boundaries (Límites de Error)**: En interfaces basadas en componentes (React, etc), implementa "Error Boundaries" que capturen excepciones en el árbol de renderizado para evitar que toda la aplicación se rompa. Muestra un "Fallback UI" (interfaz alternativa amigable) con un botón para reintentar.
3. **Gestión de Respuestas Fallidas (HTTP)**: Valida siempre el estado de la respuesta de una petición. Un servidor devolviendo un `404` o `500` no siempre lanza un error en librerías nativas como `fetch()`. Debes verificar `response.ok` explícitamente y lanzar (throw) errores personalizados.
4. **Degradación Elegante (Graceful Degradation)**: Si un servicio menor falla (ej. un widget del clima auxiliar), el resto de la aplicación primaria debe seguir funcionando sin interrupciones visuales críticas.

## Reglas y Convenciones
- **Evitar Errores Silenciosos**: Nunca atrapes un error con un bloque `catch` vacío (ej. `catch (e) {}`). Al menos, el error debe registrarse en la consola (o enviarse a tu servicio de logs remoto) e interactuar con la interfaz del usuario informándole del problema si su acción se vio bloqueada.
- **Tipado Estricto de Errores**: Define constantes o clases específicas para los tipos de errores (ej. `NetworkError`, `AuthenticationError`, `ValidationError`) para ejecutar flujos de recuperación específicos según el tipo de fallo.
