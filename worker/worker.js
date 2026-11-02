/**
 * Worker «diagnostico-valcarah»
 *
 * Recibe los datos de la autoevaluación (diagnostico.valcarah.com) y:
 *  - crea o actualiza el contacto en Systeme (nombre, correo y teléfono son
 *    obligatorios), rellena los campos personalizados y añade las etiquetas.
 *
 *  Versiones anteriores guardaban en Cloudflare KV las respuestas sin correo;
 *  esos datos se pueden seguir descargando en /exportar.
 *
 * Configuración en el panel de Cloudflare:
 *  - Secreto SYSTEME_API_KEY  → clave de la API pública de Systeme (obligatorio).
 *  - Enlace KV  DIAGNOSTICOS  → datos antiguos sin correo (solo para /exportar).
 *  - Secreto EXPORT_TOKEN     → contraseña para descargar las estadísticas (opcional).
 *
 * API de Systeme: https://developer.systeme.io/reference/api
 *   Base https://api.systeme.io/api · cabecera X-API-Key · PATCH con application/merge-patch+json
 */

const ORIGEN_PERMITIDO = 'https://diagnostico.valcarah.com';
const SYSTEME_API = 'https://api.systeme.io/api';
const MAX_CUERPO = 10_000; // bytes

const ETAPAS = ['caos', 'claridad', 'creacion'];
const LETRAS = ['a', 'b', 'c', 'd', 'e'];
// Número de opciones de cada pregunta (1 a 10).
const NUM_OPCIONES = [3, 3, 3, 3, 3, 3, 5, 4, 5, 4];

// Textos guardados en los campos limite (P7), apoyo (P9) y emprender (P10).
const TEXTOS = {
  7: [
    'El tiempo y la energía disponibles.',
    'La necesidad de cuidar mis ingresos y gastos.',
    'Las dudas sobre el valor de mis conocimientos o mi experiencia.',
    'La falta de información, herramientas o acompañamiento.',
    'Otro aspecto o ninguno de los anteriores.'
  ],
  9: [
    'Una herramienta para trabajar por mi cuenta.',
    'Una sesión individual para pensar una decisión.',
    'Un taller o círculo para trabajar junto a otras mujeres.',
    'Acompañamiento para estructurar una idea de negocio.',
    'Todavía no lo sé.'
  ],
  10: [
    'Mi proyecto no está relacionado con emprender.',
    'Me interesa explorarlo, pero todavía no tengo una idea.',
    'Tengo una idea inicial, pero necesito comprobar si quiero desarrollarla.',
    'Quiero desarrollar una idea y probarla con posibles clientes.'
  ]
};

const ETIQUETA_NEWSLETTER = 'newsletter';
const PREFIJO_DIAGNOSTICO = 'diagnostico-';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/exportar' && request.method === 'GET') {
      return exportar(url, env);
    }

    const origen = request.headers.get('Origin');
    if (origen !== ORIGEN_PERMITIDO) {
      return new Response('Origen no permitido', { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cabecerasCors() });
    }

    if (request.method !== 'POST' || url.pathname !== '/') {
      return json({ ok: false, error: 'Método no permitido' }, 405);
    }

    try {
      return await recibir(request, env);
    } catch (error) {
      console.error('Error inesperado:', error && error.stack ? error.stack : error);
      return json({ ok: false, error: 'Error interno' }, 500);
    }
  }
};

/* ---------------------------------------------------------------------------
 * Recepción y validación
 * ------------------------------------------------------------------------- */

async function recibir(request, env) {
  const tipo = request.headers.get('Content-Type') || '';
  if (!tipo.includes('application/json')) {
    return json({ ok: false, error: 'Se esperaba JSON' }, 415);
  }

  const crudo = await request.text();
  if (crudo.length > MAX_CUERPO) {
    return json({ ok: false, error: 'Petición demasiado grande' }, 413);
  }

  let cuerpo;
  try {
    cuerpo = JSON.parse(crudo);
  } catch {
    return json({ ok: false, error: 'JSON no válido' }, 400);
  }

  // Campo trampa: si un robot lo rellena, respondemos OK sin hacer nada.
  if (cuerpo.web) {
    return json({ ok: true });
  }

  const datos = validar(cuerpo);
  if (datos.error) {
    return json({ ok: false, error: datos.error }, 400);
  }

  if (!env.SYSTEME_API_KEY) {
    console.error('Falta el secreto SYSTEME_API_KEY');
    return json({ ok: false, error: 'Configuración incompleta' }, 500);
  }
  try {
    await guardarEnSysteme(env, datos);
  } catch (error) {
    console.error('Error con Systeme:', error.message);
    return json({ ok: false, error: 'No se pudo guardar el contacto' }, 502);
  }
  return json({ ok: true });
}

