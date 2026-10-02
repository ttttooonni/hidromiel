# Hidromiel — guía y cuaderno de lotes

PWA de una sola vista con navegación por pestañas (hash routing): Inicio, Tutorial, Recetas, Consejos y Mis lotes. Sin build, sin dependencias externas, funciona offline una vez cargada la primera vez.

## Estructura

```
index.html      → estructura + estilos + contenido (tutorial, recetas, consejos)
app.js          → routing, CRUD de lotes en localStorage, cálculo de ABV, export/import
manifest.json   → metadatos de instalación
sw.js           → cache offline versionada
icons/          → iconos de la PWA
.nojekyll       → evita que GitHub Pages ignore archivos con "_"
```

## Desplegar en GitHub Pages

1. Sube esta carpeta a un repo (rama `main`).
2. Activa GitHub Pages apuntando a la raíz de `main`.
3. Listo — la app carga en `https://<usuario>.github.io/<repo>/`.

## Cómo subir de versión (importante)

Cada vez que cambies `index.html`, `app.js`, `manifest.json` o los iconos:

1. Abre `sw.js`.
2. Sube el número de `VERSION` (`'v1'` → `'v2'`, etc.).
3. Haz commit y push.

Al cambiar `VERSION`, el service worker crea una cache nueva, copia los archivos actualizados y borra las cachés viejas — así quien tenga la app instalada recibe la versión nueva automáticamente, sin perder sus lotes guardados (los lotes viven en `localStorage`, no en la cache del service worker).

Si **no** subes `VERSION`, los usuarios seguirán viendo la versión antigua cacheada.

## Datos de los lotes y fotos

- Los **datos** de cada lote (fecha, receta, densidades, pasos marcados, notas) se guardan en `localStorage` bajo la clave `hidromiel_lotes_v2`.
- Las **fotos** del proceso se guardan aparte, en IndexedDB (`hidromiel-db` / almacén `fotos`), porque localStorage no aguanta bien datos binarios grandes. Cada foto se redimensiona a 1000px de lado máximo y se comprime a JPEG antes de guardarse, para no llenar el dispositivo.
- **Exportar/Importar JSON** solo mueve los datos del lote, no las fotos — las fotos son propias de cada dispositivo. Si cambias de móvil, tendrás que volver a añadirlas.
- Todo vive en el dispositivo — no hay servidor ni sincronización, igual que el resto de tus apps.

## Recetas guiadas

Cada receta en la pestaña "Recetas" tiene sus propios 7 pasos (`RECETAS` en `app.js`). Al pulsar "Seguir este proceso" se crea un lote nuevo con esos pasos vacíos, y te lleva directo a "Mis lotes" con el proceso abierto para que vayas marcando pasos y adjuntando fotos.

## Sobre las imágenes

Las ilustraciones genéricas (iconos, gotas) son propias, en SVG, para no depender de fotos de stock de terceros sin licencia clara. Si quieres fotos reales en las secciones de Tutorial/Recetas, la vía correcta es usar imágenes con licencia libre (Pexels, Unsplash, Pixabay) y añadirlas tú a mano en `index.html`, o mejor aún, tus propias fotos del proceso.

## Pendiente para próximas versiones

- Si se quiere sincronizar entre dispositivos (datos y fotos), habría que añadir backend — de momento es intencionadamente local.


## Hidromiel 2.0 — actualización inicial

- Panel de inicio con resumen de lotes activos, pasos pendientes y elaboraciones recientes.
- Escalador de recetas por volumen objetivo, calculado desde la base de 5 litros.
- Registro de mediciones de densidad y gráfica de evolución en cada lote.
- Copias de seguridad JSON que incluyen las fotografías almacenadas en IndexedDB.
- Importación validada y compatible con exportaciones antiguas en formato de array.
- Estimación de ABV validada para evitar resultados absurdos con densidades inválidas.
- Manifiesto de instalación e icono SVG añadidos para completar los recursos referenciados por la PWA.
- Caché offline incrementada a `v5`.

La aplicación continúa siendo local-first: los datos permanecen en el dispositivo y no se sincronizan automáticamente entre dispositivos.


## Catálogo ampliado de recetas y levaduras

La biblioteca de la PWA incluye 22 fórmulas orientativas: tradicionales de distintos perfiles, hydromel ligero, alta densidad, melomeles de frutas, cyser, pyment, metheglin, bochet, bochetomel, braggot, hidromiel lupulada, café/cacao y roble.

Cada ficha muestra cantidades base de miel y agua para 5 L, ingrediente o técnica complementaria, dificultad, temperatura orientativa y una levadura sugerida. El selector de volumen escala miel y agua; las cantidades de frutas, especias y otros complementos se muestran como referencia por 5 L y deben escalarse proporcionalmente. La densidad real del mosto debe medirse siempre.

El formulario de lotes incluye un catálogo de levaduras enológicas y específicas para hidromiel: Lalvin EC-1118, 71B, K1-V1116, QA23, ICV-D47, SafMead Classic y SafMead Twist; también SafAle US-05 para estilos híbridos como braggot. La ficha del fabricante vigente prevalece sobre cualquier recomendación general de la aplicación.

La PWA continúa sin backend, con almacenamiento local y funcionamiento offline. Caché actual: `v7`.
