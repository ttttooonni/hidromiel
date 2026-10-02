// ---- Hidromiel PWA — app.js ----
// Sin build, sin dependencias externas.
// Lotes (datos) -> localStorage. Fotos (binarias) -> IndexedDB, porque
// localStorage no aguanta bien imágenes y se llenaría enseguida.

const STORAGE_KEY = 'hidromiel_lotes_v2';
const OPEN_LOTE_KEY = 'hidromiel_open_lote';
const VIEWS = ['inicio', 'tutorial', 'recetas', 'consejos', 'lotes'];
const STEP_TITLES = [
  'Preparar la miel',
  'Mezclar y medir (OG)',
  'Enfriar',
  'Inocular la levadura',
  'Fermentación primaria',
  'Trasiego y clarificación',
  'Embotellado y maduración',
];

// ---------- Recetas (datos + pasos para el asistente) ----------
const RECETAS = [
  {
    "id": "tradicional-seco",
    "tipo": "Tradicional seco",
    "nombre": "Tradicional seco",
    "resumen": "Clásica, seca y centrada en la miel",
    "miel": 1.25,
    "agua": 5,
    "levadura": "EC-1118",
    "extra": "Miel y agua",
    "temp": "18–22 °C",
    "difficulty": "Básica",
    "pasos": [
      "Desinfecta el equipo que estará en contacto con el mosto.",
      "Disuelve la miel en parte del agua y completa el volumen objetivo.",
      "Mide y anota la densidad inicial (OG) y la temperatura.",
      "Rehidrata e inocula la levadura siguiendo la ficha del fabricante.",
      "Controla temperatura y añade nutrientes según las instrucciones del producto.",
      "Registra densidad periódicamente; trasiega cuando proceda y la fermentación esté estable.",
      "Confirma estabilidad de densidad antes de embotellar; no embotelles durante fermentación activa."
    ]
  },
  {
    "id": "tradicional-semiseco",
    "tipo": "Tradicional semiseco",
    "nombre": "Tradicional semiseco",
    "resumen": "Base tradicional; el dulzor final depende de fermentación y estabilización",
    "miel": 1.35,
    "agua": 5,
    "levadura": "71B",
    "extra": "Miel y agua",
    "temp": "18–22 °C",
    "difficulty": "Básica",
    "pasos": [
      "Desinfecta el equipo que estará en contacto con el mosto.",
      "Disuelve la miel en parte del agua y completa el volumen objetivo.",
      "Mide y anota la densidad inicial (OG) y la temperatura.",
      "Rehidrata e inocula la levadura siguiendo la ficha del fabricante.",
      "Controla temperatura y añade nutrientes según las instrucciones del producto.",
      "Registra densidad periódicamente; trasiega cuando proceda y la fermentación esté estable.",
      "Confirma estabilidad de densidad antes de embotellar; no embotelles durante fermentación activa."
    ]
  },
  {
    "id": "tradicional-dulce",
    "tipo": "Tradicional dulce",
    "nombre": "Tradicional dulce",
    "resumen": "Más miel no garantiza dulzor residual; controlar densidad y estabilización",
    "miel": 1.75,
    "agua": 5,
    "levadura": "SafMead Classic",
    "extra": "Miel y agua",
    "temp": "18–22 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta el equipo que estará en contacto con el mosto.",
      "Disuelve la miel en parte del agua y completa el volumen objetivo.",
      "Mide y anota la densidad inicial (OG) y la temperatura.",
      "Rehidrata e inocula la levadura siguiendo la ficha del fabricante.",
      "Controla temperatura y añade nutrientes según las instrucciones del producto.",
      "Registra densidad periódicamente; trasiega cuando proceda y la fermentación esté estable.",
      "Confirma estabilidad de densidad antes de embotellar; no embotelles durante fermentación activa."
    ]
  },
  {
    "id": "hydromel",
    "tipo": "Hydromel ligero",
    "nombre": "Hydromel ligero",
    "resumen": "Menor concentración inicial para una bebida ligera",
    "miel": 0.9,
    "agua": 5,
    "levadura": "SafMead Classic",
    "extra": "Miel y agua",
    "temp": "18–22 °C",
    "difficulty": "Básica",
    "pasos": [
      "Desinfecta el equipo que estará en contacto con el mosto.",
      "Disuelve la miel en parte del agua y completa el volumen objetivo.",
      "Mide y anota la densidad inicial (OG) y la temperatura.",
      "Rehidrata e inocula la levadura siguiendo la ficha del fabricante.",
      "Controla temperatura y añade nutrientes según las instrucciones del producto.",
      "Registra densidad periódicamente; trasiega cuando proceda y la fermentación esté estable.",
      "Confirma estabilidad de densidad antes de embotellar; no embotelles durante fermentación activa."
    ]
  },
  {
    "id": "sack",
    "tipo": "Tradicional de alta densidad",
    "nombre": "Tradicional de alta densidad",
    "resumen": "Mosto concentrado; requiere nutrición y control cuidadoso",
    "miel": 2,
    "agua": 5,
    "levadura": "EC-1118",
    "extra": "Miel y agua",
    "temp": "16–20 °C",
    "difficulty": "Avanzada",
    "pasos": [
      "Desinfecta el equipo que estará en contacto con el mosto.",
      "Disuelve la miel en parte del agua y completa el volumen objetivo.",
      "Mide y anota la densidad inicial (OG) y la temperatura.",
      "Rehidrata e inocula la levadura siguiendo la ficha del fabricante.",
      "Controla temperatura y añade nutrientes según las instrucciones del producto.",
      "Registra densidad periódicamente; trasiega cuando proceda y la fermentación esté estable.",
      "Confirma estabilidad de densidad antes de embotellar; no embotelles durante fermentación activa."
    ]
  },
  {
    "id": "melomel-frutos-rojos",
    "tipo": "Melomel de frutos rojos",
    "nombre": "Melomel de frutos rojos",
    "resumen": "Frambuesa, mora o arándano",
    "miel": 1.25,
    "agua": 4.5,
    "levadura": "71B",
    "extra": "500–800 g de frutos rojos por 5 L",
    "temp": "18–22 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta el equipo y prepara fruta sana; registra su peso.",
      "Disuelve miel, completa con agua y mide la densidad inicial.",
      "Ajusta la temperatura al rango de la cepa elegida.",
      "Inocula según la ficha técnica de la levadura.",
      "Añade fruta según la receta y evita oxidación; usa bolsa apta si facilita retirar sólidos.",
      "Registra densidad y retira fruta/sedimento cuando corresponda; no te guíes solo por el burbujeo.",
      "Embotella solo con densidad estable y control de riesgo de refermentación."
    ]
  },
  {
    "id": "melomel-fresa",
    "tipo": "Melomel de fresa",
    "nombre": "Melomel de fresa",
    "resumen": "Fruta delicada; proteger de oxidación",
    "miel": 1.25,
    "agua": 4.5,
    "levadura": "71B",
    "extra": "600–900 g de fresa por 5 L",
    "temp": "18–22 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta el equipo y prepara fruta sana; registra su peso.",
      "Disuelve miel, completa con agua y mide la densidad inicial.",
      "Ajusta la temperatura al rango de la cepa elegida.",
      "Inocula según la ficha técnica de la levadura.",
      "Añade fruta según la receta y evita oxidación; usa bolsa apta si facilita retirar sólidos.",
      "Registra densidad y retira fruta/sedimento cuando corresponda; no te guíes solo por el burbujeo.",
      "Embotella solo con densidad estable y control de riesgo de refermentación."
    ]
  },
  {
    "id": "melomel-cereza",
    "tipo": "Melomel de cereza",
    "nombre": "Melomel de cereza",
    "resumen": "Perfil frutal intenso; no romper huesos",
    "miel": 1.3,
    "agua": 4.5,
    "levadura": "QA23",
    "extra": "500–800 g de cereza por 5 L",
    "temp": "16–22 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta el equipo y prepara fruta sana; registra su peso.",
      "Disuelve miel, completa con agua y mide la densidad inicial.",
      "Ajusta la temperatura al rango de la cepa elegida.",
      "Inocula según la ficha técnica de la levadura.",
      "Añade fruta según la receta y evita oxidación; usa bolsa apta si facilita retirar sólidos.",
      "Registra densidad y retira fruta/sedimento cuando corresponda; no te guíes solo por el burbujeo.",
      "Embotella solo con densidad estable y control de riesgo de refermentación."
    ]
  },
  {
    "id": "melomel-melocoton",
    "tipo": "Melomel de melocotón",
    "nombre": "Melomel de melocotón",
    "resumen": "Aromático y suave; fruta madura y sana",
    "miel": 1.25,
    "agua": 4.5,
    "levadura": "71B",
    "extra": "600–900 g de melocotón por 5 L",
    "temp": "18–22 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta el equipo y prepara fruta sana; registra su peso.",
      "Disuelve miel, completa con agua y mide la densidad inicial.",
      "Ajusta la temperatura al rango de la cepa elegida.",
      "Inocula según la ficha técnica de la levadura.",
      "Añade fruta según la receta y evita oxidación; usa bolsa apta si facilita retirar sólidos.",
      "Registra densidad y retira fruta/sedimento cuando corresponda; no te guíes solo por el burbujeo.",
      "Embotella solo con densidad estable y control de riesgo de refermentación."
    ]
  },
  {
    "id": "cyser",
    "tipo": "Cyser de manzana",
    "nombre": "Cyser de manzana",
    "resumen": "Hidromiel con zumo de manzana; contar sus azúcares",
    "miel": 1,
    "agua": 3.5,
    "levadura": "QA23",
    "extra": "1.5 L de zumo de manzana por 5 L",
    "temp": "16–22 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta el equipo y prepara fruta sana; registra su peso.",
      "Disuelve miel, completa con agua y mide la densidad inicial.",
      "Ajusta la temperatura al rango de la cepa elegida.",
      "Inocula según la ficha técnica de la levadura.",
      "Añade fruta según la receta y evita oxidación; usa bolsa apta si facilita retirar sólidos.",
      "Registra densidad y retira fruta/sedimento cuando corresponda; no te guíes solo por el burbujeo.",
      "Embotella solo con densidad estable y control de riesgo de refermentación."
    ]
  },
  {
    "id": "pyment",
    "tipo": "Pyment de uva",
    "nombre": "Pyment de uva",
    "resumen": "Miel y uva o mosto; ajustar agua al volumen final",
    "miel": 1,
    "agua": 3.5,
    "levadura": "EC-1118",
    "extra": "1.5 L de mosto de uva por 5 L",
    "temp": "18–24 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta el equipo y prepara fruta sana; registra su peso.",
      "Disuelve miel, completa con agua y mide la densidad inicial.",
      "Ajusta la temperatura al rango de la cepa elegida.",
      "Inocula según la ficha técnica de la levadura.",
      "Añade fruta según la receta y evita oxidación; usa bolsa apta si facilita retirar sólidos.",
      "Registra densidad y retira fruta/sedimento cuando corresponda; no te guíes solo por el burbujeo.",
      "Embotella solo con densidad estable y control de riesgo de refermentación."
    ]
  },
  {
    "id": "tropical",
    "tipo": "Melomel tropical",
    "nombre": "Melomel tropical",
    "resumen": "Mango, maracuyá o piña; medir acidez y densidad",
    "miel": 1.2,
    "agua": 4.5,
    "levadura": "K1-V1116",
    "extra": "500–800 g de fruta tropical por 5 L",
    "temp": "18–22 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta el equipo y prepara fruta sana; registra su peso.",
      "Disuelve miel, completa con agua y mide la densidad inicial.",
      "Ajusta la temperatura al rango de la cepa elegida.",
      "Inocula según la ficha técnica de la levadura.",
      "Añade fruta según la receta y evita oxidación; usa bolsa apta si facilita retirar sólidos.",
      "Registra densidad y retira fruta/sedimento cuando corresponda; no te guíes solo por el burbujeo.",
      "Embotella solo con densidad estable y control de riesgo de refermentación."
    ]
  },
  {
    "id": "citrico",
    "tipo": "Melomel cítrico",
    "nombre": "Melomel cítrico",
    "resumen": "Usar zumo y piel con moderación para evitar amargor",
    "miel": 1.25,
    "agua": 4.5,
    "levadura": "QA23",
    "extra": "Zumo y piel fina de cítrico al gusto",
    "temp": "16–22 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta el equipo y prepara fruta sana; registra su peso.",
      "Disuelve miel, completa con agua y mide la densidad inicial.",
      "Ajusta la temperatura al rango de la cepa elegida.",
      "Inocula según la ficha técnica de la levadura.",
      "Añade fruta según la receta y evita oxidación; usa bolsa apta si facilita retirar sólidos.",
      "Registra densidad y retira fruta/sedimento cuando corresponda; no te guíes solo por el burbujeo.",
      "Embotella solo con densidad estable y control de riesgo de refermentación."
    ]
  },
  {
    "id": "metheglin-canela",
    "tipo": "Metheglin de canela",
    "nombre": "Metheglin de canela",
    "resumen": "Especiado cálido; añadir poco a poco y catar",
    "miel": 1.25,
    "agua": 5,
    "levadura": "D-47",
    "extra": "Una rama pequeña de canela por 5 L, ajustar al gusto",
    "temp": "16–20 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta equipo y prepara una adición medida de especias.",
      "Disuelve miel, mezcla con agua y registra densidad inicial.",
      "Ajusta la temperatura al rango de la cepa seleccionada.",
      "Inocula siguiendo la ficha técnica.",
      "Controla temperatura y nutrición según el fabricante del nutriente.",
      "Añade o retira especias con catas pequeñas y registra cambios.",
      "Confirma estabilidad, clarifica y embotella de forma segura."
    ]
  },
  {
    "id": "metheglin-vainilla",
    "tipo": "Metheglin de vainilla",
    "nombre": "Metheglin de vainilla",
    "resumen": "Vainilla en secundaria; probar periódicamente",
    "miel": 1.25,
    "agua": 5,
    "levadura": "71B",
    "extra": "Media vaina por 5 L, al gusto",
    "temp": "18–22 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta equipo y prepara una adición medida de especias.",
      "Disuelve miel, mezcla con agua y registra densidad inicial.",
      "Ajusta la temperatura al rango de la cepa seleccionada.",
      "Inocula siguiendo la ficha técnica.",
      "Controla temperatura y nutrición según el fabricante del nutriente.",
      "Añade o retira especias con catas pequeñas y registra cambios.",
      "Confirma estabilidad, clarifica y embotella de forma segura."
    ]
  },
  {
    "id": "metheglin-jengibre",
    "tipo": "Metheglin de jengibre",
    "nombre": "Metheglin de jengibre",
    "resumen": "Jengibre fresco para un perfil cítrico y especiado",
    "miel": 1.25,
    "agua": 4.8,
    "levadura": "K1-V1116",
    "extra": "20–50 g de jengibre por 5 L, al gusto",
    "temp": "18–22 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta equipo y prepara una adición medida de especias.",
      "Disuelve miel, mezcla con agua y registra densidad inicial.",
      "Ajusta la temperatura al rango de la cepa seleccionada.",
      "Inocula siguiendo la ficha técnica.",
      "Controla temperatura y nutrición según el fabricante del nutriente.",
      "Añade o retira especias con catas pequeñas y registra cambios.",
      "Confirma estabilidad, clarifica y embotella de forma segura."
    ]
  },
  {
    "id": "bochet",
    "tipo": "Bochet",
    "nombre": "Bochet",
    "resumen": "Miel caramelizada; evitar quemarla",
    "miel": 1.5,
    "agua": 5,
    "levadura": "EC-1118",
    "extra": "Caramelizar parte de la miel con precaución",
    "temp": "18–22 °C",
    "difficulty": "Avanzada",
    "pasos": [
      "Calienta la miel en una olla amplia, vigilada y sin dejarla sola; está muy caliente y puede causar quemaduras graves.",
      "Disuelve la miel caramelizada con agua con extrema precaución para evitar salpicaduras; enfría y completa volumen.",
      "Mide densidad cuando el mosto esté homogéneo y a temperatura adecuada.",
      "Inocula según la ficha técnica de la levadura.",
      "Controla temperatura y nutrición; la miel caramelizada puede fermentar de forma diferente.",
      "Registra densidad, aroma y evolución; trasiega cuando corresponda.",
      "No embotelles hasta confirmar estabilidad y ausencia de fermentación activa."
    ]
  },
  {
    "id": "bochetomel",
    "tipo": "Bochetomel de frutos rojos",
    "nombre": "Bochetomel de frutos rojos",
    "resumen": "Miel caramelizada con fruta",
    "miel": 1.5,
    "agua": 4.5,
    "levadura": "71B",
    "extra": "400–700 g de frutos rojos por 5 L",
    "temp": "18–22 °C",
    "difficulty": "Avanzada",
    "pasos": [
      "Calienta la miel en una olla amplia, vigilada y sin dejarla sola; está muy caliente y puede causar quemaduras graves.",
      "Disuelve la miel caramelizada con agua con extrema precaución para evitar salpicaduras; enfría y completa volumen.",
      "Mide densidad cuando el mosto esté homogéneo y a temperatura adecuada.",
      "Inocula según la ficha técnica de la levadura.",
      "Controla temperatura y nutrición; la miel caramelizada puede fermentar de forma diferente.",
      "Registra densidad, aroma y evolución; trasiega cuando corresponda.",
      "No embotelles hasta confirmar estabilidad y ausencia de fermentación activa."
    ]
  },
  {
    "id": "braggot",
    "tipo": "Braggot de miel y malta",
    "nombre": "Braggot de miel y malta",
    "resumen": "Estilo híbrido que requiere macerado de malta",
    "miel": 0.8,
    "agua": 2.5,
    "levadura": "SafAle US-05",
    "extra": "1–1.5 kg de malta base por 5 L, maceración aparte",
    "temp": "18–22 °C",
    "difficulty": "Avanzada",
    "pasos": [
      "Macerar malta requiere una receta cervecera validada; controlar tiempo y temperatura.",
      "Filtra el mosto de malta, añade miel y ajusta al volumen final.",
      "Enfría al rango indicado por la cepa.",
      "Inocula según la ficha técnica.",
      "Controla densidad, temperatura e higiene.",
      "Mide densidad y deja madurar tras estabilizarse la fermentación.",
      "Envasa únicamente tras confirmar estabilidad y presión segura."
    ]
  },
  {
    "id": "hidromiel-lupulada",
    "tipo": "Hidromiel lupulada",
    "nombre": "Hidromiel lupulada",
    "resumen": "Aroma de lúpulo; controlar técnica y amargor",
    "miel": 1.25,
    "agua": 5,
    "levadura": "SafAle US-05",
    "extra": "2–8 g de lúpulo por 5 L, según variedad",
    "temp": "18–22 °C",
    "difficulty": "Avanzada",
    "pasos": [
      "Prepara mosto de miel y agua y registra densidad inicial.",
      "Usa una técnica de adición de lúpulo definida y cantidades pequeñas.",
      "Ajusta la temperatura e inocula la levadura.",
      "Controla temperatura y nutrición según ficha técnica.",
      "Evalúa aroma y amargor con catas pequeñas y registra las adiciones.",
      "Mide densidad y deja estabilizar la fermentación.",
      "Embotella solo con densidad estable y control de refermentación."
    ]
  },
  {
    "id": "cafe-cacao",
    "tipo": "Hidromiel de café y cacao",
    "nombre": "Hidromiel de café y cacao",
    "resumen": "Probar en pequeñas cantidades para evitar amargor excesivo",
    "miel": 1.25,
    "agua": 5,
    "levadura": "D-47",
    "extra": "Café frío o cacao en secundaria, al gusto",
    "temp": "16–20 °C",
    "difficulty": "Intermedia",
    "pasos": [
      "Desinfecta equipo y prepara una adición medida de especias.",
      "Disuelve miel, mezcla con agua y registra densidad inicial.",
      "Ajusta la temperatura al rango de la cepa seleccionada.",
      "Inocula siguiendo la ficha técnica.",
      "Controla temperatura y nutrición según el fabricante del nutriente.",
      "Añade o retira especias con catas pequeñas y registra cambios.",
      "Confirma estabilidad, clarifica y embotella de forma segura."
    ]
  },
  {
    "id": "hidromiel-roble",
    "tipo": "Hidromiel con roble",
    "nombre": "Hidromiel con roble",
    "resumen": "Maduración con roble enológico y catas frecuentes",
    "miel": 1.35,
    "agua": 5,
    "levadura": "D-47",
    "extra": "Roble enológico según fabricante",
    "temp": "16–20 °C",
    "difficulty": "Avanzada",
    "pasos": [
      "Desinfecta equipo y prepara una adición medida de especias.",
      "Disuelve miel, mezcla con agua y registra densidad inicial.",
      "Ajusta la temperatura al rango de la cepa seleccionada.",
      "Inocula siguiendo la ficha técnica.",
      "Controla temperatura y nutrición según el fabricante del nutriente.",
      "Añade o retira especias con catas pequeñas y registra cambios.",
      "Confirma estabilidad, clarifica y embotella de forma segura."
    ]
  }
];

