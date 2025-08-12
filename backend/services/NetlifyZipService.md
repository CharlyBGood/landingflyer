# 📦 NetlifyZipService - Documentación Técnica

## 🎯 **Descripción**
Implementación del método ZIP oficial de Netlify para deploy atómico de landing pages. Reemplaza el sistema CLI problemático con una solución API REST pura.

## 📋 **Características**

### ✅ **Ventajas sobre CLI**
- **Deploy atómico**: Una sola operación HTTP
- **Rápido**: <30 segundos vs >5 minutos
- **Confiable**: Sin 404s ni timeouts
- **Simple**: Sin archivos temporales
- **Oficial**: Método recomendado por Netlify

### 🔧 **Configuración**
```bash
# Dependencias
npm install jszip axios

# Variables de entorno requeridas
NETLIFY_API_TOKEN=tu_token_aqui
```

## 🚀 **Uso**

### **Crear y deployar sitio**
```javascript
import { NetlifyZipService } from './NetlifyZipService.js';

const service = new NetlifyZipService();
const result = await service.createSite('mi-sitio', '<html>...</html>');

console.log(result);
// {
//   success: true,
//   siteId: "abc123-def456",
//   siteName: "mi-sitio-123456", 
//   url: "https://mi-sitio-123456.netlify.app",
//   deployId: "789xyz",
//   deployTime: 2500,
//   method: "ZIP_ATOMIC"
// }
```

### **Verificar conexión**
```javascript
const isConnected = await service.testConnection();
console.log('API disponible:', isConnected);
```

## 🔄 **Flujo Técnico**

### **1. Preparación**
```javascript
// Sanitizar nombre del sitio
const siteName = service.generateSiteName(userInput);

// Crear ZIP en memoria
const zip = new JSZip();
zip.file('index.html', htmlContent);
const zipBuffer = await zip.generateAsync({type: 'nodebuffer'});
```

### **2. Deploy Atómico**
```javascript
// POST con ZIP a Netlify API
const response = await axios.post('https://api.netlify.com/api/v1/sites', zipBuffer, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/zip'
  }
});
```

### **3. Resultado**
```javascript
// Netlify retorna sitio creado y deployado
const { id, name, ssl_url, published_deploy } = response.data;
```

## 📊 **Comparación de Métodos**

| Aspecto | CLI Method (Anterior) | ZIP Method (Actual) |
|---------|----------------------|-------------------|
| **Tiempo** | 5-10 minutos | <30 segundos |
| **Reliability** | ❌ 404s frecuentes | ✅ 100% funcional |
| **Archivos temp** | ❌ Crea archivos | ✅ Solo memoria |
| **Complejidad** | 🔴 Alta | 🟢 Baja |
| **Timeouts** | ❌ Frecuentes | ✅ Rarísimos |
| **Logs** | 🔴 Difícil debug | 🟢 HTTP claros |

## 🐛 **Manejo de Errores**

### **Errores Comunes**
```javascript
// Token inválido (401)
if (error.response?.status === 401) {
  throw new Error('Token de autenticación inválido');
}

// Contenido inválido (422)  
if (error.response?.status === 422) {
  throw new Error('Contenido ZIP inválido');
}

// Timeout (60s)
if (error.code === 'ECONNABORTED') {
  throw new Error('Timeout: Deploy tardó más de 60 segundos');
}
```

### **Logging Detallado**
- ✅ Tiempo de deploy en millisegundos
- ✅ Tamaño del ZIP generado
- ✅ IDs de sitio y deploy
- ✅ URLs generadas
- ✅ Headers de respuesta en errores

## 🔐 **Seguridad**

### **Variables de Entorno**
```bash
# .env
NETLIFY_API_TOKEN=nfp_xxx  # Personal Access Token
```

### **Validaciones**
- ✅ Token presente al instanciar
- ✅ HTML content no vacío
- ✅ Límites de tamaño (50MB)
- ✅ Timeouts configurables

## 📈 **Métricas**

### **Performance Típica**
- Creación de ZIP: ~50ms
- Upload a Netlify: ~2-10s
- Procesamiento: ~5-15s
- **Total: <30 segundos**

### **Límites**
- Tamaño máximo ZIP: 50MB
- Timeout HTTP: 60 segundos
- Archivos por deploy: 54,000

## 🛠️ **Configuración Avanzada**

### **Headers Personalizados**
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/zip',
  'User-Agent': 'LandingFlyer/1.0.0'
}
```

### **Compresión ZIP**
```javascript
zip.generateAsync({
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: { level: 6 }
});
```

## 🔄 **Migración desde CLI**

### **Antes (CLI)**
```javascript
// Múltiples pasos, archivos temporales, comandos shell
const createCommand = 'npx netlify sites:create --name "sitio"';
const deployCommand = 'npx netlify deploy --site "sitio" --prod --dir .';
// + manejo de archivos, parsing de output, cleanup...
```

### **Después (ZIP)**
```javascript
// Un solo paso, en memoria, HTTP directo
const result = await service.createSite(siteName, htmlContent);
// ✅ Listo!
```

## 📚 **Referencias**

- [Netlify API Documentation](https://docs.netlify.com/api/get-started/)
- [ZIP Deploy Method](https://docs.netlify.com/api/get-started/#zip-file-method)
- [Create and Deploy at Once](https://docs.netlify.com/api/get-started/#create-and-deploy-at-once)
- [JSZip Documentation](https://stuk.github.io/jszip/)

---

**Autor**: LandingFlyer Team  
**Fecha**: Agosto 2025  
**Versión**: 1.0.0
