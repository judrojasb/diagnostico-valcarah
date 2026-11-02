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
    origen: leerOrigen()
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
            pantallaDatos();
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

  /* ---------- Datos obligatorios ----------
     Al terminar no se muestra el resultado: la persona deja su nombre,
     correo y teléfono, y recibe la orientación por correo (Systeme). */

  function pantallaDatos() {
    var co = C.correo;

    var html =
      '<p class="antetitulo">' + escapar(co.antetitulo) + '</p>' +
      '<h1 class="titulo" tabindex="-1" data-foco>' + escapar(co.titulo) + '</h1>' +
      '<form class="formulario" novalidate>' +
        campo('nombre', co.campoNombre, 'text', 'given-name', 80, '') +
        campo('email', co.campoCorreo, 'email', 'email', 254, ' inputmode="email"') +
        campo('telefono', co.campoTelefono, 'tel', 'tel', 30, ' inputmode="tel"') +
        '<div class="trampa" aria-hidden="true"><label for="web">Web</label><input id="web" name="web" type="text" tabindex="-1" autocomplete="off"></div>' +
        '<p class="pequeno" id="info-datos">' + enriquecer(co.info) + '</p>' +
        '<label class="casilla"><input type="checkbox" name="consentimiento"><span>' + escapar(co.consentimiento) + '</span></label>' +
        '<p class="error" id="error-envio" role="alert" hidden></p>' +
        '<div class="acciones">' +
          '<button type="submit" class="boton boton--principal">' + escapar(co.boton) + '</button>' +
        '</div>' +
      '</form>' +
      '<hr class="filete">' +
      '<p class="pequeno nota-final">' + enriquecer(C.notaFinal) + '</p>';

    mostrar(html, {
      clase: 'datos',
      alMostrar: function (el) {
        var form = el.querySelector('.formulario');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          enviarDatos(form);
        });
      }
    });
  }

  function campo(id, etiqueta, tipo, autocompletar, max, extra) {
    return (
      '<div class="campo">' +
        '<label for="' + id + '">' + escapar(etiqueta) + '</label>' +
        '<input id="' + id + '" name="' + id + '" type="' + tipo + '" autocomplete="' + autocompletar + '" maxlength="' + max + '" required aria-describedby="info-datos"' + extra + '>' +
        '<p class="error" id="error-' + id + '" hidden></p>' +
      '</div>'
    );
  }

  /* ---------- Envío al Worker ---------- */

  function correoValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
  }

  function telefonoValido(valor) {
    var digitos = valor.replace(/\D/g, '');
    return /^[+\d\s().-]+$/.test(valor) && digitos.length >= 7 && digitos.length <= 15;
  }

  function marcarError(form, id, mensaje) {
    var input = form.querySelector('#' + id);
    var error = form.querySelector('#error-' + id);
    if (mensaje) {
      error.textContent = mensaje;
      error.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', 'error-' + id + ' info-datos');
    } else {
      error.hidden = true;
      input.removeAttribute('aria-invalid');
      input.setAttribute('aria-describedby', 'info-datos');
    }
    return !mensaje;
  }

  function enviarDatos(form) {
    var errorEnvio = form.querySelector('#error-envio');
    var boton = form.querySelector('[type="submit"]');
    var nombre = form.querySelector('#nombre').value.trim();
    var correo = form.querySelector('#email').value.trim();
    var telefono = form.querySelector('#telefono').value.trim();

    errorEnvio.hidden = true;

    var ok = [
      marcarError(form, 'nombre', nombre ? '' : UI.errorNombre),
      marcarError(form, 'email', correoValido(correo) ? '' : UI.errorCorreo),
      marcarError(form, 'telefono', telefonoValido(telefono) ? '' : UI.errorTelefono)
    ];
    var primero = ['nombre', 'email', 'telefono'][ok.indexOf(false)];
    if (primero) {
      form.querySelector('#' + primero).focus();
      return;
    }

    var datos = {
      respuestas: estado.respuestas.map(function (r) { return LETRAS[r]; }),
      resultado: estado.resultado,
      origen: estado.origen,
      nombre: nombre,
      correo: correo,
      telefono: telefono,
      consentimiento: form.querySelector('[name="consentimiento"]').checked,
      web: form.querySelector('#web').value // campo trampa para robots
    };

    var textoBoton = boton.textContent;
    boton.disabled = true;
    boton.textContent = UI.enviando;

    fetch(CONFIG.workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        pantallaFinal();
      })
      .catch(function () {
        boton.disabled = false;
        boton.textContent = textoBoton;
        errorEnvio.textContent = UI.errorEnvio;
        errorEnvio.hidden = false;
      });
  }

  /* ---------- Final ---------- */

  function pantallaFinal() {
    var html =
      '<p class="antetitulo">' + escapar(UI.finalAntetitulo) + '</p>' +
      '<h1 class="titulo" tabindex="-1" data-foco>' + escapar(UI.finalTitulo) + '</h1>' +
      '<p class="texto">' + escapar(UI.finalTexto) + '</p>' +
      '<hr class="filete filete--corto">' +
      '<div class="acciones">' +
        '<a class="boton boton--principal" href="' + escapar(enlace('web')) + '">' + escapar(UI.volver) + '</a>' +
      '</div>';

    mostrar(html, { clase: 'final' });
  }

  pantallaInicio();
})();
