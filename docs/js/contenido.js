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
    meta: '10 preguntas · Resultado en pantalla · Correo opcional',
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

  // Mensaje adaptado según la respuesta a la pregunta 7 (a, b, c, d, e).
  mensajesLimite: [
    'Tu siguiente paso necesita caber en tu vida actual. Puedes reducir la acción o empezar por liberar un pequeño espacio.',
    'Incluye un límite de gasto y una condición para cuidar tus ingresos. Explorar una posibilidad no exige dejar tu trabajo.',
    'Busca un ejemplo concreto de algo que hayas aprendido, resuelto o enseñado. Utilízalo como información al elegir tu siguiente paso.',
    'Define qué dato, herramienta o conversación necesitas antes de avanzar. Conseguirlo puede ser tu primera acción.',
    'Adapta la herramienta a la condición que más influye en tu decisión actual.'
  ],

  resultados: {
    caos: {
      numero: 'I',
      etapa: 'Caos',
      subtitulo: 'Ordenar prioridades',
      titular: 'Empieza por elegir qué merece espacio.',
      parrafos: [
        'Por tus respuestas, puede ayudarte ordenar lo que está pidiendo tu atención antes de definir un plan.',
        'Quizá conviven responsabilidades, ideas y proyectos que te importan. Elegir una prioridad puede darte un punto de partida más manejable.',
        'No significa resolver todo ni abandonar lo demás. Significa decidir qué atender primero, desde tu situación actual.'
      ],
      herramienta: {
        nombre: 'Una prioridad con criterio propio',
        intro: 'Reserva un momento breve y trabaja estos pasos:',
        pasos: [
          { t: 'Escribe hasta tres asuntos o proyectos que quieras atender.', d: 'Limita la lista para poder trabajar con ella.' },
          { t: 'Elige dos valores que quieras cuidar al decidir.', d: 'Por ejemplo: estabilidad, autonomía, familia, aprendizaje, salud, creatividad o contribución. Puedes añadir los tuyos.' },
          { t: 'Revisa cada asunto.', sub: [
            '¿Por qué importa para mí?',
            '¿Qué cambiaría si le diera algo de atención?',
            '¿Qué puedo hacer, en qué puedo influir y qué no controlo?',
            '¿Qué espacio requiere en mi realidad actual?'
          ] },
          { t: 'Elige uno para las próximas dos semanas.', d: 'Completa: Mi prioridad será __________ porque quiero cuidar __________.' },
          { t: 'Define una acción pequeña.', d: 'Haré __________ el día __________. Revisaré cómo me fue el día __________. Tu primera acción puede ser buscar información, pedir apoyo o reservar tiempo.' }
        ]
      },
      siguientePaso: [
        'Si necesitas ayuda para ordenar las opciones y elegir, puedes consultar una [sesión individual](sesionIndividual) conmigo. Si prefieres trabajar acompañada por otras mujeres, consulta los [talleres y círculos](talleresCirculos) disponibles.'
      ],
      accionGratuita: 'Guardar mi herramienta',
      accionSecundaria: { texto: 'Explorar formas de acompañamiento', enlace: 'talleresCirculos' }
    },

    claridad: {
      numero: 'II',
      etapa: 'Claridad',
      subtitulo: 'Elegir una dirección',
      titular: 'Convierte lo que te importa en una decisión posible.',
      parrafos: [
        'Por tus respuestas, parece que hay algo a lo que quieres dar espacio, pero necesitas elegir cómo avanzar o concretar el inicio.',
        'Puede que estés comparando opciones, buscando información o cuidando una estabilidad que te ha costado construir.',
        'Tu siguiente paso puede ser una decisión pequeña que te permita explorar una dirección y aprender antes de comprometer más tiempo o recursos.'
      ],
      herramienta: {
        nombre: 'Dos opciones, una decisión',
        intro: '',
        pasos: [
          { t: 'Escribe la decisión que necesitas tomar.', d: 'Por ejemplo: Quiero decidir qué proyecto retomar primero.' },
          { t: 'Define dos opciones concretas.', d: 'Evita comparar una opción real con una idea perfecta e indefinida.' },
          { t: 'Elige hasta tres criterios propios.', d: 'Puedes considerar valores personales, tiempo, coste, estabilidad económica, aprendizaje o responsabilidades.' },
          { t: 'Compara las opciones.', d: 'Para cada una, responde:', sub: [
            '¿Cómo encaja con mis criterios?',
            '¿Qué requiere de mí?',
            '¿Qué necesito averiguar?',
            '¿Puedo probarla a pequeña escala?'
          ] },
          { t: 'Elige una decisión o una prueba.', d: 'Si tienes información suficiente: Durante las próximas dos semanas voy a explorar __________. Si todavía te falta información: Antes de decidir, voy a comprobar __________ mediante __________.' },
          { t: 'Pon fecha al primer paso y a la revisión.', d: 'Mi primera acción será __________ el día __________. Después revisaré __________.' }
        ]
      },
      siguientePaso: [
        'Una [sesión individual](sesionIndividual) puede ayudarte a contrastar opciones, aclarar tus criterios y salir con una decisión y una primera acción.'
      ],
      accionGratuita: 'Guardar mi herramienta',
      accionSecundaria: { texto: 'Consultar la sesión individual', enlace: 'sesionIndividual' }
    },

    creacion: {
      numero: 'III',
      etapa: 'Creación',
      subtitulo: 'Sostener acciones',
      titular: 'Dale continuidad a lo que has elegido.',
      parrafos: [
        'Por tus respuestas, has definido una dirección y comenzado a actuar.',
        'Ahora puede ayudarte revisar cómo encaja ese proyecto en tu vida, qué compromisos puedes mantener y qué ajustar cuando aparezcan obstáculos.',
        'Avanzar también incluye cambiar una acción, reducir su tamaño o hacer una pausa con una fecha de revisión.'
      ],
      herramienta: {
        nombre: 'Un compromiso que puedas sostener',
        intro: '',
        pasos: [
          { t: 'Elige una acción que quieras mantener durante dos semanas.', d: 'Debe ser concreta y estar relacionada con tu prioridad.' },
          { t: 'Comprueba que responde a tus criterios.', sub: [
            '¿Por qué merece mi tiempo?',
            '¿Qué valor quiero cuidar?',
            '¿Es compatible con mis responsabilidades actuales?'
          ] },
          { t: 'Identifica un obstáculo probable.', d: 'Elige uno: cansancio, horario, dudas, interrupciones o falta de información.' },
          { t: 'Prepara una respuesta concreta.', d: 'Completa: Si ocurre __________, entonces haré __________. Ejemplo: Si el jueves no puedo dedicar treinta minutos al proyecto, reservaré quince minutos el sábado para completar la parte más importante.' },
          { t: 'Define una versión mínima.', d: 'En una semana difícil, mi compromiso mínimo será __________.' },
          { t: 'Fija una revisión.', d: 'El día __________ revisaré qué funcionó, qué necesito cambiar y si quiero mantener esta prioridad.' }
        ]
      },
      siguientePaso: [
        'Puedes continuar con la herramienta o buscar acompañamiento para sostener y revisar tus decisiones.',
        'Si tu proyecto consiste en emprender con tus conocimientos, puedes conocer [Valcarah Lab](valcarahLab) y comprobar si su programa encaja con tu idea, tu tiempo y tu presupuesto.'
      ],
      accionGratuita: 'Guardar mi herramienta',
      accionSecundaria: { texto: 'Explorar mi siguiente paso', enlace: 'siguientePaso' }
    }
  },

  etiquetas: {
    herramienta: 'Tu herramienta',
    siguientePaso: 'Tu siguiente paso',
    imprimir: 'Imprimir o guardar como PDF'
  },

  correo: {
    titulo: '¿Quieres conservar tu orientación y la herramienta?',
    texto: 'Déjame tu correo y te enviaré una copia para que puedas trabajar con ella cuando te venga bien.',
    campoNombre: 'Nombre, opcional',
    campoCorreo: 'Correo electrónico',
    info: 'Usaremos tu correo para enviarte el resultado y la herramienta solicitados. Consulta la [política de privacidad](privacidad).',
    consentimiento: 'También quiero recibir las cartas de Judith y novedades de Valcarah. Puedo darme de baja cuando quiera.',
    boton: 'Enviarme mi resultado',
    continuar: 'Continuar sin dejar mi correo'
  },

  notaFinal: 'Esta herramienta no evalúa tu salud mental ni sustituye un acompañamiento profesional. Si estás atravesando un malestar que dificulta tu vida cotidiana, puedes buscar apoyo profesional además de trabajar en tus proyectos.',

  // Textos de interfaz que no aparecen en contenido.md (puedes cambiarlos aquí).
  interfaz: {
    pregunta: 'Pregunta',
    de: 'de',
    siguiente: 'Siguiente',
    anterior: 'Anterior',
    etapas: 'Las tres etapas',
    errorCorreo: 'Escribe un correo electrónico válido.',
    errorEnvio: 'No hemos podido enviar tus datos. Inténtalo de nuevo en unos minutos.',
    enviando: 'Enviando…',
    finalAntetitulo: 'Autoevaluación Valcarah',
    finalTitulo: 'Gracias',
    finalTextoCorreo: 'Tu orientación y la herramienta están de camino a tu correo.',
    finalTextoSinCorreo: 'Has dedicado este tiempo a tu proyecto. Ese ya es un primer paso.',
    volver: 'Volver a Valcarah'
  }
};