// ---------- Routing por hash ----------
function currentView() {
  const hash = (location.hash || '#inicio').replace('#', '');
  return VIEWS.includes(hash) ? hash : 'inicio';
}

function renderRoute() {
  const view = currentView();
  document.querySelectorAll('section.view').forEach(sec => {
    sec.classList.toggle('active', sec.id === 'view-' + view);
  });
  document.querySelectorAll('nav.tabbar button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  window.scrollTo(0, 0);

  if (view === 'lotes') {
    const openId = sessionStorage.getItem(OPEN_LOTE_KEY);
    if (openId) {
      sessionStorage.removeItem(OPEN_LOTE_KEY);
      setTimeout(() => openStepsFor(openId), 50);
    }
  }
}
window.addEventListener('hashchange', renderRoute);
document.querySelectorAll('nav.tabbar button').forEach(btn => {
  btn.addEventListener('click', () => { location.hash = '#' + btn.dataset.view; });
});

// ---------- IndexedDB para fotos ----------
const DB_NAME = 'hidromiel-db', DB_VERSION = 1, STORE = 'fotos';
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => { req.result.createObjectStore(STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function savePhoto(key, dataUrl) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(dataUrl, key);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}
async function getPhoto(key) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => res(req.result || null);
    req.onerror = () => rej(req.error);
  });
}
async function deletePhoto(key) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}
async function getAllPhotos() {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const keysReq = store.getAllKeys();
    const valuesReq = store.getAll();
    tx.oncomplete = () => {
      const photos = {};
      keysReq.result.forEach((key, i) => { photos[String(key)] = valuesReq.result[i]; });
      res(photos);
    };
    tx.onerror = () => rej(tx.error);
  });
}
// Redimensiona/comprime la foto antes de guardarla (los móviles hacen fotos enormes)
function resizeImage(file, maxDim = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) { height *= maxDim / width; width = maxDim; }
        else if (height > maxDim) { width *= maxDim / height; height = maxDim; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------- Utilidades de datos ----------
function loadLotes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch (e) { console.error('No se pudieron leer los lotes guardados', e); return []; }
}
function saveLotes(lotes) { localStorage.setItem(STORAGE_KEY, JSON.stringify(lotes)); }

