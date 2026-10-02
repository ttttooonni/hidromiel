# Hidromiel — V1

**Estado:** primera versión documental consolidada  
**Tipo:** aplicación web progresiva (PWA), local-first y sin backend  
**Publicación:** https://ttttooonni.github.io/hidromiel/  
**Repositorio:** https://github.com/ttttooonni/hidromiel

Hidromiel V1 reúne una guía de elaboración, un catálogo de recetas y un cuaderno para registrar lotes. Está diseñada para utilizarse desde el móvil o el ordenador y puede funcionar sin conexión después de cargar sus recursos.

> **Importante sobre las versiones:** V1 es la versión documental y funcional de referencia del proyecto. El número v9 de sw.js identifica únicamente la caché del service worker; no es el número de versión funcional de la aplicación.

## Funciones incluidas

- Inicio con resumen y acceso a las secciones.
- Tutorial de elaboración paso a paso.
- Catálogo de 22 recetas orientativas, con selector de volumen y levadura sugerida.
- Consejos ampliados para preparación, fermentación, solución de problemas, trasiego, embotellado y cata.
- Creación y seguimiento de lotes mediante siete etapas.
- Registro de densidades y datos de fermentación disponibles en la ficha del lote.
- Fotografías del proceso almacenadas en el dispositivo.
- Exportación e importación de copias de seguridad, incluidas las fotos en el formato compatible actual.
- Instalación como PWA y uso offline después de la primera carga.

Consulta la [guía de usuario V1](docs/GUIA_USUARIO_V1.md), la [documentación técnica V1](docs/DOCUMENTACION_TECNICA_V1.md) y el [registro de cambios](CHANGELOG.md).

## Estructura del repositorio

    index.html                        Interfaz, estilos y contenido de la guía
    app.js                            Lógica, recetas, lotes y copias de seguridad
    manifest.json                    Metadatos de instalación de la PWA
    sw.js                             Caché y funcionamiento offline
    icons/icon.svg                    Icono vectorial de la PWA
    docs/GUIA_USUARIO_V1.md           Manual de uso
    docs/DOCUMENTACION_TECNICA_V1.md  Arquitectura, datos y mantenimiento
    CHANGELOG.md                      Historial de cambios documentados
    README.md                         Presentación general del proyecto

## Privacidad y almacenamiento

La aplicación no necesita una cuenta ni un servidor para guardar los datos. Los registros permanecen en el navegador del dispositivo:

- Los datos de lotes se guardan en localStorage, clave hidromiel_lotes_v2.
- Las fotos se guardan en IndexedDB, base hidromiel-db, almacén fotos.
- No hay sincronización automática entre dispositivos. Para trasladar los datos, utiliza la copia de seguridad de la aplicación.
- Antes de borrar los datos del navegador, desinstalar el navegador o cambiar de dispositivo, crea una copia y comprueba que puedes importarla.

El nombre histórico de la clave de almacenamiento no determina la versión de la aplicación. No lo cambies sin una migración explícita, porque podrías dejar de encontrar los lotes existentes.

## Publicación en GitHub Pages

El sitio se publica desde la rama main y la raíz del repositorio. Tras un cambio de recursos, revisa sw.js y aumenta VERSION para renovar la caché de la PWA. La versión de caché puede avanzar independientemente de la versión documental V1.

## Elaboración responsable

Las cantidades, temperaturas y levaduras de las recetas son orientativas. Mide la densidad real del mosto, controla la fermentación y sigue las instrucciones del fabricante de cada levadura y nutriente. No embotelles mientras la fermentación siga activa o la densidad no esté estable. La aplicación es un cuaderno de apoyo y no sustituye las prácticas higiénicas ni las comprobaciones del elaborador.

## Alcance y limitaciones conocidas

- Los datos se guardan localmente y dependen del navegador y dispositivo.
- No existe cuenta de usuario ni sincronización remota.
- La disponibilidad offline depende de que la PWA se haya cargado y almacenado correctamente al menos una vez.
- La guía no sustituye las fichas técnicas de ingredientes, levaduras o productos de limpieza.

## Mantenimiento

Antes de publicar cambios:
1. Comprueba las pantallas principales en móvil y escritorio.
2. Crea una copia de seguridad de los datos de prueba y verifica la importación.
3. Comprueba que las fotos se conservan al exportar e importar una copia compatible.
4. Valida el JSON de manifest.json y los archivos del service worker.
5. Incrementa la versión de caché de sw.js cuando cambien los recursos cacheados.
6. Actualiza CHANGELOG.md y la documentación si cambia el comportamiento de la aplicación.
