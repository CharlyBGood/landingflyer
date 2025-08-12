# Guías de Desarrollo - LandingFlyer

## NOTAS IMPORTANTES PARA COPILOT AI

### 🚨 VERIFICACIÓN DE SERVIDORES
**SIEMPRE verificar si los servidores ya están corriendo antes de intentar iniciarlos**

#### Pasos obligatorios:
1. **Verificar terminales activos**: Revisar el contexto de terminales antes de ejecutar comandos
2. **Evitar conflictos**: No iniciar servidores si ya están corriendo
3. **Verificar puertos**: 
   - Backend: Puerto 3001 (Express)
   - Frontend: Puerto 5173 (Vite)

#### Comandos de verificación recomendados:
```powershell
# Verificar procesos en puerto específico
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# Verificar si el servidor responde
curl http://localhost:3001/api/health
curl http://localhost:5173
```

### 🖥️ COMANDOS WINDOWS POWERSHELL
**Usar sintaxis correcta para Windows PowerShell**

#### Concatenación de comandos:
- ✅ Correcto: `cd backend; npm start`
- ❌ Incorrecto: `cd backend && npm start`

#### Comandos en background:
- ✅ Usar `isBackground: true` en las herramientas
- ✅ Los procesos Node.js se ejecutan correctamente en background

### 🏗️ ARQUITECTURA DEL PROYECTO

#### Backend (Puerto 3001)
- **Framework**: Express 5.1.0 + Node.js 20
- **AI Integration**: Google VertexAI (Gemini 2.0 Flash)
- **Deployment**: NetlifyZipService (Método ZIP oficial)
- **Inicio**: `cd backend; npm start`

#### Frontend (Puerto 5173)
- **Framework**: React 19.1.0 + Vite 7.0.4
- **Styling**: Tailwind CSS 4.1.11
- **Routing**: React Router DOM 7.7.1
- **Inicio**: `cd frontend; npm run dev`

### 📦 SERVICIOS PRINCIPALES

#### NetlifyZipService
- **Propósito**: Deploy atómico usando ZIP Method oficial de Netlify
- **Ubicación**: `backend/services/NetlifyZipService.js`
- **Estado**: ✅ Implementado y optimizado
- **Características**:
  - HTML validation y correción automática
  - Deploy en <30 segundos
  - Diagnósticos detallados
  - Verificación de MIME types

#### Editor de Landing Pages
- **Propósito**: Editor WYSIWYG para personalización en tiempo real
- **Ubicación**: `frontend/src/components/Editor.jsx`
- **Características**:
  - Color theming via CSS variables
  - Background image controls
  - Texto editable en vivo

### 🔧 TROUBLESHOOTING

#### Problema Común: HTML renderizando como texto plano
**Causas identificadas:**
1. DOCTYPE faltante o incorrecto
2. Estructura HTML incompleta
3. MIME type incorrecto en Netlify

**Soluciones implementadas:**
- `validateAndFixHTML()`: Corrige estructura HTML automáticamente
- Verificación de MIME type post-deploy
- Headers HTTP optimizados
- Diagnósticos detallados en logs

#### Estado Actual del Proyecto
- ✅ ZIP Method implementado y funcionando
- ✅ Deploy speed: <30 segundos (vs >5 minutos anterior)
- ⏳ HTML rendering: En investigación (MIME type issues)
- ✅ Architecture: Stable y documentado

### 📝 NOTAS DE DESARROLLO

#### Antes de hacer cambios:
1. Verificar que servidores estén corriendo
2. Revisar logs del terminal
3. Confirmar que no hay conflictos de puerto
4. Testear endpoints críticos

#### Para debug de HTML:
- Revisar archivos en `backend/debug-html/`
- Verificar logs de `validateAndFixHTML()`
- Confirmar estructura HTML completa

---

**Última actualización**: 12 de Agosto, 2025
**Estado del proyecto**: Desarrollo activo - Optimizando HTML rendering