function calcABV(og, sg) {
  if (!Number.isFinite(og) || !Number.isFinite(sg) || og <= 0 || sg <= 0 || og <= sg) return null;
  // Estimación habitual; no sustituye un análisis de laboratorio.
  const abv = (og - sg) * 131.25;
  if (!Number.isFinite(abv) || abv < 0 || abv > 25) return null;
  return Math.round(abv * 10) / 10;
}
function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function emptyPasos() { return STEP_TITLES.map(() => ({ done: false, fecha: null })); }
function pasosTextos(lote) {
  const receta = RECETAS.find(r => r.tipo === lote.tipo || r.id === lote.recetaId);
  return receta ? receta.pasos : STEP_TITLES.map(t => t);
}
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// ---------- Recetas: render + arrancar proceso ----------
function renderRecetas() {
  const list = document.getElementById('recetas-list');
  const targetLitres = Math.min(100, Math.max(1, parseFloat(document.getElementById('recipe-volume')?.value) || 5));
  const scale = targetLitres / 5;
  list.innerHTML = RECETAS.map(r => `
    <div class="recipe">
      <div class="top-row">
        <div>
          <span class="tag">${escapeHtml(r.nombre.includes('(') ? r.nombre.split('(')[1].replace(')', '') : 'Para empezar')}</span>
          <h3>${escapeHtml(r.nombre)}</h3>
          <p style="margin:2px 0 0">${escapeHtml(r.resumen)}</p>
          <p class="recipe-quantities"><b>Para ${targetLitres} L:</b> ${(r.miel * scale).toFixed(2)} kg de miel · ${(r.agua * scale).toFixed(1)} L de agua</p>
          <p class="recipe-detail"><b>Levadura orientativa:</b> ${escapeHtml(r.levadura)} · <b>Temperatura:</b> ${escapeHtml(r.temp)}</p>
          <p class="recipe-detail"><b>Ingrediente / técnica adicional:</b> ${escapeHtml(r.extra)}</p>
          <p class="recipe-detail"><b>Dificultad:</b> ${escapeHtml(r.difficulty)}. Cantidades extra indicadas como referencia para 5 L; escala proporcionalmente y mide la densidad real.</p>
        </div>
        <svg class="illus" viewBox="0 0 24 24" fill="none" stroke="var(--honey)" stroke-width="1.5">
          <path d="M12 3c3 3 5 6 5 9a5 5 0 0 1-10 0c0-3 2-6 5-9z"/>
        </svg>
      </div>
      <div class="btn-row" style="margin-top:10px">
        <button class="btn small" data-start-receta="${r.id}">Seguir este proceso</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-start-receta]').forEach(btn => {
    btn.addEventListener('click', () => startReceta(btn.dataset.startReceta));
  });
}

function startReceta(id) {
  const receta = RECETAS.find(r => r.id === id);
  if (!receta) return;
  const lotes = loadLotes();
  const targetLitres = Math.min(100, Math.max(1, parseFloat(document.getElementById('recipe-volume')?.value) || 5));
  const scale = targetLitres / 5;
  const loteId = crypto.randomUUID();
  const n = lotes.filter(l => l.tipo === receta.tipo).length + 1;
  lotes.push({
    id: loteId,
    nombre: `${receta.nombre.split(' ')[0]}-${new Date().getFullYear()}-${String(n).padStart(2, '0')}`,
    fecha: new Date().toISOString().slice(0, 10),
    tipo: receta.tipo,
    recetaId: receta.id,
    ingredientesExtra: receta.extra,
    miel: Math.round(receta.miel * scale * 100) / 100,
    agua: Math.round(receta.agua * scale * 10) / 10,
    volumenObjetivo: targetLitres,
    levadura: ({'EC-1118':'Lalvin EC-1118','71B':'Lalvin 71B','K1-V1116':'Lalvin K1-V1116','QA23':'Lalvin QA23','D-47':'Lalvin ICV-D47','SafMead Classic':'SafMead Classic','SafMead Twist':'SafMead Twist','SafAle US-05':'SafAle US-05'})[receta.levadura] || receta.levadura,
    og: '', sg: '',
    estado: 'Fermentando',
    notas: '',
    pasos: emptyPasos(),
  });
  saveLotes(lotes);
  renderDashboard();
  sessionStorage.setItem(OPEN_LOTE_KEY, loteId);
  location.hash = '#lotes';
}

function densityChart(mediciones) {
  const values = (Array.isArray(mediciones) ? mediciones : [])
    .filter(m => Number.isFinite(Number(m.densidad)) && Number(m.densidad) > 0)
    .slice(-8);
  if (values.length < 2) return '<p class="chart-empty">Añade al menos dos mediciones para ver la evolución de la densidad.</p>';
  const nums = values.map(m => Number(m.densidad));
  const min = Math.min(...nums) - 0.002, max = Math.max(...nums) + 0.002;
  const span = Math.max(0.004, max - min);
  const points = nums.map((v, i) => {
    const x = 8 + i * (184 / (nums.length - 1));
    const y = 54 - ((v - min) / span) * 42;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return `<div class="density-chart"><svg viewBox="0 0 200 64" role="img" aria-label="Evolución de la densidad"><polyline points="${points}" fill="none" stroke="var(--honey)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${points.split(' ').map(p => { const [x,y]=p.split(','); return `<circle cx="${x}" cy="${y}" r="3" fill="var(--honey-light)"/>`; }).join('')}</svg><div class="chart-labels"><span>Primera</span><span>Última</span></div></div>`;
}

// ---------- Render de la lista de lotes ----------
const expandedSteps = new Set();

function renderLotes() {
  const lotes = loadLotes().sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  const list = document.getElementById('lotes-list');
  const empty = document.getElementById('lotes-empty');

  if (lotes.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = lotes.map(lote => {
    const pasos = lote.pasos && lote.pasos.length === 7 ? lote.pasos : emptyPasos();
    const done = pasos.filter(p => p.done).length;
    const abv = calcABV(parseFloat(lote.og), parseFloat(lote.sg));
    const mediciones = Array.isArray(lote.mediciones) ? lote.mediciones : [];
    const isOpen = expandedSteps.has(lote.id);

    return `
      <div class="lote-card" data-id="${lote.id}">
        <div class="top">
          <span class="name">${escapeHtml(lote.nombre || 'Sin nombre')}</span>
          <span class="status">${escapeHtml(lote.estado || 'Fermentando')}</span>
        </div>
        <dl>
          <dt>Fecha</dt><dd>${fmtDate(lote.fecha)}</dd>
          <dt>Tipo</dt><dd>${escapeHtml(lote.tipo || '—')}</dd>
          <dt>Miel / Agua</dt><dd>${lote.miel || '—'} kg / ${lote.agua || '—'} L</dd>
          <dt>Levadura</dt><dd>${escapeHtml(lote.levadura || '—')}</dd>
          <dt>OG / SG</dt><dd>${lote.og || '—'} / ${lote.sg || '—'}</dd>
          <dt>ABV estimado</dt><dd>${abv !== null ? abv + '%' : 'pendiente de SG'}</dd>
          ${lote.notas ? `<dt>Notas</dt><dd>${escapeHtml(lote.notas)}</dd>` : ''}
          <dt>Mediciones</dt><dd>${mediciones.length} registro(s)</dd>
        </dl>
        <div class="measurement-section">
          <div class="measurement-heading">Evolución de densidad</div>
          ${densityChart(mediciones)}
          ${mediciones.length ? `<div class="measurement-latest">Última: <b>${Number(mediciones[mediciones.length - 1].densidad).toFixed(3)}</b> · ${fmtDate(mediciones[mediciones.length - 1].fecha)}</div>` : ''}
        </div>
        <div class="progress-bar"><span style="width:${(done / 7) * 100}%"></span></div>
        <p style="font-size:.78rem;margin:2px 0 0">${done}/7 pasos</p>

        <div class="actions">
          <button class="btn small secondary" data-action="steps" data-id="${lote.id}">${isOpen ? 'Ocultar proceso' : 'Ver proceso'}</button>
          <button class="btn small secondary" data-action="measurement" data-id="${lote.id}">+ Medición</button>
          <button class="btn small secondary" data-action="edit" data-id="${lote.id}">Editar datos</button>
          <button class="btn small danger" data-action="delete" data-id="${lote.id}">Eliminar</button>
        </div>

        <div class="steps-panel" data-panel="${lote.id}" style="display:${isOpen ? 'block' : 'none'}"></div>
      </div>
    `;
  }).join('');

  lotes.forEach(lote => {
    if (expandedSteps.has(lote.id)) renderStepsPanel(lote.id);
  });
}

function renderStepsPanel(loteId) {
  const lotes = loadLotes();
  const lote = lotes.find(l => l.id === loteId);
  if (!lote) return;
  const pasos = lote.pasos && lote.pasos.length === 7 ? lote.pasos : emptyPasos();
  const textos = pasosTextos(lote);
  const panel = document.querySelector(`[data-panel="${loteId}"]`);
  if (!panel) return;

  panel.innerHTML = STEP_TITLES.map((title, i) => `
    <div class="step-row">
      <button class="step-check ${pasos[i].done ? 'done' : ''}" data-step-toggle="${i}" data-id="${loteId}">
        ${pasos[i].done ? '✓' : ''}
      </button>
      <div class="info">
        <div class="title">${i + 1}. ${escapeHtml(title)}</div>
        <div class="desc ${pasos[i].done ? 'done-text' : ''}">${escapeHtml(textos[i])}${pasos[i].done && pasos[i].fecha ? ` — hecho el ${fmtDate(pasos[i].fecha)}` : ''}</div>
        <div class="step-photo-wrap">
          <label class="icon-btn" data-photo-slot="${i}">
            <svg viewBox="0 0 24 24"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="14" r="3"/></svg>
            <input type="file" accept="image/*" capture="environment" data-photo-input="${i}" data-id="${loteId}" style="display:none">
          </label>
          <img class="step-thumb" data-thumb="${i}" style="display:none">
        </div>
      </div>
    </div>
  `).join('');

  // cargar miniaturas existentes
  STEP_TITLES.forEach(async (_, i) => {
    const key = `${loteId}_${i}`;
    const dataUrl = await getPhoto(key);
    if (dataUrl) {
      const thumb = panel.querySelector(`[data-thumb="${i}"]`);
      thumb.src = dataUrl;
      thumb.style.display = 'block';
      thumb.onclick = () => {
        document.getElementById('lightbox-img').src = dataUrl;
        document.getElementById('lightbox').classList.add('open');
      };
      const btn = panel.querySelector(`.icon-btn[data-photo-slot="${i}"]`);
      if (btn) btn.classList.add('has-photo');
    }
  });

  panel.querySelectorAll('[data-step-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.stepToggle);
      const lotes2 = loadLotes();
      const l = lotes2.find(x => x.id === loteId);
      if (!l.pasos || l.pasos.length !== 7) l.pasos = emptyPasos();
      l.pasos[i].done = !l.pasos[i].done;
      l.pasos[i].fecha = l.pasos[i].done ? new Date().toISOString().slice(0, 10) : null;
      saveLotes(lotes2);
      renderLotes();
      renderDashboard();
      expandedSteps.add(loteId);
      renderStepsPanel(loteId);
      const p = document.querySelector(`[data-panel="${loteId}"]`);
      if (p) p.style.display = 'block';
    });
  });

  panel.querySelectorAll('[data-photo-input]').forEach(input => {
    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const i = input.dataset.photoInput;
      const key = `${loteId}_${i}`;
      try {
        const dataUrl = await resizeImage(file);
        await savePhoto(key, dataUrl);
        renderStepsPanel(loteId);
      } catch (err) {
        alert('No se pudo guardar la foto: ' + err.message);
      }
      e.target.value = '';
    });
  });
}

