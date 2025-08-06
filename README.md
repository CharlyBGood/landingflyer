# 🚀 LandingFlyer

**Generador inteligente de Landing Pages a partir de Flyers usando IA**

LandingFlyer es una aplicación web que transforma flyers tradicionales en landing pages modernas y responsive utilizando Google Vertex AI (Gemini). El sistema permite generar, previsualizar, editar y personalizar landing pages de forma intuitiva.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Flujo de Funcionamiento](#-flujo-de-funcionamiento)
- [Configuración y Instalación](#-configuración-e-instalación)
- [Uso de la Aplicación](#-uso-de-la-aplicación)
- [API y Endpoints](#-api-y-endpoints)
- [Sistema de IA](#-sistema-de-ia)
- [Editor Visual](#-editor-visual)
- [Despliegue](#-despliegue)
- [Desarrollo](#-desarrollo)
- [Próximas Funcionalidades](#-próximas-funcionalidades)

---

## ✨ Características

### 🎯 **Funcionalidades Principales**
- **Generación automática**: Convierte flyers en landing pages modernas usando IA
- **Editor visual**: Interfaz intuitiva para personalizar contenido y diseño
- **Diseño responsive**: Optimizado para móvil, tablet y desktop
- **Preview en tiempo real**: Vista previa instantánea de los cambios
- **Gestión de imágenes**: Capacidad de cambiar fondos de secciones
- **Persistencia local**: Guarda cambios en localStorage para sesiones

### 🎨 **Características de Diseño**
- **Mobile-first**: Prioriza la experiencia móvil
- **Paletas inteligentes**: Extrae y evoluciona colores del flyer original
- **Tipografía moderna**: Integración con Google Fonts premium
- **Animaciones sutiles**: Efectos hover y transiciones CSS
- **Accesibilidad**: Cumple estándares WCAG AA

---

## 🏗 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA LANDINGFLYER                │
└─────────────────────────────────────────────────────────────┘

Frontend (React + Vite)                 Backend (Express + VertexAI)
┌─────────────────────────┐             ┌─────────────────────────┐
│                         │             │                         │
│  ┌─────────────────┐    │   HTTP      │  ┌─────────────────┐    │
│  │   HeroSection   │    │   POST      │  │   server.js     │    │
│  └─────────────────┘    │   /api/     │  └─────────────────┘    │
│           │             │   generate  │           │             │
│  ┌─────────────────┐    │   preview   │  ┌─────────────────┐    │
│  │ LandingPreview  │    │             │  │   prompt.md     │    │
│  └─────────────────┘    │◄────────────┤  └─────────────────┘    │
│           │             │             │           │             │
│  ┌─────────────────┐    │             │  ┌─────────────────┐    │
│  │    Editor       │    │             │  │ VertexAI API    │    │
│  │ (Visual Editor) │    │             │  │ (Gemini 2.0)    │    │
│  └─────────────────┘    │             │  └─────────────────┘    │
│           │             │             │                         │
│  ┌─────────────────┐    │             │                         │
│  │  localStorage   │    │             │                         │
│  │ (Persistence)   │    │             │                         │
│  └─────────────────┘    │             │                         │
└─────────────────────────┘             └─────────────────────────┘
```

### **Flujo de Datos:**
1. **Usuario sube flyer** → Frontend captura imagen
2. **Frontend envía** → Backend procesa con VertexAI
3. **IA genera HTML** → Backend retorna landing page
4. **Preview inmediato** → Frontend muestra resultado
5. **Editor visual** → Usuario personaliza contenido
6. **Persistencia local** → Cambios se guardan automáticamente

---

## 🛠 Tecnologías

### **Frontend**
- **React 19.1.0** - Framework principal
- **Vite 7.0.4** - Build tool y dev server
- **Tailwind CSS 4.1.11** - Framework de estilos
- **React Router DOM 7.7.1** - Navegación SPA
- **Axios 1.11.0** - Cliente HTTP
- **TypeScript Support** - Tipado estático

### **Backend**
- **Node.js 20** - Runtime
- **Express 5.1.0** - Framework web
- **Google Cloud VertexAI 1.10.0** - Servicios de IA
- **Multer 2.0.2** - Manejo de archivos
- **CORS 2.8.5** - Políticas de seguridad
- **dotenv 17.2.1** - Variables de entorno

### **Infraestructura**
- **Google Cloud Run** - Hosting del backend
- **Docker** - Containerización
- **Google Vertex AI** - Motor de IA (Gemini 2.0 Flash)
- **Service Account** - Autenticación GCP

---

## 📁 Estructura del Proyecto

```
landingflyer/
├── frontend/                           # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Editor.jsx              # Editor visual principal
│   │   │   ├── HeroSection.jsx         # Sección de carga de archivos
│   │   │   ├── LandingPreview.jsx      # Preview de landing pages
│   │   │   ├── Navbar.jsx              # Barra de navegación
│   │   │   ├── Footer.jsx              # Pie de página
│   │   │   └── utilities/
│   │   │       └── Icons.jsx           # Componentes de iconos
│   │   ├── styles/
│   │   │   ├── App.css                 # Estilos principales
│   │   │   ├── Editor.css              # Estilos del editor
│   │   │   └── index.css               # Estilos globales
│   │   ├── App.jsx                     # Componente principal
│   │   ├── main.jsx                    # Punto de entrada
│   │   └── index.css                   # Configuración Tailwind
│   ├── public/
│   │   └── sinapsiabrain.svg           # Logo/iconos
│   ├── package.json                    # Dependencias frontend
│   ├── vite.config.js                  # Configuración Vite
│   ├── eslint.config.js                # Linting rules
│   └── index.html                      # HTML base
│
├── backend/                            # API Express
│   ├── server.js                       # Servidor principal
│   ├── prompt.md                       # Sistema de prompt para IA
│   ├── page_template.html              # Template base (legacy)
│   ├── credentials.json                # Credenciales GCP
│   ├── .env                           # Variables de entorno
│   ├── Dockerfile                      # Configuración Docker
│   ├── package.json                    # Dependencias backend
│   └── .gitignore                      # Archivos ignorados
│
└── README.md                           # Documentación (este archivo)
```

---

## ⚡ Flujo de Funcionamiento

### **1. Carga y Análisis**
```
Usuario selecciona flyer → Upload multipart/form-data → Backend recibe imagen
```

### **2. Procesamiento con IA**
```
server.js carga prompt.md → VertexAI (Gemini 2.0) analiza imagen + prompt → 
Genera HTML completo con CSS embebido
```

### **3. Generación de Landing Page**
```
IA aplica:
├── Análisis comercial (tipo de negocio, público objetivo)
├── Diseño moderno (gradientes, sombras, responsive)
├── Paleta de colores evolucionada
├── Estructura HTML semántica
└── CSS moderno con variables
```

### **4. Preview y Edición**
```
Frontend recibe HTML → Muestra preview en iframe → 
Usuario accede al Editor → Edición visual en tiempo real
```

### **5. Persistencia**
```
localStorage guarda cambios → Sincronización automática → 
Preparación para descarga/hosting
```

---

## 🔧 Configuración e Instalación

### **Prerrequisitos**
- Node.js 20+
- Cuenta Google Cloud Platform
- Proyecto GCP con VertexAI habilitado
- Service Account con permisos VertexAI

### **Configuración Backend**

1. **Variables de entorno** (`.env`):
```bash
GCLOUD_PROJECT=tu-proyecto-gcp
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
PORT=8080
```

2. **Instalación de dependencias**:
```bash
cd backend
npm install
```

3. **Configurar credenciales GCP**:
   - Crear Service Account en GCP
   - Descargar `credentials.json`
   - Colocar en directorio `backend/`

### **Configuración Frontend**

1. **Variables de entorno** (`.env`):
```bash
VITE_API_URL=http://localhost:8080
# Para producción: VITE_API_URL=https://tu-backend.run.app
```

2. **Instalación de dependencias**:
```bash
cd frontend
npm install
```

### **Desarrollo Local**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Acceder a: `http://localhost:5173`

---

## 🎯 Uso de la Aplicación

### **Para Usuarios Finales**

#### **Paso 1: Subir Flyer**
1. Acceder a la aplicación web
2. Hacer click en "Seleccionar imagen" 
3. Elegir archivo de flyer (JPG, PNG, etc.)
4. Hacer click en "Generar Vista Previa"

#### **Paso 2: Revisar Resultado**
- La IA procesará la imagen (15-30 segundos)
- Se mostrará la landing page generada
- Preview responsive automático

#### **Paso 3: Editar (Opcional)**
1. Hacer click en "Abrir Editor a Pantalla Completa"
2. Activar modo edición
3. Personalizar textos haciendo click directo
4. Cambiar fondos usando botones "🖼️ Fondo"
5. Guardar cambios

#### **Paso 4: Finalizar**
- Los cambios se guardan automáticamente
- Landing page lista para hosting/descarga

### **Para Desarrolladores**

#### **Extender Funcionalidad**
- Modificar `prompt.md` para cambiar comportamiento de IA
- Actualizar componentes React para nuevas features
- Configurar nuevos endpoints en `server.js`

---

## 📡 API y Endpoints

### **POST /api/generate-preview**

**Descripción**: Genera landing page a partir de flyer

**Request**:
```http
POST /api/generate-preview
Content-Type: multipart/form-data

flyerImage: [archivo de imagen]
```

**Response Success**:
```json
{
  "generatedHtml": "<!DOCTYPE html><html>...</html>"
}
```

**Response Error**:
```json
{
  "error": "Error al generar la vista previa con IA.",
  "details": "mensaje específico del error"
}
```

**Proceso Interno**:
1. Validación de archivo
2. Carga de `prompt.md`
3. Llamada a VertexAI con imagen + prompt
4. Procesamiento de respuesta
5. Limpieza de HTML (eliminación de markdown)
6. Retorno de HTML completo

---

## 🤖 Sistema de IA

### **Prompt Engineering**

El archivo `prompt.md` define el comportamiento de la IA usando el sistema "Stylo":

#### **Principios de Diseño**:
- **Moderno pero no excesivo**: Tendencias actuales sin sobrecomplicar
- **Comercialmente viable**: Funcional para negocios reales  
- **Mobile-first**: Optimización prioritaria para móviles
- **Conversión-focused**: Orientado a generar acciones

#### **Proceso de 3 Fases**:

1. **Análisis Comercial**:
   - Identificación de tipo de negocio
   - Definición de público objetivo
   - Extracción de paleta de colores
   - Identificación de mensaje clave

2. **Diseño Moderno**:
   - Layout 2024/2025 (gradientes, sombras suaves)
   - Paleta web-ready con contraste WCAG AA
   - Tipografía premium (Google Fonts)
   - Responsive design con breakpoints específicos

3. **Desarrollo Comercial**:
   - Estructura HTML semántica obligatoria
   - CSS moderno con variables
   - Elementos editables marcados
   - Performance optimizado

#### **Tecnología**:
- **Modelo**: Gemini 2.0 Flash (VertexAI)
- **Modalidad**: Multimodal (texto + imagen)
- **Output**: HTML completo con CSS embebido

---

## ✏️ Editor Visual

### **Características del Editor**

#### **Edición de Texto**:
- **Activación**: Botón "Activar Edición"
- **Método**: Click directo en elementos con `data-editable="true"`
- **Visual**: Outline azul en elementos editables
- **Persistencia**: Auto-guardado en localStorage

#### **Gestión de Fondos**:
- **Aparición**: Solo en modo edición
- **Elementos**: `section`, `div`, `header`, `main` (>200px ancho)
- **Funcionalidad**: Upload de imagen → aplicación como background-image
- **Posicionamiento**: Esquina superior derecha de cada contenedor

#### **Controles**:
```javascript
// Estados del editor
isEditMode: boolean     // Activa/desactiva edición
handleSaveChanges()     // Guarda cambios y sale de edición
localStorage sync       // Sincronización automática
```

#### **Flujo de Edición**:
1. Usuario activa edición → Aparecen controles
2. Edita texto → Cambios en tiempo real
3. Cambia fondos → Upload y aplicación inmediata
4. Guarda cambios → Limpieza de controles y persistencia
5. Sale de edición → Modo preview limpio

---

## 🚀 Despliegue

### **Backend en Google Cloud Run**

#### **Build y Deploy**:
```bash
# Configurar proyecto
gcloud config set project tu-proyecto-gcp

# Build imagen
gcloud builds submit --tag gcr.io/tu-proyecto/landingflyer-backend

# Deploy a Cloud Run
gcloud run deploy landingflyer-backend \
  --image gcr.io/tu-proyecto/landingflyer-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### **Configuración Cloud Run**:
- **CPU**: 1 vCPU
- **Memoria**: 512 MB
- **Concurrencia**: 100 requests
- **Timeout**: 60 segundos
- **Variables de entorno**: Automáticas desde service account

### **Frontend (Netlify/Vercel)**

#### **Build**:
```bash
cd frontend
npm run build
# Deploy carpeta dist/
```

#### **Variables de entorno**:
```bash
VITE_API_URL=https://tu-backend.run.app
```

---

## 🛠 Desarrollo

### **Scripts Disponibles**

#### **Backend**:
```bash
npm run dev     # Desarrollo con nodemon
npm start       # Producción
```

#### **Frontend**:
```bash
npm run dev     # Servidor desarrollo (localhost:5173)
npm run build   # Build para producción
npm run preview # Preview del build
npm run lint    # Linting con ESLint
```

### **Estructura de Desarrollo**

#### **Workflow Recomendado**:
1. **Feature branches** para nuevas funcionalidades
2. **Testing local** antes de commits
3. **Deploy staging** para validación
4. **Deploy production** con releases

#### **Debugging**:
- **Backend**: Logs en Cloud Run console
- **Frontend**: DevTools + React Developer Tools
- **IA**: Logs detallados en server.js

---

## 🔮 Próximas Funcionalidades

### **Fase 2: E-commerce**
- [ ] **Carrito de compras** integrado
- [ ] **Pasarela de pagos** (Stripe/PayPal)
- [ ] **Templates premium** de pago
- [ ] **Hosting automático** post-compra

### **Fase 3: Personalización Avanzada**
- [ ] **Color picker** integrado en editor
- [ ] **Biblioteca de elementos** (botones, secciones)
- [ ] **Fuentes personalizadas** upload
- [ ] **Animaciones configurables**

### **Fase 4: Colaboración**
- [ ] **Cuentas de usuario** y autenticación
- [ ] **Proyectos guardados** en cloud
- [ ] **Comentarios y revisiones**
- [ ] **Equipos y permisos**

### **Fase 5: Analytics y SEO**
- [ ] **Google Analytics** integración
- [ ] **SEO optimizer** automático
- [ ] **Performance monitoring**
- [ ] **A/B testing** de landing pages

---

## 📞 Soporte y Contacto

**Desarrollador**: @charlybgood  
**Repositorio**: [github.com/CharlyBGood/landingflyer](https://github.com/CharlyBGood/landingflyer)

### **Reportar Issues**:
1. Crear issue en GitHub con detalles
2. Incluir logs de error si aplica
3. Especificar pasos para reproducir

### **Contribuciones**:
1. Fork del repositorio
2. Feature branch con cambios
3. Pull request con descripción detallada

---

**¡Transforma tus flyers en landing pages profesionales en minutos!** 🎨✨
