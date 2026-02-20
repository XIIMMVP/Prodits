---
name: codigo-limpio-arquitectura
description: Aplica principios de Clean Code, SOLID y arquitectura modularizada al desarrollar lógica de negocio o componentes. Úsala para asegurar mantenibilidad y escalabilidad del código.
---

# Código Limpio y Arquitectura Premium

## Cuándo usar esta habilidad
- Al escribir nuevas funciones, clases o componentes de UI.
- Al refactorizar código existente (deuda técnica).
- Cuando el usuario solicite un desarrollo mantenible, "limpio" o "profesional".

## Instrucciones paso a paso
1. **Nombres Descriptivos**: Nombra variables, funciones y clases de forma que revelen su intención sin necesidad de comentarios. Evita abreviaturas crípticas (ej. usa `userData` en lugar de `ud`). Las funciones deben sonar como verbos (ej. `fetchUserData`).
2. **Principio de Responsabilidad Única (SRP)**: Cada función, módulo o componente debe hacer exactamente una cosa y hacerla bien. Si un componente de React gestiona estado complejo, peticiones de red y UI, sepáralo en hooks personalizados, utilidades y componentes visuales puros.
3. **Evitar Números y Strings Mágicos**: Extrae constantes litelares a variables auto-explicativas en un archivo de configuración o constantes dedicado (ej. `const MAX_RETRIES = 3`).
4. **DRY (Don't Repeat Yourself)**: Extrae cualquier lógica duplicada a funciones de utilidad o componentes compartidos.

## Reglas y Convenciones
- **Sin Comentarios Obvios**: El código debe ser autodescriptivo. Escribe comentarios solo para explicar el "POR QUÉ" detrás de una decisión técnica no trivial, no el "QUÉ".
- **Early Returns**: En lugar de anidar múltiples `if/else`, retorna temprano si las pre-condiciones no se cumplen. Esto reduce la carga cognitiva y aplana el código.
- **Inmutabilidad**: Prefiere estructuras de datos inmutables y métodos que no muten el objeto original (ej. `map()`, `filter()`, spread syntax) frente a mutaciones directas.