function openStepsFor(loteId) {
  expandedSteps.add(loteId);
  renderLotes();
  const card = document.querySelector(`.lote-card[data-id="${loteId}"]`);
  if (card) { card.classList.add('highlight'); card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}

document.getElementById('lotes-list').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  const lotes = loadLotes();
  const lote = lotes.find(l => l.id === id);
  if (!lote) return;

  if (action === 'steps') {
    if (expandedSteps.has(id)) expandedSteps.delete(id); else expandedSteps.add(id);
    renderLotes();
  } else if (action === 'measurement') {
    openMeasurementForm(id);
  } else if (action === 'edit') {
    openForm(lote);
  } else if (action === 'delete') {
    if (confirm(`¿Eliminar el lote "${lote.nombre}"? Esta acción no se puede deshacer.`)) {
      const keep = lotes.filter(l => l.id !== id);
      saveLotes(keep);
      expandedSteps.delete(id);
      for (let i = 0; i < 7; i++) deletePhoto(`${id}_${i}`).catch(() => {});
      renderLotes();
      renderDashboard();
    }
  }
});

// ---------- Formulario manual ----------
const form = document.getElementById('lote-form');
const btnNew = document.getElementById('btn-new-lote');
const btnCancel = document.getElementById('btn-cancel');

function openForm(lote) {
  form.style.display = 'grid';
  document.getElementById('lote-id').value = lote ? lote.id : '';
  document.getElementById('f-nombre').value = lote ? lote.nombre : '';
  document.getElementById('f-fecha').value = lote ? lote.fecha : new Date().toISOString().slice(0, 10);
  document.getElementById('f-tipo').value = lote ? lote.tipo : 'Tradicional seco';
  document.getElementById('f-miel').value = lote ? lote.miel : '';
  document.getElementById('f-agua').value = lote ? lote.agua : '';
  document.getElementById('f-levadura').value = lote ? lote.levadura : '';
  updateYeastGuidance();
  document.getElementById('f-og').value = lote ? lote.og : '';
  document.getElementById('f-sg').value = lote ? lote.sg : '';
  document.getElementById('f-estado').value = lote ? lote.estado : 'Fermentando';
  document.getElementById('f-notas').value = lote ? lote.notas : '';
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function closeForm() { form.style.display = 'none'; form.reset(); }
btnNew.addEventListener('click', () => openForm(null));
btnCancel.addEventListener('click', closeForm);

// Catálogo completo de recetas disponible también sin conexión.
const recipeTypeSelect = document.getElementById('f-tipo');
if (recipeTypeSelect) {
  const current = recipeTypeSelect.value;
  recipeTypeSelect.innerHTML = RECETAS.map(r => `<option value="${escapeHtml(r.tipo)}">${escapeHtml(r.tipo)}</option>`).join('') + '<option value="Otra">Otra / personalizada</option>';
  recipeTypeSelect.value = RECETAS.some(r => r.tipo === current) ? current : 'Tradicional seco';
}
const YEASTS = [
 {name:'Lalvin EC-1118',profile:'Cepa enológica robusta y de amplio uso. Consulta ficha actual para dosis, temperatura y tolerancia según el producto y las condiciones.'},
 {name:'Lalvin 71B',profile:'Cepa enológica conocida por su perfil frutal y metabolismo parcial del ácido málico; útil para valorar en recetas con fruta.'},
 {name:'Lalvin K1-V1116',profile:'Cepa enológica seleccionada para buena expresión aromática y adaptación a diversas condiciones; respeta ficha técnica.'},
 {name:'Lalvin QA23',profile:'Cepa enológica asociada a perfiles aromáticos y frutales; controla temperatura y nutrientes.'},
 {name:'Lalvin ICV-D47',profile:'Cepa enológica que puede aportar cuerpo y complejidad; requiere control estricto de temperatura y nutrición.'},
 {name:'SafMead Classic',profile:'Levadura desarrollada específicamente para hidromiel. Sigue las instrucciones de Fermentis para dosis, temperatura y nutrición.'},
 {name:'SafMead Twist',profile:'Levadura específica para hidromiel orientada a perfiles especiados y complejos. Comprueba la ficha vigente del fabricante.'},
 {name:'SafAle US-05',profile:'Levadura cervecera, no específica para hidromiel; se incluye para braggot y pruebas cerveceras. Verifica su idoneidad para la receta.'},
 {name:'Otra / no especificada',profile:'Introduce la cepa en las notas del lote y consulta su ficha técnica antes de inocular.'}
];
const yeastSelect = document.getElementById('f-levadura');
const yeastGuidance = document.getElementById('yeast-guidance');
function updateYeastGuidance() {
  if (!yeastSelect || !yeastGuidance) return;
  const yeast = YEASTS.find(y => y.name === yeastSelect.value);
  yeastGuidance.textContent = yeast ? yeast.profile : 'Consulta la ficha del fabricante para confirmar dosis, temperatura y tolerancia alcohólica.';
}
yeastSelect?.addEventListener('change', updateYeastGuidance);
document.getElementById('f-tipo')?.addEventListener('change', e => {
  const receta = RECETAS.find(r => r.tipo === e.target.value);
  if (!receta) return; // En una receta personalizada, conserva cantidades manuales.
  document.getElementById('f-miel').value = receta.miel;
  document.getElementById('f-agua').value = receta.agua;
  if (yeastSelect && receta.levadura) {
    const recommended = receta.levadura.startsWith('SafAle') ? 'SafAle US-05' : receta.levadura.startsWith('SafMead') ? receta.levadura : receta.levadura.startsWith('EC-1118') ? 'Lalvin EC-1118' : receta.levadura === '71B' ? 'Lalvin 71B' : receta.levadura === 'D-47' ? 'Lalvin ICV-D47' : receta.levadura === 'QA23' ? 'Lalvin QA23' : receta.levadura === 'K1-V1116' ? 'Lalvin K1-V1116' : receta.levadura;
    if ([...yeastSelect.options].some(o => o.value === recommended || o.textContent === recommended)) yeastSelect.value = recommended;
    updateYeastGuidance();
  }
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const lotes = loadLotes();
  const id = document.getElementById('lote-id').value || crypto.randomUUID();
  const existing = lotes.find(l => l.id === id);
  const data = {
    id,
    nombre: document.getElementById('f-nombre').value.trim(),
    fecha: document.getElementById('f-fecha').value,
    tipo: document.getElementById('f-tipo').value,
    miel: document.getElementById('f-miel').value,
    agua: document.getElementById('f-agua').value,
    levadura: document.getElementById('f-levadura').value.trim(),
    og: document.getElementById('f-og').value,
    sg: document.getElementById('f-sg').value,
    estado: document.getElementById('f-estado').value,
    notas: document.getElementById('f-notas').value.trim(),
    pasos: existing && existing.pasos ? existing.pasos : emptyPasos(),
    mediciones: existing && Array.isArray(existing.mediciones) ? existing.mediciones : [],
    volumenObjetivo: existing && existing.volumenObjetivo ? existing.volumenObjetivo : '',
  };
  const idx = lotes.findIndex(l => l.id === id);
  if (idx >= 0) lotes[idx] = data; else lotes.push(data);
  saveLotes(lotes);
  closeForm();
  renderLotes();
  renderDashboard();
});

// ---------- Exportar / Importar JSON (solo datos, no fotos) ----------
document.getElementById('btn-export').addEventListener('click', async () => {
  const button = document.getElementById('btn-export');
  button.disabled = true;
  button.textContent = 'Preparando copia…';
  try {
    const backup = {
      format: 'hidromiel-backup',
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      lotes: loadLotes(),
      fotos: await getAllPhotos(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hidromiel-copia-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    alert('No se pudo crear la copia: ' + err.message);
  } finally {
    button.disabled = false;
    button.textContent = 'Exportar copia completa';
  }
});

document.getElementById('input-import').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(reader.result);
      const isLegacy = Array.isArray(parsed);
      const imported = isLegacy ? parsed : parsed && parsed.format === 'hidromiel-backup' && Array.isArray(parsed.lotes) ? parsed.lotes : null;
      if (!imported) throw new Error('Formato no reconocido. Selecciona una copia JSON de Hidromiel.');
      const valid = imported.filter(l => l && typeof l === 'object' && typeof l.id === 'string' && l.id.length > 0);
      if (valid.length !== imported.length) throw new Error('La copia contiene lotes inválidos. No se han importado datos.');
      const existing = loadLotes();
      const existingIds = new Set(existing.map(l => l.id));
      const toAdd = valid.filter(l => !existingIds.has(l.id));
      saveLotes(existing.concat(toAdd));
      let photosImported = 0;
      if (!isLegacy && parsed.fotos && typeof parsed.fotos === 'object') {
        for (const [key, value] of Object.entries(parsed.fotos)) {
          if (typeof key === 'string' && typeof value === 'string' && value.startsWith('data:image/')) {
            await savePhoto(key, value);
            photosImported++;
          }
        }
      }
      renderLotes();
      renderDashboard();
      alert(`Copia restaurada. Lotes nuevos: ${toAdd.length}.${isLegacy ? ' Este JSON antiguo no incluye fotografías.' : ' Fotografías recuperadas: ' + photosImported + '.'}`);
    } catch (err) {
      alert('No se pudo importar la copia: ' + err.message);
    } finally {
      e.target.value = '';
    }
  };
  reader.readAsText(file);
});

