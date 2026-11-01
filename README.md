# Autoevaluación Valcarah

- `docs/`: página estática (HTML, CSS y JavaScript) publicada con GitHub Pages en **diagnostico.valcarah.com**.
- `worker/`: Cloudflare Worker **diagnostico-valcarah**. Recibe los datos, los envía a Systeme y guarda en Cloudflare KV las respuestas sin correo.

---

## 1. La página (`docs/`)

| Archivo | Para qué sirve |
|---|---|
| `docs/js/config.js` | **Dirección del Worker y todos los enlaces.** Si un enlace está vacío, se usa https://www.valcarah.com. |
| `docs/js/contenido.js` | Todos los textos de `contenido.md`. Al final están los textos de interfaz que no venían en ese archivo, como «Siguiente», «Anterior» o la pantalla de agradecimiento. |
| `docs/js/app.js` | Pantallas, puntuación y envío. |
| `docs/css/estilos.css` | Diseño. |
| `docs/CNAME` | Dominio `diagnostico.valcarah.com`. |

**Puntuación:** en las preguntas 1 a 6, la primera opción suma a caos, la segunda a claridad y la tercera a creación. Las preguntas 7 a 10 no puntúan. Si hay empate, gana la etapa anterior (caos > claridad > creación). El mensaje adaptado depende de la respuesta a la pregunta 7.

**Origen:** `https://diagnostico.valcarah.com/?origen=taller-mayo` envía `taller-mayo`. Sin parámetro, se envía `directo`.

### Publicar con GitHub Pages

1. En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**. Elige la rama `main` y la carpeta `/docs`.
2. En **Custom domain** ya debería aparecer `diagnostico.valcarah.com` (sale del archivo CNAME). Cuando el certificado esté listo, marca **Enforce HTTPS**.
3. En el DNS de valcarah.com, crea un registro **CNAME**: nombre `diagnostico`, valor `judrojasb.github.io`.

---

## 2. El Worker (`worker/worker.js`)

### Qué hace

- **Con correo:**
  1. Busca el contacto en Systeme por su correo. Si no existe, lo crea; si existe, lo actualiza.
  2. Rellena los campos `etapa`, `limite`, `apoyo`, `emprender`, `origen` y `respuestas`, y también el nombre (`first_name`), si lo hay.
  3. Añade la etiqueta `diagnostico-caos`, `diagnostico-claridad` o `diagnostico-creacion`. Primero quita las etiquetas `diagnostico-…` que el contacto ya tuviera, para que la automatización vuelva a enviar el correo si la persona repite la autoevaluación.
  4. Añade `newsletter` **solo** si la casilla está marcada. Nunca la quita.
- **Sin correo:** guarda la fecha, el resultado, las respuestas y el origen en KV. No guarda ningún dato personal.
- Solo acepta peticiones que llegan desde `https://diagnostico.valcarah.com`.
- **No crea campos personalizados.** Tienen que existir en Systeme con estos slugs exactos: `etapa`, `limite`, `apoyo`, `emprender`, `origen` y `respuestas`. Las etiquetas, en cambio, las crea si no existen.

Valores que se guardan:

| Campo | Valor |
|---|---|
| `etapa` | `caos`, `claridad` o `creacion` |
| `limite` | Texto de la respuesta 7 |
| `apoyo` | Texto de la respuesta 9 |
| `emprender` | Texto de la respuesta 10 |
| `origen` | Valor de `?origen=` o `directo` |
| `respuestas` | `1:a \| 2:b \| … \| 10:c` |

### Pegarlo en el panel de Cloudflare (sin instalar nada)

1. Entra en **dash.cloudflare.com → Compute (Workers) → Workers y Pages → Crear → Crear Worker**. Si el panel te ofrece plantillas, elige **«Hello World»**.
2. Nombre: `diagnostico-valcarah`. Pulsa **Deploy**: así se crea el Worker con el código de ejemplo.
3. Pulsa **Edit code**. Borra todo el contenido de `worker.js`, pega el contenido de `worker/worker.js` de este repositorio y pulsa **Deploy**.
4. Ve a **Settings → Variables and Secrets → Add**:
   - Tipo **Secret**, nombre `SYSTEME_API_KEY`, valor: tu clave de Systeme (en Systeme: **Configuración → Clave API pública**).
   - Opcional: tipo **Secret**, nombre `EXPORT_TOKEN`, valor: una contraseña larga inventada. Sirve para exportar las estadísticas (ver más abajo).
