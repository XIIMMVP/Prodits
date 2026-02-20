---
name: seguridad-web-premium
description: Implementa prácticas de seguridad estrictas (OWASP) para proteger la aplicación contra vulnerabilidades como XSS, inyecciones y fugas de datos. Úsala en formularios, peticiones a APIs y manejo de estado sensible.
---

# Seguridad Web Premium

## Cuándo usar esta habilidad
- Al procesar entradas del usuario (formularios, parámetros URL, búsquedas).
- Al manejar autenticación, tokens o datos sensibles (PII).
- Al establecer la configuración general de directivas de seguridad (Headers de la aplicación).

## Instrucciones paso a paso
1. **Validación y Sanitización Estricta (Input)**: NUNCA confíes en los datos del cliente. Toda entrada debe ser validada contra un esquema estricto (tipos, longitud, formato esperado). Si se recibe HTML o Markdown, debe ser sanitizado usando librerías especializadas (como DOMPurify) antes de renderizarse para evitar XSS (Cross-Site Scripting).
2. **Protección de Secretos**: Asegúrate de que API Keys, tokens y URLs de base de datos se almacenen *únicamente* en variables de entorno (ej. `.env`) y nunca estén expuestos en el código fuente del cliente (frontend bundles).
3. **Manejo Seguro de Sesiones**: Si se usan tokens (JWT), prefiere cookies `HttpOnly`, `Secure` y `SameSite=Strict` sobre el almacenamiento en `localStorage` o `sessionStorage` para mitigar ataques XSS que intenten robar credenciales.
4. **Resilience against CSRF**: Si aplica, asegúrate de implementar tokens CSRF o usar cookies `SameSite` adecuadamente en todas las peticiones con estado que muten datos (POST, PUT, DELETE).

## Reglas y Convenciones
- **Falla de forma segura (Fail Securely)**: Si ocurre un error de seguridad o validación, deniega el acceso por defecto.
- **Mensajes de Error Genéricos en Producción**: No reveles "stack traces" o información técnica del servidor al usuario final. Registra el detalle en los logs internos, pero muestra un mensaje genérico ("Error interno") al cliente.
