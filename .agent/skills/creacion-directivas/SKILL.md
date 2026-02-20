---
name: creacion-directivas
description: Aplica el proceso oficial para redactar o actualizar un archivo de Directiva/SOP en el directorio 'directivas'. Úsala para documentar procesos nuevos, aprendizajes o reglas recurrentes de arquitectura según la Memoria Viva de este usuario.
---
# Creación y Redacción de Directivas

## Cuándo usar esta habilidad
- Cuando empieces un flujo nuevo, crees un script automatizado, diseñes un proceso de base de datos repetitivo que deba documentarse firmemente bajo el estándar de "Directivas".
- Al haber descubierto y solucionado un "Edge Case" (caso borde) o error complicado durante la ejecución de los componentes/scripts, con el fin de guardar tu "Memoria Viva" de lo aprendido y no repetirlo en el futuro.

## Instrucciones paso a paso
1. Revisa o toma como referencia obligatoria la plantilla en `directivas/directiva_ejemplo.md`.
2. Crea una copia de ésta en el directorio `/directivas` asignándole un nombre descriptivo (ej: `directivas/flujo_registro_usuarios.md`).
3. Define estrictamente en la sección "I/O (Entradas/Salidas)" qué inputs espera (variables de entorno, estado o variables) y qué formato saldrá (JSON, base de datos expuesta, boolean, etc.).
4. Construye el diagrama textual (algorítmico) del "Flujo Lógico"; esto es sólo paso a paso enumerado de qué ocurre y no código técnico explícito. Se prioriza un alto nivel de negocio.
5. Registra o inicializa la porción de "Restricciones y Casos Bordes" y la Tabla/Bitácora de "Protocolo de Errores" preparados para cualquier iteración. 

## Reglas y Convenciones
- **OBLIGATORIO**: Si al desarrollar para el usuario se rompe algo del desarrollo, lo solucionas y es un descubrimiento nuevo; tu deber primario como Agente es actualizar la Directiva con lo que arreglaste, alimentando la _Memoria Viva_. 
- _"Primero arregla el código, pero el segundo paso siempre es actualizar este documento"._
