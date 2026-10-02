# Documentación técnica — Hidromiel V1

## 1. Resumen de arquitectura

Hidromiel V1 es una PWA estática, escrita en JavaScript sin proceso de compilación ni dependencias externas de ejecución. GitHub Pages sirve los archivos estáticos. La lógica de la aplicación se encuentra en app.js; la estructura, el contenido y los estilos se encuentran en index.html.

### Componentes

| Archivo | Responsabilidad |
|---|---|
| index.html | Interfaz, estilos, tutorial y contenido informativo |
| app.js | Navegación, catálogo de recetas, operaciones de lotes, cálculos y copias |
| manifest.json | Nombre, icono, alcance y parámetros de instalación |
| sw.js | Precarga de recursos, caché offline y limpieza de cachés anteriores |
| icons/icon.svg | Icono vectorial de la PWA |
| docs/GUIA_USUARIO_V1.md | Manual de uso |
| CHANGELOG.md | Cambios documentados |

## 2. Almacenamiento local

### Lotes

Los datos estructurados de los lotes se guardan en localStorage con la clave histórica hidromiel_lotes_v2. Esta clave debe considerarse parte del contrato de persistencia: renombrarla sin migración puede hacer que la aplicación no encuentre datos existentes.

### Fotos

Las fotos se guardan en IndexedDB, base hidromiel-db, almacén fotos. La aplicación reduce y comprime las imágenes antes de guardarlas para limitar el consumo de almacenamiento.

### Límites de persistencia

- Los datos no se envían a un backend.
- No hay sincronización automática entre navegadores o dispositivos.
- El borrado de datos del navegador puede eliminar lotes y fotografías.
- Las copias de seguridad deben exportarse y guardarse fuera del dispositivo.
- La compatibilidad de una copia depende del formato que entienda la versión importadora.

## 3. Catálogo de recetas y cálculos

El catálogo está definido en app.js mediante la estructura RECETAS. La aplicación contiene 22 fórmulas orientativas. La selección de receta permite generar una guía de pasos y ajustar las cantidades base que admite el formulario.

La graduación alcohólica mostrada es una estimación derivada de las densidades registradas. Debe validarse con mediciones reales; no representa un análisis de laboratorio.

Las recomendaciones de levaduras, temperaturas, nutrientes y tiempos son orientativas. La ficha técnica vigente del fabricante prevalece sobre la guía general.

## 4. Service worker y caché

El service worker define VERSION y construye el nombre de caché a partir de ese valor. En la versión documentada, la caché se identifica como v9. Este identificador técnico no cambia la etiqueta documental V1.

Cuando cambien archivos incluidos en la caché:
1. Incrementa VERSION en sw.js.
2. Comprueba que los recursos necesarios aparecen en ASSETS.
3. Publica los cambios en la rama main.
4. Abre la PWA y verifica que se carga la interfaz actualizada.
5. Confirma que los datos locales siguen disponibles.

El service worker elimina cachés anteriores al activarse. Los datos de lotes y las fotos están almacenados fuera de la caché de recursos, pero siempre conviene crear una copia antes de actualizar.

## 5. Instalación y publicación

La aplicación se publica como sitio estático en GitHub Pages desde la raíz del repositorio y la rama main. manifest.json declara el nombre, el idioma español, el alcance, el modo standalone y el icono SVG.

No se requiere instalación de paquetes ni compilación. Los cambios deben probarse en los navegadores objetivo, tanto con conexión como en modo offline.

## 6. Procedimiento de copia y recuperación

1. Exporta una copia desde la interfaz.
2. Guarda el archivo fuera del navegador.
3. Comprueba que el archivo existe y conserva una copia sin modificar.
4. Para restaurar, utiliza el importador de la aplicación.
5. Verifica lotes, mediciones y fotos después de importar.

No cambies las claves de almacenamiento, la estructura de las recetas o el formato de exportación sin contemplar compatibilidad hacia atrás o una migración explícita.

## 7. Lista de comprobación de publicación

- [ ] Inicio y navegación funcionan.
- [ ] Las 22 recetas aparecen y sus selectores se actualizan correctamente.
- [ ] Crear, consultar, editar y eliminar lotes se comporta según la interfaz disponible.
- [ ] Las mediciones y el cálculo estimado de graduación se validan con datos de prueba.
- [ ] Se pueden añadir y recuperar fotos.
- [ ] Exportar e importar una copia se prueba en un perfil de prueba.
- [ ] La importación de una copia antigua se comprueba con un archivo de ejemplo.
- [ ] La instalación PWA y el modo offline se prueban en móvil y escritorio.
- [ ] La consola del navegador no muestra errores bloqueantes.
- [ ] La versión de caché se incrementa cuando corresponda.

Esta lista es un plan de comprobación; no implica que todas las pruebas se hayan ejecutado en cada publicación.

## 8. Privacidad y seguridad

Los datos de elaboración son locales al dispositivo y al perfil de navegador. No se debe describir esta característica como una copia de seguridad automática. Protege los archivos exportados y evita compartirlos si contienen notas o información privada.

## 9. Alcance de V1

La documentación V1 describe la PWA existente sin añadir backend, cuentas ni sincronización remota. Las futuras ampliaciones deben documentarse por separado y no darse por disponibles hasta que estén implementadas y probadas.
