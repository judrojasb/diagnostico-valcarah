/* Autoevaluación Valcarah — lógica de la página (sin frameworks). */
(function () {
  'use strict';

  var C = window.VALCARAH_CONTENIDO;
  var CONFIG = window.VALCARAH_CONFIG;
  var UI = C.interfaz;
  var LETRAS = ['a', 'b', 'c', 'd', 'e'];
  var ETAPAS = ['caos', 'claridad', 'creacion'];
  var DURACION = 300;

  var app = document.getElementById('app');
  var progreso = document.querySelector('.progreso');
  var barra = document.querySelector('.progreso__barra');
  var movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');

  var estado = {
    indice: 0,
    respuestas: new Array(C.preguntas.length).fill(null), // índices 0..n
    resultado: null,
    origen: leerOrigen(),
    enviado: false
  };

  /* ---------- Utilidades ---------- */

  function leerOrigen() {
    try {
      var valor = new URLSearchParams(window.location.search).get('origen') || '';
      valor = valor.trim().slice(0, 100).replace(/[^\p{L}\p{N} _.\-]/gu, '');
      return valor || 'directo';
    } catch (e) {
      return 'directo';
    }
  }

  function enlace(clave) {
    var url = CONFIG.enlaces[clave];
    return url && url.trim() ? url.trim() : 'https://www.valcarah.com';
  }

  function escapar(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Escapa el texto y convierte [texto](clave) en enlaces y __________ en huecos.
  function enriquecer(texto) {
    return escapar(texto)
      .replace(/\[([^\]]+)\]\(([a-zA-Z]+)\)/g, function (_, t, clave) {
        return '<a href="' + escapar(enlace(clave)) + '" target="_blank" rel="noopener">' + t + '</a>';
      })
      .replace(/_{4,}/g, '<span class="hueco" aria-label="espacio para completar"></span>');
  }

  function parrafos(lista, clase) {
    return lista.map(function (p) {
      return '<p class="' + (clase || 'texto') + '">' + enriquecer(p) + '</p>';
    }).join('');
  }

  /* ---------- Transiciones ---------- */

  function mostrar(html, opciones) {
    opciones = opciones || {};
    var anterior = app.querySelector('.pantalla');
    var espera = movimientoReducido.matches || !anterior ? 0 : DURACION;

    if (anterior) anterior.classList.add('saliendo');

    window.setTimeout(function () {
      var nueva = document.createElement('section');
      nueva.className = 'pantalla ' + (opciones.clase || '');
      nueva.innerHTML = html;
      if (!movimientoReducido.matches) nueva.classList.add('entrando');

      app.innerHTML = '';
      app.appendChild(nueva);
      window.scrollTo(0, 0);

      actualizarProgreso(opciones.progreso);
      if (opciones.alMostrar) opciones.alMostrar(nueva);

      // Fuerza el reflujo para que la transición de entrada se ejecute.
      void nueva.offsetWidth;
      nueva.classList.remove('entrando');

      var foco = nueva.querySelector('[data-foco]');
      if (foco && anterior) foco.focus({ preventScroll: true });
    }, espera);
  }

  function actualizarProgreso(valor) {
    if (typeof valor !== 'number') {
      progreso.hidden = true;
      return;
    }
    progreso.hidden = false;
    barra.style.width = Math.round(valor * 100) + '%';
  }

  /* ---------- Pantalla de inicio ---------- */

  function pantallaInicio() {
    var i = C.inicio;
    var html =
      '<p class="antetitulo">' + escapar(i.antetitulo) + '</p>' +
      '<h1 class="titulo" tabindex="-1" data-foco>' + escapar(i.titulo) + '</h1>' +
      parrafos(i.parrafos) +
      '<div class="acciones"><button type="button" class="boton boton--principal" data-accion="empezar">' + escapar(i.boton) + '</button></div>' +
      '<p class="meta">' + escapar(i.meta) + '</p>' +
      '<hr class="filete filete--corto" style="margin-left:auto;margin-right:auto">' +
      '<p class="pequeno aviso">' + escapar(i.aviso) + '</p>';

    mostrar(html, {
      clase: 'inicio',
      alMostrar: function (el) {
        el.querySelector('[data-accion="empezar"]').addEventListener('click', function () {
          estado.indice = 0;
          pantallaPregunta();
        });
      }
    });
  }

  /* ---------- Preguntas ---------- */

  function pantallaPregunta() {
    var n = estado.indice;
    var total = C.preguntas.length;
    var p = C.preguntas[n];
    var elegida = estado.respuestas[n];
    var ultima = n === total - 1;

    var opciones = p.opciones.map(function (texto, j) {
      var id = 'p' + n + '-' + j;
      return (
        '<label class="tarjeta" for="' + id + '">' +
          '<input type="radio" name="respuesta" id="' + id + '" value="' + j + '"' + (elegida === j ? ' checked' : '') + '>' +
          '<span class="tarjeta__marca" aria-hidden="true"></span>' +
          '<span class="tarjeta__texto">' + escapar(texto) + '</span>' +
        '</label>'
      );
    }).join('');

    var html =
      '<form novalidate>' +
        '<p class="antetitulo">' + escapar(UI.pregunta) + ' ' + (n + 1) + ' ' + escapar(UI.de) + ' ' + total + '</p>' +
        '<fieldset class="opciones">' +
          '<legend class="titulo titulo--pregunta" tabindex="-1" data-foco>' + escapar(p.texto) + '</legend>' +
          opciones +
        '</fieldset>' +
        '<div class="navegacion">' +
          '<button type="button" class="boton boton--secundario" data-accion="anterior">' + escapar(UI.anterior) + '</button>' +
          '<button type="submit" class="boton boton--principal"' + (elegida === null ? ' disabled' : '') + '>' +
            escapar(ultima ? C.botonFinal : UI.siguiente) +
          '</button>' +
        '</div>' +
      '</form>';

    mostrar(html, {
      clase: 'pregunta',
      progreso: (n + 1) / total,
      alMostrar: function (el) {
        var form = el.querySelector('form');
        var enviar = form.querySelector('[type="submit"]');

        form.addEventListener('change', function (e) {
          if (e.target.name !== 'respuesta') return;
          estado.respuestas[n] = Number(e.target.value);
          enviar.disabled = false;
          // Compatibilidad con navegadores sin :has()
          form.querySelectorAll('.tarjeta').forEach(function (t) {
            t.classList.toggle('seleccionada', t.querySelector('input').checked);
          });
        });
        form.querySelectorAll('.tarjeta').forEach(function (t) {
          t.classList.toggle('seleccionada', t.querySelector('input').checked);
        });

        form.addEventListener('submit', function (e) {
          e.preventDefault();
          if (estado.respuestas[n] === null) return;
          if (ultima) {
            estado.resultado = calcularResultado(estado.respuestas);
            pantallaResultado();
          } else {
            estado.indice = n + 1;
            pantallaPregunta();
          }
        });

        el.querySelector('[data-accion="anterior"]').addEventListener('click', function () {
          if (n === 0) {
            pantallaInicio();
          } else {
            estado.indice = n - 1;
            pantallaPregunta();
          }
        });
      }
    });
  }

  /* ---------- Puntuación ----------
     Preguntas 1 a 6: 1.ª opción → caos, 2.ª → claridad, 3.ª → creación.
     Preguntas 7 a 10 no puntúan. Empate: gana la etapa anterior. */

  function calcularResultado(respuestas) {
    var puntos = [0, 0, 0];
    for (var i = 0; i < 6; i++) {
      var r = respuestas[i];
      if (r >= 0 && r <= 2) puntos[r]++;
    }
    var ganadora = 0;
    for (var k = 1; k < 3; k++) {
      if (puntos[k] > puntos[ganadora]) ganadora = k; // estrictamente mayor: el empate favorece la anterior
    }
    return ETAPAS[ganadora];
  }

  /* ---------- Resultado ---------- */

  function pantallaResultado() {
    var r = C.resultados[estado.resultado];
    var h = r.herramienta;
    var limite = estado.respuestas[6];
    var co = C.correo;

    var etapas = ETAPAS.map(function (clave) {
      var e = C.resultados[clave];
      var actual = clave === estado.resultado;
      return '<li' + (actual ? ' class="actual" aria-current="true"' : '') + '>' + e.numero + ' · ' + escapar(e.etapa) + '</li>';
    }).join('');

    var pasos = h.pasos.map(function (paso) {
      var texto = '<strong>' + enriquecer(paso.t) + '</strong>' + (paso.d ? ' ' + enriquecer(paso.d) : '');
      var sub = paso.sub
        ? '<ul>' + paso.sub.map(function (s) { return '<li>' + enriquecer(s) + '</li>'; }).join('') + '</ul>'
        : '';
      return '<li>' + texto + sub + '</li>';
    }).join('');

    var html =
      '<header class="resultado__cabecera">' +
        '<p class="numeral" aria-hidden="true">' + r.numero + '</p>' +
        '<h1 class="resultado__etapa" tabindex="-1" data-foco>' +
          '<span class="visualmente-oculto">Resultado ' + r.numero + ': </span>' + escapar(r.etapa) +
        '</h1>' +
        '<p class="antetitulo">' + escapar(r.subtitulo) + '</p>' +
        '<ul class="etapas" aria-label="' + escapar(UI.etapas) + '">' + etapas + '</ul>' +
      '</header>' +

      '<h2 class="titulo resultado__titular">' + escapar(r.titular) + '</h2>' +
      parrafos(r.parrafos) +

      (limite !== null ? '<p class="mensaje-limite">' + enriquecer(C.mensajesLimite[limite]) + '</p>' : '') +

      '<hr class="filete">' +
      '<p class="antetitulo">' + escapar(C.etiquetas.herramienta) + '</p>' +
      '<h2 class="subtitulo">' + escapar(h.nombre) + '</h2>' +
      (h.intro ? '<p class="texto">' + enriquecer(h.intro) + '</p>' : '') +
      '<ol class="pasos">' + pasos + '</ol>' +

      '<hr class="filete">' +
      '<h2 class="subtitulo">' + escapar(C.etiquetas.siguientePaso) + '</h2>' +
      parrafos(r.siguientePaso) +
      '<div class="acciones">' +
        '<button type="button" class="boton boton--principal" data-accion="guardar">' + escapar(r.accionGratuita) + '</button>' +
        '<a class="boton boton--secundario" href="' + escapar(enlace(r.accionSecundaria.enlace)) + '" target="_blank" rel="noopener">' + escapar(r.accionSecundaria.texto) + '</a>' +
        '<button type="button" class="enlace" data-accion="imprimir">' + escapar(C.etiquetas.imprimir) + '</button>' +
      '</div>' +

      '<div class="bloque-correo" id="correo">' +
        '<hr class="filete">' +
        '<h2 class="subtitulo" tabindex="-1" id="titulo-correo">' + escapar(co.titulo) + '</h2>' +
        '<p class="texto">' + enriquecer(co.texto) + '</p>' +
        '<form class="formulario" novalidate>' +
          '<div class="campo">' +
            '<label for="nombre">' + escapar(co.campoNombre) + '</label>' +
            '<input id="nombre" name="nombre" type="text" autocomplete="given-name" maxlength="80">' +
          '</div>' +
          '<div class="campo">' +
            '<label for="email">' + escapar(co.campoCorreo) + '</label>' +
            '<input id="email" name="email" type="email" inputmode="email" autocomplete="email" maxlength="254" aria-describedby="info-correo">' +
            '<p class="error" id="error-correo" hidden></p>' +
          '</div>' +
          '<div class="trampa" aria-hidden="true"><label for="web">Web</label><input id="web" name="web" type="text" tabindex="-1" autocomplete="off"></div>' +
          '<p class="pequeno" id="info-correo">' + enriquecer(co.info) + '</p>' +
          '<label class="casilla"><input type="checkbox" name="consentimiento"><span>' + escapar(co.consentimiento) + '</span></label>' +
          '<p class="error" id="error-envio" role="alert" hidden></p>' +
          '<div class="acciones">' +
            '<button type="submit" class="boton boton--principal">' + escapar(co.boton) + '</button>' +
            '<button type="button" class="enlace" data-accion="continuar">' + escapar(co.continuar) + '</button>' +
          '</div>' +
        '</form>' +
      '</div>' +

      '<hr class="filete">' +
      '<p class="pequeno nota-final">' + enriquecer(C.notaFinal) + '</p>';

    mostrar(html, {
      clase: 'resultado',
      alMostrar: function (el) {
        var bloque = el.querySelector('#correo');
        var form = el.querySelector('.formulario');

        el.querySelector('[data-accion="guardar"]').addEventListener('click', function () {
          bloque.scrollIntoView({ behavior: movimientoReducido.matches ? 'auto' : 'smooth', block: 'start' });
          window.setTimeout(function () { form.querySelector('#nombre').focus({ preventScroll: true }); }, movimientoReducido.matches ? 0 : 450);
        });

        el.querySelector('[data-accion="imprimir"]').addEventListener('click', function () {
          window.print();
        });

        form.addEventListener('submit', function (e) {
          e.preventDefault();
          enviarConCorreo(form);
        });

        el.querySelector('[data-accion="continuar"]').addEventListener('click', function () {
          enviarSinCorreo(form);
        });
      }
    });
  }

  /* ---------- Envío al Worker ---------- */

  function datosBase(form) {
    return {
      respuestas: estado.respuestas.map(function (r) { return LETRAS[r]; }),
      resultado: estado.resultado,
      origen: estado.origen,
      web: form.querySelector('#web').value // campo trampa para robots
    };
  }

  function correoValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
  }

  function enviar(datos) {
    return fetch(CONFIG.workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
      keepalive: true
    });
  }

  function enviarConCorreo(form) {
    var campoCorreo = form.querySelector('#email');
    var errorCorreo = form.querySelector('#error-correo');
    var errorEnvio = form.querySelector('#error-envio');
    var boton = form.querySelector('[type="submit"]');
    var correo = campoCorreo.value.trim();

    errorEnvio.hidden = true;

    if (!correoValido(correo)) {
      errorCorreo.textContent = UI.errorCorreo;
      errorCorreo.hidden = false;
      campoCorreo.setAttribute('aria-invalid', 'true');
      campoCorreo.setAttribute('aria-describedby', 'error-correo info-correo');
      campoCorreo.focus();
      return;
    }
    errorCorreo.hidden = true;
    campoCorreo.removeAttribute('aria-invalid');
    campoCorreo.setAttribute('aria-describedby', 'info-correo');

    var datos = datosBase(form);
    datos.nombre = form.querySelector('#nombre').value.trim();
    datos.correo = correo;
    datos.consentimiento = form.querySelector('[name="consentimiento"]').checked;

    var textoBoton = boton.textContent;
    boton.disabled = true;
    boton.textContent = UI.enviando;

    enviar(datos)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        estado.enviado = true;
        pantallaFinal(true);
      })
      .catch(function () {
        boton.disabled = false;
        boton.textContent = textoBoton;
        errorEnvio.textContent = UI.errorEnvio;
        errorEnvio.hidden = false;
      });
  }

  function enviarSinCorreo(form) {
    if (!estado.enviado) {
      var datos = datosBase(form);
      datos.nombre = '';
      datos.correo = '';
      datos.consentimiento = false;
      estado.enviado = true;
      // keepalive permite que el envío termine aunque la persona salga de la página.
      enviar(datos).catch(function () { /* sin correo: no bloqueamos a la persona */ });
    }
    pantallaFinal(false);
  }

  /* ---------- Final ---------- */

  function pantallaFinal(conCorreo) {
    var html =
      '<p class="antetitulo">' + escapar(UI.finalAntetitulo) + '</p>' +
      '<h1 class="titulo" tabindex="-1" data-foco>' + escapar(UI.finalTitulo) + '</h1>' +
      '<p class="texto">' + escapar(conCorreo ? UI.finalTextoCorreo : UI.finalTextoSinCorreo) + '</p>' +
      '<hr class="filete filete--corto">' +
      '<div class="acciones">' +
        '<a class="boton boton--principal" href="' + escapar(enlace('web')) + '">' + escapar(UI.volver) + '</a>' +
      '</div>';

    mostrar(html, { clase: 'final' });
  }

  pantallaInicio();
})();
