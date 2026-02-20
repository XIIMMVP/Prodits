---
name: setup-proyecto-web
description: Inicializa un proyecto web (Vite o Next.js) siguiendo convenciones modernas y mejores prácticas. Úsala al momento de iniciar la arquitectura de un nuevo proyecto desde cero.
---
# Setup de Proyecto Web

## Cuándo usar esta habilidad
- Cuando el usuario solicite crear una nueva aplicación web o front-end.
- Cuando se deba establecer la estructura inicial de carpetas y dependencias de UI/Lógica.

## Instrucciones paso a paso
1. Confirmar el stack tecnológico (Vite vs Next.js) y si se prefiere Vanilla CSS o TailwindCSS (prefiere Vanilla por defecto si no hay petición explícita, a menos que se indique otra cosa).
2. Si se utiliza Vite o Next.js, usar el comando `npx` con la bandera `-y` indicando la inicialización en la carpeta (`./`). Ejecuta el comando de framework siempre primero con la bandera `--help` para revisar las opciones y asegurarte de ejecutarlo en modo NO interactivo.
3. Crear o actualizar la arquitectura de estilos fundacional (modificando `index.css` o equivalentes y definiendo un `design system` inicial de tokens).

## Reglas y Convenciones
- Utilizar scripts de inicio locales como `npm run dev` sin compilar a producción inmediatamente a menos que el usuario lo solicite.
- Asegurar de no utilizar componentes irrelevantes de las plantillas por defecto. Limpia los archivos como `App.jsx` o `page.tsx` para dejarlos limpios.
