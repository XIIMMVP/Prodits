---
name: optimizacion-seo
description: Enriquece la aplicación con atributos de SEO y mejores prácticas (meta etiquetas, jerarquía y etiquetas semánticas). Úsala al finalizar maquetaciones de páginas que deben ser indexadas.
---
# Optimización de SEO y Semántica HTML

## Cuándo usar esta habilidad
- Cuando se finalice la estructura visual de una vista importante, plantilla principal o página pública visible.
- Cuando el usuario mencione que busca favorecer motores de búsqueda (Google, Edge, Bing) u open graph en general.

## Instrucciones paso a paso
1. **Title y Description**: Garantiza de que en la cabecera `<head>` haya un título descriptivo y adecuado con la vista en cuestión, y su correspondiente `<meta name="description" content="...">`.
2. **Jerarquía HTML (Headings)**: Reestructura todo el documento buscando que haya **un único `<h1/>` por página**. Jerarquiza los siguientes subniveles estrictamente (no saltes de `h2` a `h4`).
3. **Estructura Semántica Correcta**: Intercambia los elementos `<div>` que rodeen contenidos por sus respectivas etiquetas HTML5: usa `<main>`, `<article>`, `<section>`, `<aside>`, `<nav>` y `<footer>` según lo que el bloque represente verdaderamente.
4. **IDs unívocos**: Todos los controles interactivos y modales importantes necesitan etiquetas descriptivas para automatizaciones y navegación `id="ejemplo-identificador-unívoco"`. 

## Reglas y Convenciones
- El SEO es fundamental. Siempre aplícalo implícitamente sin esperar que el usuario lo solicite, de esa forma aportarás un rendimiento profesional.
- Ten en cuenta usar correctamente el atributo "alt" para todas las imágenes con el fin de fortalecer los pilares de accesibilidad también.