5. Copia la dirección del Worker (`https://diagnostico-valcarah.<tu-subdominio>.workers.dev`) y pégala en `docs/js/config.js` → `workerUrl`.

### Crear el KV para las respuestas sin correo

1. En el panel: **Storage & Databases → Workers KV → Create instance**. Nómbralo `diagnosticos`.
2. Vuelve al Worker: **Bindings → Add binding → KV namespace**.
   - Nombre de la variable: **`DIAGNOSTICOS`** (en mayúsculas, exactamente así).
   - Espacio de nombres KV: `diagnosticos`.
3. Guarda. El Worker se vuelve a desplegar solo.

Cada respuesta sin correo se guarda con una clave del tipo `sin-correo:2026-11-01T10:00:00.000Z:ab12cd34`.

### Exportar los datos

- **Ver entradas sueltas:** en **Workers KV → diagnosticos → KV Pairs** puedes ver cada registro.
- **Descargar un CSV para Excel** (requiere el secreto `EXPORT_TOKEN`). Abre en el navegador:
  - Todas las respuestas: `https://diagnostico-valcarah.<tu-subdominio>.workers.dev/exportar?token=TU_TOKEN`
  - Solo un evento: `https://diagnostico-valcarah.<tu-subdominio>.workers.dev/exportar?token=TU_TOKEN&origen=taller-mayo`

  Se descarga un CSV separado por punto y coma, con las columnas fecha, origen, resultado, respuestas, limite, apoyo y emprender. Se abre directamente en Excel en español. Si no creas `EXPORT_TOKEN`, esta dirección no existe.

### Si algo falla

En el Worker, ve a **Logs** (o **Observability**) y pulsa **Begin log stream**. Haz una prueba desde la página. El Worker escribe el error exacto que devuelve Systeme, por ejemplo cuando falta un campo personalizado.

> El Worker solo acepta peticiones desde `https://diagnostico.valcarah.com`. Si pruebas la página en otra dirección (localhost, github.io…), el Worker la rechazará con 403. Es lo esperado.

---

## 3. Systeme: correo de entrega

El Worker no envía correos. Créalos en Systeme:

1. Crea los campos personalizados (**Contactos → Campos**) con los slugs `etapa`, `limite`, `apoyo`, `emprender`, `origen` y `respuestas`.
2. Crea tres reglas de automatización. Disparador: **Etiqueta añadida** (`diagnostico-caos`, `diagnostico-claridad` o `diagnostico-creacion`). Acción: **Enviar correo**.
3. Texto del correo (de `contenido.md`):

```
Asunto: Tu orientación Valcarah: [ordenar / decidir / sostener]

Hola, [nombre]:

Por tus respuestas, hoy puede ayudarte empezar por [necesidad].

[Resumen breve del resultado correspondiente].

Aquí puedes consultar tu herramienta: [nombre de la herramienta y enlace].

No necesitas completarla toda hoy. Empieza por el primer paso y elige cuándo quieres continuar.

Esta orientación refleja tus respuestas de este momento. Puedes revisarla si cambian tus prioridades o tus circunstancias.

Judith Rojas Creadora de Valcarah
```

Para cada etapa:

| Etiqueta | Asunto | [necesidad] | Herramienta |
|---|---|---|---|
| `diagnostico-caos` | …: ordenar | ordenar prioridades | Una prioridad con criterio propio |
| `diagnostico-claridad` | …: decidir | elegir una dirección | Dos opciones, una decisión |
| `diagnostico-creacion` | …: sostener | sostener acciones | Un compromiso que puedas sostener |

Para el nombre puedes usar la variable de nombre de Systeme (`first_name`).