function validar(cuerpo) {
  const r = cuerpo.respuestas;
  if (!Array.isArray(r) || r.length !== NUM_OPCIONES.length) {
    return { error: 'Faltan respuestas' };
  }

  const indices = [];
  for (let i = 0; i < r.length; i++) {
    const j = LETRAS.indexOf(String(r[i]).toLowerCase());
    if (j < 0 || j >= NUM_OPCIONES[i]) return { error: `Respuesta ${i + 1} no válida` };
    indices.push(j);
  }

  const correo = typeof cuerpo.correo === 'string' ? cuerpo.correo.trim().toLowerCase() : '';
  if (!correo || correo.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) {
    return { error: 'Correo no válido' };
  }

  const nombre = typeof cuerpo.nombre === 'string'
    ? cuerpo.nombre.replace(/[\u0000-\u001F\u007F<>]/g, '').trim().slice(0, 80)
    : '';
  if (!nombre) {
    return { error: 'Falta el nombre' };
  }

  const telefono = typeof cuerpo.telefono === 'string' ? cuerpo.telefono.trim().slice(0, 30) : '';
  const digitos = telefono.replace(/\D/g, '');
  if (!/^[+\d\s().-]+$/.test(telefono) || digitos.length < 7 || digitos.length > 15) {
    return { error: 'Teléfono no válido' };
  }

  const origen = typeof cuerpo.origen === 'string'
    ? cuerpo.origen.trim().slice(0, 100).replace(/[^\p{L}\p{N} _.\-]/gu, '')
    : '';

  return {
    indices,
    // El resultado se recalcula aquí para que no dependa de lo que envíe el navegador.
    resultado: calcularResultado(indices),
    nombre,
    correo,
    telefono,
    consentimiento: cuerpo.consentimiento === true,
    origen: origen || 'directo'
  };
}

// Preguntas 1 a 6: 1.ª opción → caos, 2.ª → claridad, 3.ª → creación.
// Empate: gana la etapa anterior.
function calcularResultado(indices) {
  const puntos = [0, 0, 0];
  for (let i = 0; i < 6; i++) puntos[indices[i]]++;
  let ganadora = 0;
  for (let k = 1; k < 3; k++) if (puntos[k] > puntos[ganadora]) ganadora = k;
  return ETAPAS[ganadora];
}

function respuestasCompactas(indices) {
  return indices.map((j, i) => `${i + 1}:${LETRAS[j]}`).join(' | ');
}

/* ---------------------------------------------------------------------------
 * Systeme
 * ------------------------------------------------------------------------- */

async function guardarEnSysteme(env, d) {
  const campos = [
    { slug: 'etapa', value: d.resultado },
    { slug: 'limite', value: TEXTOS[7][d.indices[6]] },
    { slug: 'apoyo', value: TEXTOS[9][d.indices[8]] },
    { slug: 'emprender', value: TEXTOS[10][d.indices[9]] },
    { slug: 'origen', value: d.origen },
    { slug: 'respuestas', value: respuestasCompactas(d.indices) }
  ];
  campos.push({ slug: 'first_name', value: d.nombre });
  campos.push({ slug: 'phone_number', value: d.telefono });

  // 1. Crear o actualizar el contacto (antes de las etiquetas, para que las
  //    automatizaciones que se activan con la etiqueta ya vean los campos).
  let contacto = await buscarContacto(env, d.correo);
  if (contacto) {
    contacto = await systeme(env, 'PATCH', `/contacts/${contacto.id}`, { fields: campos }) || contacto;
  } else {
    const res = await systeme(env, 'POST', '/contacts', { email: d.correo, fields: campos }, { permitir: [422] });
    if (res && res.__estado === 422) {
      // Puede que el contacto se haya creado entre la búsqueda y la creación.
      contacto = await buscarContacto(env, d.correo);
      if (!contacto) throw new Error(`Systeme rechazó el contacto: ${res.__detalle}`);
      contacto = await systeme(env, 'PATCH', `/contacts/${contacto.id}`, { fields: campos }) || contacto;
    } else {
      contacto = res;
    }
  }

  const actuales = new Map((contacto.tags || []).map((t) => [t.name, t.id]));

  // 2. Etiqueta de diagnóstico. Si la persona repite la autoevaluación,
  //    quitamos las etiquetas de diagnóstico anteriores (incluida la misma)
  //    para que la automatización de Systeme vuelva a enviar el correo.
  const etiquetaDiagnostico = PREFIJO_DIAGNOSTICO + d.resultado;
  for (const [nombre, id] of actuales) {
    if (nombre.startsWith(PREFIJO_DIAGNOSTICO)) {
      await systeme(env, 'DELETE', `/contacts/${contacto.id}/tags/${id}`, null, { permitir: [404] });
    }
  }
  await anadirEtiqueta(env, contacto.id, etiquetaDiagnostico);

  // 3. Newsletter, solo con la casilla marcada (nunca se quita si ya la tenía).
  if (d.consentimiento && !actuales.has(ETIQUETA_NEWSLETTER)) {
    await anadirEtiqueta(env, contacto.id, ETIQUETA_NEWSLETTER);
  }
}

async function buscarContacto(env, correo) {
  const res = await systeme(env, 'GET', `/contacts?email=${encodeURIComponent(correo)}&limit=10`);
  const lista = (res && res.items) || [];
  return lista.find((c) => String(c.email).toLowerCase() === correo) || null;
}

const cacheEtiquetas = new Map();

