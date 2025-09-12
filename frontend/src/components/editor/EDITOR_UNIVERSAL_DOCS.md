# Editor Universal de Templates

## 🎯 Descripción

El `TemplateEditor` es un componente React universal que puede editar cualquier template existente sin necesidad de crear versiones "editables" específicas. Analiza automáticamente el DOM del template para extraer elementos editables y genera una interfaz de edición completa.

## 🚀 Características principales

### ✨ Análisis automático
- Extrae automáticamente textos editables (h1-h6, p, span, button, a)
- Detecta imágenes y permite cambiar sus URLs
- Identifica colores en estilos inline para edición de paleta
- No requiere configuración manual por template

### 🎨 Edición en tiempo real
- Los cambios se aplican inmediatamente al template
- Vista previa en tiempo real de todos los cambios
- Organización por pestañas (Texto, Colores, Imágenes)
- Controles intuitivos para cada tipo de contenido

### 👆 Modo de edición directa
- Click directo en elementos del template para editarlos
- Resaltado visual de elementos editables
- Edición rápida mediante prompts del navegador
- Activación/desactivación con un botón

### 📱 Preview responsivo
- Vista previa en múltiples dispositivos (Móvil, Tablet, Desktop)
- Ajuste automático del tamaño de preview
- Interfaz optimizada para diferentes resoluciones

## 🔧 Uso básico

```jsx
import React, { useState } from 'react';
import TemplateEditor from './components/TemplateEditor';
import MyTemplate from './templates/MyTemplate';

const MyComponent = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const template = {
    id: "my-template",
    name: "Mi Template",
    description: "Descripción del template",
    component: MyTemplate
  };

  const handleSave = (editedContent) => {
    // Manejar el contenido editado
    console.log('Cambios:', editedContent);
  };

  return (
    <>
      <button onClick={() => setIsEditorOpen(true)}>
        Editar Template
      </button>
      
      <TemplateEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        template={template}
        onSave={handleSave}
      />
    </>
  );
};
```

## 📋 Props del componente

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `isOpen` | boolean | ✅ | Controla si el editor está abierto |
| `onClose` | function | ✅ | Callback para cerrar el editor |
| `template` | object | ✅ | Objeto con la información del template |
| `onSave` | function | ✅ | Callback que recibe el contenido editado |

### Estructura del objeto `template`

```javascript
{
  id: "template-id",           // ID único del template
  name: "Nombre del Template", // Nombre para mostrar
  description: "Descripción",  // Descripción del template
  component: TemplateComponent // Componente React del template
}
```

## 🔄 Estructura del contenido editado

El callback `onSave` recibe un objeto con la siguiente estructura:

```javascript
{
  // Textos editables (ID generado automáticamente)
  "text_0": "Nuevo título principal",
  "text_1": "Nueva descripción",
  "text_2": "Nuevo texto del botón",
  
  // Imágenes (ID generado automáticamente)
  "image_0": "https://nueva-imagen.jpg",
  "image_1": "https://otra-imagen.png",
  
  // Colores (ID generado automáticamente)
  "color_0": "#ff5722",        // Color de texto
  "bgcolor_0": "#000000"       // Color de fondo
}
```

## 🎛️ Funcionalidades del editor

### Pestañas de edición

1. **Pestaña Texto**
   - Lista todos los textos editables encontrados
   - Diferencia entre tipos (heading, paragraph, button, link)
   - Campos de texto/textarea según el tipo de elemento

2. **Pestaña Colores**
   - Muestra todos los colores encontrados en estilos inline
   - Color picker visual + campo de texto hexadecimal
   - Aplicación inmediata de cambios de color

3. **Pestaña Imágenes**
   - Lista todas las imágenes del template
   - Preview de la imagen actual
   - Campo URL para cambiar la imagen

### Controles de dispositivo

- **Móvil**: 375x667px
- **Tablet**: 768x1024px  
- **Desktop**: Ancho completo

### Botones de acción

- **Guardar**: Ejecuta el callback `onSave` con todos los cambios
- **Reset**: Restaura todos los valores originales del template
- **Modo de Edición Directa**: Permite editar elementos haciendo click directo

## 🛠️ Implementación técnica

### Análisis automático del DOM

```javascript
// El editor analiza automáticamente estos elementos:
const textElements = templateContainer.querySelectorAll(
  'h1, h2, h3, h4, h5, h6, p, span, button, a, div[class*="text"], div[class*="title"]'
);

const imageElements = templateContainer.querySelectorAll('img');

const elementsWithColors = templateContainer.querySelectorAll(
  '[style*="color"], [style*="background"], [class*="bg-"], [class*="text-"]'
);
```

### Edición en tiempo real

Los cambios se aplican directamente al DOM:

```javascript
// Para textos
textElement.textContent = newContent;

// Para imágenes  
imageElement.src = newSrc;

// Para colores
element.style[colorProperty] = newValue;
```

## 🎯 Ventajas del enfoque universal

1. **Sin duplicación de código**: No necesitas crear versiones "editables" de cada template
2. **Mantenimiento simplificado**: Un solo editor para todos los templates
3. **Escalabilidad**: Funciona con templates nuevos sin modificaciones
4. **Flexibilidad**: Se adapta automáticamente a la estructura de cada template
5. **Desarrollo ágil**: Permite agregar nuevos templates sin trabajo adicional en el editor

## 🔄 Integración con el sistema existente

El editor se integra perfectamente con el sistema de templates de LandingFlyer:

1. Se abre desde el modal de selección de templates
2. Funciona con la estructura existente de `templatesArray`
3. Mantiene la navegación entre templates
4. Preserva el flujo de trabajo actual

## 📝 Ejemplo de uso en HeroSection

```jsx
// Botón para abrir el editor
<button
  onClick={openTemplateEditor}
  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  <Edit3 className="w-4 h-4" />
  Editar Template
</button>

// Componente del editor
<TemplateEditor
  isOpen={isEditorOpen}
  onClose={closeTemplateEditor}
  template={selectedTemplate}
  onSave={handleEditorSave}
/>
```

Este enfoque hace que el sistema sea mucho más mantenible y escalable, permitiendo que cualquier template existente sea editable automáticamente sin necesidad de código adicional.