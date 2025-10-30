# ✅ Integración Completa: Actividad Ordenar Pasos

## 🎯 Problema Resuelto
La actividad "Ordenar Pasos" ahora genera código HTML, CSS y JS automáticamente, igual que la actividad "Select Texto".

## 🔧 Cambios Realizados

### 1. Archivo: `drag-drop-builder.tsx`

#### Funciones Agregadas:

**`generateOrdenarPasosCSS()`**
- Genera todos los estilos CSS necesarios para la actividad
- Incluye estilos para versión web (drag & drop) y móvil (selects)
- Responsive automático con breakpoint en 768px

**`generateOrdenarPasosJS(activityData)`**
- Genera el código JavaScript completo
- Recibe los pasos configurados en `activityData.pasos`
- Implementa lógica para ambas versiones (web y móvil)
- Incluye validación, reinicio y feedback visual

#### Modificaciones en el Código:

**1. Detección de actividades (línea ~520)**
```typescript
const selectActivities = [...leftContent, ...rightContent].filter(c => 
  c.type === 'activity' && c.activityType === 'select-text' && c.activityData?.text
)
const ordenarPasosActivities = [...leftContent, ...rightContent].filter(c => 
  c.type === 'activity' && c.activityType === 'ordenar-pasos' && c.activityData?.pasos?.length > 0
)

if (selectActivities.length > 0) {
  cssContent = generateSelectActivityCSS()
  jsContent = generateSelectActivityJS(selectActivities[0].activityData)
} else if (ordenarPasosActivities.length > 0) {
  cssContent = generateOrdenarPasosCSS()
  jsContent = generateOrdenarPasosJS(ordenarPasosActivities[0].activityData)
}
```

**2. Generación de HTML (línea ~700)**
```typescript
case "activity":
  if (comp.activityType === 'ordenar-pasos' && comp.activityData?.pasos?.length > 0) {
    return `<div id="ordenar-pasos-actividad" class="ordenar-pasos-container">
        <!-- Contenido generado por JavaScript -->
    </div>`
  }
  if (comp.activityType === 'select-text' && comp.activityData?.text) {
    // ... código existente
  }
```

## 📋 Flujo Completo

### 1. Usuario Configura la Actividad
1. Arrastra componente "Actividad" al editor
2. Selecciona "Ordenar Pasos" 🔢
3. Agrega pasos en orden correcto:
   ```
   Paso 1: Evaluar riesgos
   Paso 2: Instalar guardas
   Paso 3: Capacitar trabajadores
   ...
   ```
4. Guarda

### 2. Sistema Genera Código Automáticamente

**HTML Generado** (`index.html`):
```html
<div id="ordenar-pasos-actividad" class="ordenar-pasos-container">
    <!-- Contenido generado por JavaScript -->
</div>
```

**CSS Generado** (`slider.css`):
- Estilos completos para tarjetas
- Colores de feedback (verde/rojo)
- Responsive design
- Animaciones y transiciones

**JS Generado** (`slider.js`):
```javascript
const pasosCorrectos = [
    "Paso 1: Evaluar riesgos",
    "Paso 2: Instalar guardas",
    // ... más pasos
];
// ... lógica completa de la actividad
```

### 3. Usuario Ve el Código

**Pestaña "Código"**:
- ✅ `index.html` - Muestra el div contenedor
- ✅ `slider.css` - Muestra todos los estilos
- ✅ `slider.js` - Muestra la lógica completa

**Guardado Automático**:
- Los 3 archivos se guardan en el proyecto
- Se sincronizan automáticamente al editar

## 🎨 Ejemplo de Configuración

### En el Editor Visual:
```typescript
{
  type: 'activity',
  activityType: 'ordenar-pasos',
  activityData: {
    pasos: [
      "Se evalúan riesgos para identificar áreas peligrosas",
      "Se instalan guardas metálicas resistentes",
      "Los trabajadores reciben capacitación",
      "Se implementa programa de mantenimiento",
      "Verificación antes de cada turno"
    ]
  }
}
```

### Código Generado:

**HTML**:
```html
<div id="ordenar-pasos-actividad" class="ordenar-pasos-container">
    <!-- Contenido generado por JavaScript -->
</div>
```

**CSS** (fragmento):
```css
.ordenar-pasos-container {
    font-family: "Montserrat", sans-serif;
    max-width: 62.5rem;
    margin: 0 auto;
    padding: 0.625rem 1.25rem;
    background: #fcfcfc;
    border-radius: 0.5rem;
}

.tarjeta-paso1 {
    background: #0f172a;
    color: #ffffff;
    cursor: grab;
    /* ... más estilos */
}
```

**JS** (fragmento):
```javascript
const pasosCorrectos = [
    "Se evalúan riesgos para identificar áreas peligrosas",
    "Se instalan guardas metálicas resistentes",
    // ...
];

function renderizarVersionWeb(contenedor) {
    // Lógica drag & drop
}

function renderizarVersionMobile(contenedor) {
    // Lógica con selects
}
```

## ✨ Características Implementadas

### Versión Web (Desktop)
- ✅ Drag & Drop funcional
- ✅ Pasos desordenados aleatoriamente
- ✅ Validación de orden correcto
- ✅ Feedback visual (verde/rojo)
- ✅ Botones Validar y Reiniciar
- ✅ Porcentaje de aciertos

### Versión Móvil
- ✅ Selects desplegables
- ✅ Opciones inteligentes (no repetir)
- ✅ Misma validación y feedback
- ✅ Responsive automático (768px)

### Integración con Editor
- ✅ Configuración visual intuitiva
- ✅ Generación automática de código
- ✅ Sincronización en tiempo real
- ✅ Guardado persistente
- ✅ Visible en pestaña "Código"

## 🧪 Cómo Probar

1. **Crear nueva actividad**:
   - Abre el editor de un momento
   - Arrastra "Actividad" a una columna
   - Selecciona "Ordenar Pasos" 🔢
   - Agrega 3-5 pasos
   - Guarda

2. **Ver código generado**:
   - Ve a la pestaña "Código"
   - Verifica `index.html` - debe tener el div
   - Verifica `slider.css` - debe tener estilos completos
   - Verifica `slider.js` - debe tener lógica completa

3. **Probar funcionalidad**:
   - Previsualiza el momento
   - Arrastra pasos para reordenar (desktop)
   - Valida y reinicia
   - Prueba en móvil (usa DevTools)

## 📊 Comparación con Select Texto

| Característica | Select Texto | Ordenar Pasos |
|---------------|--------------|---------------|
| Generación HTML | ✅ | ✅ |
| Generación CSS | ✅ | ✅ |
| Generación JS | ✅ | ✅ |
| Visible en Código | ✅ | ✅ |
| Guardado automático | ✅ | ✅ |
| Responsive | ✅ | ✅ |
| Validación | ✅ | ✅ |

## 🎉 Resultado Final

Ahora cuando configures una actividad "Ordenar Pasos":

1. ✅ Se genera HTML automáticamente
2. ✅ Se genera CSS completo
3. ✅ Se genera JS funcional
4. ✅ Todo aparece en la pestaña "Código"
5. ✅ Se guarda en el proyecto
6. ✅ Funciona igual que "Select Texto"

---

**¡La actividad está 100% integrada y funcional!** 🚀