async function idEtiqueta(env, nombre) {
  if (cacheEtiquetas.has(nombre)) return cacheEtiquetas.get(nombre);

  const res = await systeme(env, 'GET', `/tags?query=${encodeURIComponent(nombre)}&limit=100`);
  let etiqueta = ((res && res.items) || []).find((t) => t.name === nombre);

  if (!etiqueta) {
    // La etiqueta no existe todavía: la creamos.
    etiqueta = await systeme(env, 'POST', '/tags', { name: nombre });
  }

  cacheEtiquetas.set(nombre, etiqueta.id);
  return etiqueta.id;
}

async function anadirEtiqueta(env, contactoId, nombre) {
  const tagId = await idEtiqueta(env, nombre);
  await systeme(env, 'POST', `/contacts/${contactoId}/tags`, { tagId });
}

/**
 * Llamada a la API de Systeme. Reintenta una vez si recibe 429 (límite de peticiones).
 * opciones.permitir: estados de error que se devuelven en lugar de lanzar una excepción.
 */
async function systeme(env, metodo, ruta, cuerpo, opciones = {}, intento = 0) {
  const cabeceras = {
    'X-API-Key': env.SYSTEME_API_KEY,
    Accept: 'application/json'
  };
  const init = { method: metodo, headers: cabeceras };

  if (cuerpo) {
    cabeceras['Content-Type'] = metodo === 'PATCH' ? 'application/merge-patch+json' : 'application/json';
    init.body = JSON.stringify(cuerpo);
  }

  const res = await fetch(SYSTEME_API + ruta, init);

  if (res.status === 429 && intento === 0) {
    const espera = Math.min(Number(res.headers.get('Retry-After')) || 1, 3);
    await new Promise((r) => setTimeout(r, espera * 1000));
    return systeme(env, metodo, ruta, cuerpo, opciones, 1);
  }

  if (res.status === 204) return null;

  const texto = await res.text();
  let datos = null;
  try { datos = texto ? JSON.parse(texto) : null; } catch { datos = null; }

  if (!res.ok) {
    const detalle = (datos && (datos.detail || datos.message || datos['hydra:description'] || JSON.stringify(datos.violations || datos))) || texto.slice(0, 300);
    if ((opciones.permitir || []).includes(res.status)) {
      return { __estado: res.status, __detalle: detalle };
    }
    throw new Error(`${metodo} ${ruta.split('?')[0]} → ${res.status}: ${detalle}`);
  }

  return datos;
}

/* ---------------------------------------------------------------------------
 * Cloudflare KV (datos antiguos sin correo)
 * ------------------------------------------------------------------------- */

/**
 * GET /exportar?token=…[&origen=…]
 * Descarga un CSV (separado por punto y coma, apto para Excel en español)
 * con las respuestas sin correo. Desactivado si no existe el secreto EXPORT_TOKEN.
 */
async function exportar(url, env) {
  if (!env.EXPORT_TOKEN || !env.DIAGNOSTICOS) {
    return new Response('No encontrado', { status: 404 });
  }

  const token = url.searchParams.get('token') || '';
  if (!(await iguales(token, env.EXPORT_TOKEN))) {
    return new Response('No autorizado', { status: 401 });
  }

  const filtroOrigen = url.searchParams.get('origen');
  const filas = [['fecha', 'origen', 'resultado', 'respuestas', 'limite', 'apoyo', 'emprender']];

  let cursor;
  do {
    const pagina = await env.DIAGNOSTICOS.list({ prefix: 'sin-correo:', cursor });
    for (const k of pagina.keys) {
      let r = k.metadata;
      if (!r) {
        const valor = await env.DIAGNOSTICOS.get(k.name);
        r = valor ? JSON.parse(valor) : null;
      }
      if (!r) continue;
      if (filtroOrigen && r.origen !== filtroOrigen) continue;

      const letras = Object.fromEntries(
        String(r.respuestas).split(' | ').map((p) => p.split(':'))
      );
      const texto = (n) => TEXTOS[n][LETRAS.indexOf(letras[n])] || '';

      filas.push([r.fecha, r.origen, r.resultado, r.respuestas, texto(7), texto(9), texto(10)]);
    }
    cursor = pagina.list_complete ? undefined : pagina.cursor;
  } while (cursor);

  const csv = '﻿' + filas.map((f) => f.map(celdaCsv).join(';')).join('\r\n');
  const fecha = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="diagnostico-sin-correo-${fecha}.csv"`,
      'Cache-Control': 'no-store'
    }
  });
}

function celdaCsv(valor) {
  let v = String(valor ?? '');
  if (/^[=+\-@]/.test(v)) v = "'" + v; // evita fórmulas al abrir en Excel
  return /[;"\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

async function iguales(a, b) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b))
  ]);
  return crypto.subtle.timingSafeEqual(ha, hb);
}

/* ---------------------------------------------------------------------------
 * Utilidades
 * ------------------------------------------------------------------------- */

function cabecerasCors() {
  return {
    'Access-Control-Allow-Origin': ORIGEN_PERMITIDO,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

function json(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cabecerasCors() }
  });
}