// ---------- Panel de inicio ----------
function renderDashboard() {
  const target = document.getElementById('dashboard-summary');
  if (!target) return;
  const lotes = loadLotes();
  const active = lotes.filter(l => !['Consumido', 'Embotellado'].includes(l.estado));
  const pending = active.reduce((sum, l) => {
    const steps = Array.isArray(l.pasos) ? l.pasos : [];
    return sum + Math.max(0, 7 - steps.filter(p => p && p.done).length);
  }, 0);
  const recent = [...lotes].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '')).slice(0, 3);
  target.innerHTML = `
    <div class="dashboard-grid">
      <div class="dashboard-card"><span class="dash-label">Lotes en curso</span><strong>${active.length}</strong><span class="dash-hint">Elaboraciones no cerradas</span></div>
      <div class="dashboard-card"><span class="dash-label">Pasos pendientes</span><strong>${pending}</strong><span class="dash-hint">En los lotes activos</span></div>
    </div>
    <div class="dashboard-recent">
      <div class="dashboard-heading">Tus últimas elaboraciones</div>
      ${recent.length ? recent.map(l => `<div class="dashboard-lote"><span><b>${escapeHtml(l.nombre || 'Sin nombre')}</b><small>${escapeHtml(l.tipo || 'Sin tipo')} · ${fmtDate(l.fecha)}</small></span><span class="dash-status">${escapeHtml(l.estado || 'Fermentando')}</span></div>`).join('') : '<p class="dash-empty">Aún no tienes lotes. Crea el primero en Mis lotes</p>'}
    </div>
    <div class="btn-row dashboard-actions">
      <button class="btn small" id="dash-new-lote">+ Crear lote</button>
      <button class="btn small secondary" id="dash-open-lotes">Ver mis lotes</button>
    </div>`;
  const create = document.getElementById('dash-new-lote');
  const open = document.getElementById('dash-open-lotes');
  if (create) create.addEventListener('click', () => { location.hash = '#lotes'; setTimeout(() => openForm(null), 80); });
  if (open) open.addEventListener('click', () => { location.hash = '#lotes'; });
}

