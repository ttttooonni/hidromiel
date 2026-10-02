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
    id: 'tradicional', tipo: 'Tradicional seco', nombre: 'Tradicional seco/semiseco',
    resumen: '250 g de miel por litro de agua · ~10% ABV', miel: 1.25, agua: 5,
    pasos: [
      'Disuelve la miel al baño María si está cristalizada.',
      'Mézclala con el agua y toma la densidad inicial (OG) con el densímetro.',
      'Deja bajar la temperatura del mosto a 18–25 °C.',
      'Rehidrata la levadura (Go-Ferm) y añádela. Cierra con el airlock.',
      '2–4 semanas. Nutrientes escalonados los primeros días, temperatura estable.',
      '4–12 semanas. Trasiega cuando el burbujeo se calme y la densidad no baje más.',
      'Embotella en vidrio, lugar fresco y oscuro. Mínimo 2 semanas de maduración.',
    ],
  },
  {
    id: 'dulce', tipo: 'Dulce y fuerte', nombre: 'Dulce y fuerte',
    resumen: '1 kg de miel por cada 2 L de agua · ~10–11% ABV', miel: 2.5, agua: 5,
    pasos: [
      'Disuelve la miel al baño María — hay bastante cantidad, ve con calma.',
      'Mézclala con el agua y toma la densidad inicial (será alta, 1.090+).',
      'Enfría a 15–22 °C: con tanta miel conviene ir en la parte baja del rango.',
      'Rehidrata la levadura y añádela. La alta densidad puede ralentizar el arranque.',
      '3–5 semanas — puede ser más lenta de lo normal por la concentración de azúcar.',
      '4–12 semanas. Trasiega con cuidado, suele quedar bastante sedimento.',
      'Embotella y da tiempo: los dulces y fuertes mejoran mucho con meses de botella.',
    ],
  },
  {
    id: 'melomel', tipo: 'Melomel', nombre: 'Melomel (con fruta)',
    resumen: 'Base tradicional + fruta · aroma y acidez extra', miel: 1.25, agua: 5,
    pasos: [
      'Disuelve la miel al baño María.',
      'Mézclala con el agua y toma la densidad inicial.',
      'Enfría a 18–25 °C.',
      'Rehidrata la levadura y añádela — 71B va muy bien para realzar la fruta.',
      'A mitad de la primaria (o en secundaria) añade la fruta troceada, en bolsa de malla.',
      'Trasiega retirando la fruta y deja clarificar 4–12 semanas.',
      'Embotella. La fruta se integra bien con 2–3 meses de botella.',
    ],
  },
  {
    id: 'metheglin', tipo: 'Metheglin', nombre: 'Metheglin (especiado)',
    resumen: 'Base tradicional + especias o hierbas en infusión', miel: 1.25, agua: 5,
    pasos: [
      'Prepara una infusión con las especias/hierbas elegidas mientras preparas la miel.',
      'Cuela la infusión, mézclala con la miel y el agua, y toma la densidad inicial.',
      'Enfría a 18–25 °C.',
      'Rehidrata la levadura y añádela.',
      '2–4 semanas de fermentación primaria, nutrientes escalonados.',
      'Trasiega y clarifica 4–12 semanas.',
      'Prueba y cuela bien antes de embotellar, para evitar amargor con el tiempo.',
    ],
  },
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
  const receta = RECETAS.find(r => r.tipo === lote.tipo);
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
  list.innerHTML = RECETAS.map(r => `
    <div class="recipe">
      <div class="top-row">
        <div>
          <span class="tag">${escapeHtml(r.nombre.includes('(') ? r.nombre.split('(')[1].replace(')', '') : 'Para empezar')}</span>
          <h3>${escapeHtml(r.nombre)}</h3>
          <p style="margin:2px 0 0">${escapeHtml(r.resumen)}</p>
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
  const loteId = crypto.randomUUID();
  const n = lotes.filter(l => l.tipo === receta.tipo).length + 1;
  lotes.push({
    id: loteId,
    nombre: `${receta.nombre.split(' ')[0]}-${new Date().getFullYear()}-${String(n).padStart(2, '0')}`,
    fecha: new Date().toISOString().slice(0, 10),
    tipo: receta.tipo,
    miel: receta.miel,
    agua: receta.agua,
    levadura: '',
    og: '', sg: '',
    estado: 'Fermentando',
    notas: '',
    pasos: emptyPasos(),
  });
  saveLotes(lotes);
  sessionStorage.setItem(OPEN_LOTE_KEY, loteId);
  location.hash = '#lotes';
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
        </dl>
        <div class="progress-bar"><span style="width:${(done / 7) * 100}%"></span></div>
        <p style="font-size:.78rem;margin:2px 0 0">${done}/7 pasos</p>

        <div class="actions">
          <button class="btn small secondary" data-action="steps" data-id="${lote.id}">${isOpen ? 'Ocultar proceso' : 'Ver proceso'}</button>
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
  } else if (action === 'edit') {
    openForm(lote);
  } else if (action === 'delete') {
    if (confirm(`¿Eliminar el lote "${lote.nombre}"? Esta acción no se puede deshacer.`)) {
      const keep = lotes.filter(l => l.id !== id);
      saveLotes(keep);
      expandedSteps.delete(id);
      for (let i = 0; i < 7; i++) deletePhoto(`${id}_${i}`).catch(() => {});
      renderLotes();
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
  document.getElementById('f-og').value = lote ? lote.og : '';
  document.getElementById('f-sg').value = lote ? lote.sg : '';
  document.getElementById('f-estado').value = lote ? lote.estado : 'Fermentando';
  document.getElementById('f-notas').value = lote ? lote.notas : '';
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function closeForm() { form.style.display = 'none'; form.reset(); }
btnNew.addEventListener('click', () => openForm(null));
btnCancel.addEventListener('click', closeForm);

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
      ${recent.length ? recent.map(l => `<div class="dashboard-lote"><span><b>${escapeHtml(l.nombre || 'Sin nombre')}</b><small>${escapeHtml(l.tipo || 'Sin tipo')} · ${fmtDate(l.fecha)}</small></span><span class="dash-status">${escapeHtml(l.estado || 'Fermentando')}</span></div>`).join('') : '<p class="dash-empty">Aquí aparecerán tus lotes cuando registres el primero.</p>'}
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

// ---------- Init ----------
renderRoute();
renderRecetas();
renderLotes();
renderDashboard();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('No se pudo registrar el service worker', err));
  });
}
