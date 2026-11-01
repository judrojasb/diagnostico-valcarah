/*
 * CONFIGURACIÓN — el único lugar que necesitas tocar.
 *
 * Los enlaces vacíos ('') usan automáticamente https://www.valcarah.com.
 */
window.VALCARAH_CONFIG = {
  // Dirección del Worker de Cloudflare. Sustituye TU-SUBDOMINIO por el tuyo
  // (lo ves en el panel de Cloudflare, en Workers y Pages).
  workerUrl: 'https://diagnostico-valcarah.TU-SUBDOMINIO.workers.dev',

  enlaces: {
    web: 'https://www.valcarah.com',
    privacidad: 'https://www.valcarah.com/politica-de-privacidad',
    sesionIndividual: '',      // reserva de la sesión individual
    talleresCirculos: '',      // talleres y círculos
    valcarahLab: '',           // Valcarah Lab
    siguientePaso: 'https://www.valcarah.com' // «Explorar mi siguiente paso»
  }
};
