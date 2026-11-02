/*
 * Textos de la autoevaluación, copiados de contenido.md.
 * [texto](clave) crea un enlace con la dirección de config.js → enlaces.clave.
 * __________ se muestra como un espacio para completar.
 */
window.VALCARAH_CONTENIDO = {
  inicio: {
    antetitulo: 'Autoevaluación Valcarah',
    titulo: '¿Qué necesitas para avanzar ahora?',
    parrafos: [
      'Quizá has dedicado tanto espacio a sostener tu vida que tus proyectos han quedado para después.',
      'Estas diez preguntas te ayudarán a reconocer qué necesitas hoy: ordenar prioridades, elegir una dirección o sostener lo que ya has comenzado.',
      'Piensa en un proyecto o cambio que te gustaría retomar y responde teniendo en cuenta las últimas cuatro semanas. Si todavía no sabes cuál elegir, también puedes empezar.',
      'No hay respuestas correctas ni etapas mejores que otras. El resultado es una orientación para elegir tu siguiente paso.'
    ],
    boton: 'Empezar',
    meta: '10 preguntas · Resultado en tu correo',
    aviso: 'Esta es una herramienta de reflexión personal, no una evaluación psicológica.'
  },

  preguntas: [
    {
      texto: 'Cuando piensas en los proyectos o cambios que quieres retomar…',
      opciones: [
        'Hay varios asuntos y necesito elegir cuál merece atención primero.',
        'Hay uno que me importa especialmente, aunque todavía necesito definir su dirección.',
        'Tengo uno elegido y sé hacia dónde quiero avanzar.'
      ]
    },
    {
      texto: 'Respecto a ese proyecto o cambio…',
      opciones: [
        'Todavía necesito aclarar qué quiero conseguir.',
        'Sé qué quiero conseguir, pero necesito decidir cómo empezar.',
        'He elegido una dirección y definido una primera acción.'
      ]
    },
    {
      texto: 'En las últimas cuatro semanas…',
      opciones: [
        'No he empezado porque todavía necesito elegir una prioridad.',
        'He elegido algo que quiero hacer, pero aún no he realizado una primera acción.',
        'He realizado al menos una acción relacionada con lo que elegí.'
      ]
    },
    {
      texto: 'Para decidir qué merece tu tiempo, ¿qué necesitas ahora?',
      opciones: [
        'Distinguir qué es importante para mí entre varias demandas.',
        'Comparar opciones y sus consecuencias antes de elegir.',
        'Revisar si mis acciones siguen respondiendo a lo que elegí.'
      ]
    },
    {
      texto: '¿Qué pregunta te ayudaría más en este momento?',
      opciones: [
        '¿Qué necesita atención primero?',
        '¿Qué dirección quiero explorar y cómo puedo probarla?',
        '¿Cómo doy continuidad a lo que he empezado?'
      ]
    },
    {
      texto: 'Si esta semana tuvieras un espacio para trabajar en tu proyecto, lo dedicarías a…',
      opciones: [
        'Ordenar mis ideas y elegir una prioridad.',
        'Tomar una decisión y concretar una primera acción.',
        'Realizar o ajustar una acción que ya tengo en marcha.'
      ]
    },
    {
      texto: '¿Qué limita más tu posibilidad de avanzar actualmente?',
      opciones: [
        'El tiempo y la energía disponibles.',
        'La necesidad de cuidar mis ingresos y gastos.',
        'Las dudas sobre el valor de mis conocimientos o mi experiencia.',
        'La falta de información, herramientas o acompañamiento.',
        'Otro aspecto o ninguno de los anteriores.'
      ]
    },
    {
      texto: '¿Qué espacio podrías reservar de forma realista durante las próximas dos semanas?',
      opciones: [
        'Ahora mismo no puedo reservar un tiempo estable.',
        'Un momento breve a la semana.',
        'Uno o dos espacios de trabajo a la semana.',
        'Todavía necesito revisar mi agenda para saberlo.'
      ]
    },
    {
      texto: '¿Qué apoyo te resultaría más útil?',
      opciones: [
        'Una herramienta para trabajar por mi cuenta.',
        'Una sesión individual para pensar una decisión.',
        'Un taller o círculo para trabajar junto a otras mujeres.',
        'Acompañamiento para estructurar una idea de negocio.',
        'Todavía no lo sé.'
      ]
    },
    {
      texto: '¿Qué relación tiene este proyecto con emprender a partir de tus conocimientos?',
      opciones: [
        'Mi proyecto no está relacionado con emprender.',
        'Me interesa explorarlo, pero todavía no tengo una idea.',
        'Tengo una idea inicial, pero necesito comprobar si quiero desarrollarla.',
        'Quiero desarrollar una idea y probarla con posibles clientes.'
      ]
    }
  ],

  botonFinal: 'Ver mi orientación',

  // Pantalla final: datos obligatorios para recibir la orientación por correo.
  correo: {
    antetitulo: 'Autoevaluación Valcarah',
    titulo: 'Pon tus datos para añadir tus respuestas.',
    campoNombre: 'Nombre',
    campoCorreo: 'Correo electrónico',
    campoTelefono: 'Teléfono',
    info: 'Usaremos tus datos para enviarte el resultado y la herramienta solicitados. Consulta la [política de privacidad](privacidad).',
    consentimiento: 'También quiero recibir las cartas de Judith y novedades de Valcarah. Puedo darme de baja cuando quiera.',
    boton: 'Enviarme mi resultado'
  },

  notaFinal: 'Esta herramienta no evalúa tu salud mental ni sustituye un acompañamiento profesional. Si estás atravesando un malestar que dificulta tu vida cotidiana, puedes buscar apoyo profesional además de trabajar en tus proyectos.',

  // Textos de interfaz que no aparecen en contenido.md (puedes cambiarlos aquí).
  interfaz: {
    pregunta: 'Pregunta',
    de: 'de',
    siguiente: 'Siguiente',
    anterior: 'Anterior',
    errorNombre: 'Escribe tu nombre.',
    errorCorreo: 'Escribe un correo electrónico válido.',
    errorTelefono: 'Escribe un teléfono válido, con prefijo si no es de España.',
    errorEnvio: 'No hemos podido enviar tus datos. Inténtalo de nuevo en unos minutos.',
    enviando: 'Enviando…',
    finalAntetitulo: 'Autoevaluación Valcarah',
    finalTitulo: 'Gracias',
    finalTexto: 'Tu orientación y la herramienta están de camino a tu correo.',
    volver: 'Volver a Valcarah'
  }
};
