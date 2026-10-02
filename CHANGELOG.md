# Registro de cambios — Hidromiel V1

Este archivo resume los cambios documentados de la aplicación. La etiqueta V1 identifica la línea funcional/documental de referencia; el número de caché del service worker es independiente.

## V1 — Documentación consolidada

- README reorganizado como punto de entrada del proyecto.
- Añadida guía de usuario en español.
- Añadida documentación técnica de arquitectura, almacenamiento local, copias y publicación.
- Unificadas las referencias de versión para evitar presentar Hidromiel 2.0 o las cachés v5/v7 como versiones documentales actuales.
- Documentado que la caché técnica actual identificada en sw.js es v9.
- Documentados el catálogo de 22 recetas, la gestión de lotes, las fotografías y el uso offline.
- Añadidas precauciones de copia de seguridad y de elaboración responsable.
- Ampliada la sección Consejos con preparación, control de fermentación, nutrientes, oxígeno, trasiego, embotellado seguro, especias y resolución de problemas.
- Actualizada la caché offline a v10 para distribuir los nuevos contenidos.

## Funciones descritas en la línea V1

- PWA estática sin backend ni proceso de compilación.
- Tutorial, consejos y catálogo de recetas orientativas.
- Seguimiento de lotes y etapas de elaboración.
- Registro local de datos y fotografías.
- Exportación/importación de copias de seguridad.
- Instalación y caché para uso offline.

## Nota de verificación

El registro describe los archivos y el alcance documental revisados. No sustituye una prueba funcional completa en navegador; las comprobaciones de publicación deben ejecutarse siguiendo la lista de la documentación técnica.


## Actualización visual — v13

- Fotografía diferenciada en portada, Tutorial, Recetas, Consejos y Mis lotes.
- Ajustes del manifiesto PWA y actualización de la caché a v13.
- Las fotografías proceden de servicios externos y se almacenan en caché tras cargarse; no se consideran archivos locales del repositorio.


## Cierre de auditoría visual — v14

- Eliminadas las dependencias de imágenes externas de la interfaz principal.
- Portada y secciones apuntan a recursos visuales del repositorio.
- Actualizada la caché del service worker a v14.
- Se mantiene el icono SVG compatible; los iconos PNG dedicados quedan pendientes de generación y prueba en dispositivo.
