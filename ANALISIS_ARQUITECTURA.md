# Análisis de Arquitectura: Proyecto landingflyer

Este documento detalla la arquitectura, el flujo de datos y las tecnologías clave del proyecto `landingflyer`. El objetivo es proporcionar una visión clara de su estructura para facilitar futuras mejoras y su comercialización.

## 1. Visión General de la Arquitectura

El proyecto sigue una arquitectura **monorepo**, separando claramente las responsabilidades del cliente y del servidor en dos directorios principales:

-   `frontend/`: Una aplicación de una sola página (SPA) responsable de la interfaz de usuario y la interacción.
-   `backend/`: Un servidor API RESTful que maneja la lógica de negocio, el procesamiento con IA y las integraciones con servicios de terceros.

## 2. Análisis del Backend (`/backend`)

El backend está construido sobre **Node.js** con el framework **Express.js**. Su función principal es orquestar la generación de landing pages y su posterior publicación.

### Tecnologías Clave:

-   **Servidor:** Node.js, Express.js
-   **Inteligencia Artificial:** Google Vertex AI (Gemini 2.0 Flash)
-   **Gestión de Imágenes:** Cloudinary
-   **Despliegue:** Netlify
-   **Manejo de Archivos:** Multer (para subidas), JSZip (para empaquetar)
-   **Parsing HTML:** JSDOM, Cheerio
-   **Cliente HTTP:** Axios

### Endpoints del API:

-   `POST /api/generate-preview`:
    -   **Función:** Es el endpoint central para la creación de la landing page.
    -   **Modo Imagen:** Acepta un archivo de imagen (`flyerImage`). Utiliza la IA de Gemini para interpretar la imagen y generar un `HTML` a partir de ella.
    -   **Modo Formulario:** Acepta datos estructurados (`businessData` en formato JSON). Construye un prompt detallado para la IA y genera el `HTML`.
    -   **Respuesta:** Devuelve un objeto JSON con el `generatedHtml`.

-   `POST /api/publish`:
    -   **Función:** Publica la landing page generada.
    -   **Proceso:**
        1.  Recibe el `htmlContent` y un `siteName`.
        2.  Utiliza el servicio `processImagesAndReplaceSrc` para escanear el HTML, subir las imágenes a **Cloudinary** y reemplazar las rutas `src`.
        3.  Utiliza `NetlifyZipService` para empaquetar el HTML procesado y desplegarlo como un nuevo sitio en **Netlify**.
    -   **Respuesta:** Devuelve la `url` del sitio publicado, `siteName` y `siteId`.

-   `GET /api/image/unsplash`:
    -   **Función:** Actúa como un proxy para buscar y servir imágenes desde Unsplash, evitando problemas de CORS en el frontend.

## 3. Análisis del Frontend (`/frontend`)

El frontend es una aplicación **React** moderna construida con **Vite**. Proporciona una interfaz fluida para que el usuario genere, previsualice y edite su landing page.

### Tecnologías Clave:

-   **Framework:** React 19
-   **Herramientas de Build:** Vite
-   **Estilos:** Tailwind CSS
-   **Routing:** React Router DOM
-   **Cliente HTTP:** Axios

### Flujo de Componentes y Datos:

1.  **`App.jsx`**: Es el componente raíz que gestiona el estado principal de la aplicación (`isLoading`, `generatedHtml`, `error`, etc.).
2.  **`HeroSection.jsx`**: Contiene los controles de entrada, permitiendo al usuario elegir entre subir una imagen o usar el formulario (`ManualForm.jsx`).
3.  **Interacción con API**: Las funciones `handleGeneratePreview` y `handleManualSubmit` en `App.jsx` llaman al backend para generar el HTML.
4.  **`LandingPreview.jsx`**: Una vez que se recibe el `generatedHtml`, este componente lo renderiza dentro de un `<iframe>` para una previsualización segura y aislada.
5.  **Persistencia**: El HTML generado se guarda en `localStorage` para que otros componentes, como el editor, puedan acceder a él.
6.  **`Editor.jsx`**: (Según tu aclaración) Este componente toma el HTML del `localStorage` y lo abre en una nueva pestaña para permitir una edición más cómoda. Desde aquí, se iniciaría el proceso de publicación.

## 4. Flujo de Trabajo Completo (Usuario Final)

1.  **Generación:** El usuario accede a la web, sube una imagen o rellena el formulario.
2.  **Previsualización:** El sistema genera una landing page con IA y la muestra al instante.
3.  **Edición:** El usuario abre el editor en una nueva pestaña para ajustar el contenido y el diseño del HTML generado.
4.  **Publicación:** Con un clic, el usuario publica su sitio. El backend se encarga de optimizar las imágenes y desplegar la web en Netlify, proporcionando una URL en vivo.

## 5. Puntos de Mejora (Basado en Feedback)

-   **Edición del Template:** La dificultad actual en la edición sugiere que el `Editor.jsx` podría mejorarse. Posibles soluciones incluyen un editor visual (WYSIWYG) o un sistema de componentes más estructurado en lugar de editar HTML crudo.
-   **Calidad del Template:** La estructura "básica y poco atractiva" del HTML generado se puede mejorar refinando el `prompt.md` que se envía a la IA. Se le pueden dar instrucciones más detalladas sobre diseño, estructura, responsividad (uso de Flexbox/Grid), y la inclusión de secciones comunes (Galería, Testimonios, FAQ, etc.).
