---
name: creador-de-habilidades
description: Crea nuevas habilidades (skills) para el agente en el entorno de trabajo actual siguiendo el estándar de Google Antigravity. Úsala cuando el usuario pida crear una nueva habilidad o un "skill".
---

# Creador de Habilidades

Esta habilidad define el procedimiento exacto para crear e implementar nuevas habilidades (skills) de agente en el espacio de trabajo. 

## Cuándo usar esta habilidad

- Cuando el usuario solicite explícitamente "crear una habilidad", "create a skill", o "añadir una nueva capacidad".
- Cuando identifiques un patrón repetitivo en el flujo de trabajo que se beneficiaría de ser convertido en una habilidad reutilizable, y el usuario acepte crearla.

## Reglas Estructurales de una Habilidad

1. **Ubicación**: Las habilidades específicas del proyecto deben residir en `<workspace-root>/.agent/skills/<nombre-de-la-habilidad>/`.
2. **Archivo Principal**: Cada habilidad requiere obligatoriamente un archivo llamado `SKILL.md` dentro de su respectiva carpeta.
3. **Frontmatter (Metadatos)**: El archivo `SKILL.md` debe iniciar con un bloque de metadatos YAML.
   - `name`: (Opcional pero recomendado) Nombre único, en minúsculas y separado por guiones.
   - `description`: (Obligatorio) Descripción clara, en tercera persona, de qué hace y cuándo debe activarse. ¡Esta es la clave para que el agente descubra la habilidad en el futuro! Incluye palabras clave relevantes.
4. **Directorios Opcionales**:
   - `scripts/`: Para scripts auxiliares que el agente pueda ejecutar.
   - `examples/`: Para implementaciones de referencia.
   - `resources/`: Para assets o plantillas.

## Cómo crear una nueva habilidad (Paso a Paso)

1. **Definir el Alcance**: Aclara con el usuario cuál es el objetivo principal de la nueva habilidad y bajo qué escenario exacto deberá ser utilizada por el agente.
2. **Determinar Metadatos**: Elige un `name` adecuado (ej. `generador-de-tests`) y redacta una `description` muy precisa que sirva de "gatillo" (trigger) para el agente.
3. **Crear el Archivo**: Utiliza la herramienta `write_to_file` para crear directamente el archivo `.agent/skills/<nombre-de-habilidad>/SKILL.md`. (Esta herramienta creará las carpetas padre automáticamente).
4. **Redactar el Contenido**:
   - Agrega el bloque YAML superior.
   - Agrega el título `# Nombre de la Habilidad`.
   - Incluye una sección `## Cuándo usar esta habilidad` para darle más contexto al agente.
   - Incluye una sección `## Instrucciones / Cómo usarla` con un paso a paso detallado, enumerando las reglas de negocio, comandos a ejecutar o flujos lógicos requeridos.
5. **Configurar Scripts (si aplica)**: Si la habilidad requiere ejecución de código, crea los scripts en `.agent/skills/<nombre>/scripts/` e indica en el `SKILL.md` que el agente debe ejecutarlos (asegurando que les dé permisos de ejecución si es un bash script, o describiendo cómo invocarlos).
6. **Confirmación**: Informa al usuario que la habilidad está lista, cómo está estructurada y en qué futuros prompts el agente la detectará automáticamente.

## Plantilla Base para `SKILL.md`

Puedes utilizar esta estructura base al crear el archivo:

```markdown
---
name: nombre-de-la-habilidad
description: Breve descripción en tercera persona. Describe qué hace y cuándo debe activarse. Usa palabras clave.
---

# Título de la Habilidad

[Introducción breve del propósito de la habilidad]

## Cuándo usar esta habilidad
- [Condición 1]
- [Condición 2]

## Instrucciones paso a paso
1. [Paso 1...]
2. [Paso 2...]

## Reglas y Convenciones
- [Regla 1 que el agente nunca debe romper]
- [Regla 2]
```