function openMeasurementForm(loteId) {
  const modal = document.getElementById('measurement-modal');
  const formEl = document.getElementById('measurement-form');
  if (!modal || !formEl) return;
  formEl.reset();
  document.getElementById('measurement-lote-id').value = loteId;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('measurement-density').focus();
}
function closeMeasurementForm() {
  const modal = document.getElementById('measurement-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
document.getElementById('measurement-cancel')?.addEventListener('click', closeMeasurementForm);
document.getElementById('measurement-modal')?.addEventListener('click', e => {
  if (e.target.id === 'measurement-modal') closeMeasurementForm();
});
document.getElementById('measurement-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const density = Number(document.getElementById('measurement-density').value);
  const rawTemp = document.getElementById('measurement-temperature').value.trim();
  const temp = rawTemp === '' ? '' : Number(rawTemp);
  const note = document.getElementById('measurement-note').value.trim();
  if (!Number.isFinite(density) || density < 0.8 || density > 1.3) {
    alert('Introduce una densidad válida entre 0.800 y 1.300.');
    return;
  }
  if (temp !== '' && (!Number.isFinite(temp) || temp < -5 || temp > 60)) {
    alert('Introduce una temperatura válida entre -5 y 60 °C.');
    return;
  }
  const lotes = loadLotes();
  const lote = lotes.find(l => l.id === document.getElementById('measurement-lote-id').value);
  if (!lote) { closeMeasurementForm(); return; }
  lote.mediciones = Array.isArray(lote.mediciones) ? lote.mediciones : [];
  lote.mediciones.push({ fecha: new Date().toISOString().slice(0, 10), densidad: Math.round(density * 1000) / 1000, temperatura: temp, nota: note });
  saveLotes(lotes);
  closeMeasurementForm();
  renderLotes();
  renderDashboard();
});

// ---------- Init ----------
renderRoute();
renderRecetas();
document.getElementById('recipe-volume')?.addEventListener('input', renderRecetas);
renderLotes();
renderDashboard();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('No se pudo registrar el service worker', err));
  });
}
