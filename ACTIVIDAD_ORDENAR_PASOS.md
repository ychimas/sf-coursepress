# Nueva Actividad: Ordenar Pasos

## 📋 Resumen
Se ha agregado una nueva actividad interactiva llamada "Ordenar Pasos" al sistema SF CoursePress. Esta actividad permite a los usuarios ordenar una serie de pasos en la secuencia correcta.

## 🎯 Características

### Versión Web (Desktop)
- **Drag & Drop**: Los usuarios pueden arrastrar y soltar las tarjetas para reordenarlas
- **Feedback Visual**: Iconos de check (✓) y X (✗) para indicar respuestas correctas/incorrectas
- **Colores Dinámicos**: Verde para correcto, rojo para incorrecto

### Versión Móvil
- **Selects Desplegables**: En lugar de drag & drop, usa selectores para elegir el orden
- **Opciones Inteligentes**: Las opciones ya seleccionadas se deshabilitan en otros selects
- **Mismo Feedback**: Mantiene la misma retroalimentación visual

### Características Comunes
- ✅ **Validación**: Botón para verificar si el orden es correcto
- 🔄 **Reiniciar**: Permite volver a intentar la actividad
- 📊 **Porcentaje**: Muestra el porcentaje de respuestas correctas
- 📱 **Responsive**: Se adapta automáticamente al tamaño de pantalla (breakpoint: 768px)

## 📁 Archivos Creados

### 1. Carpeta de la Actividad
```
templates/base/actividades/ordenar_pasos/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS completos
├── script.js           # Lógica JavaScript
├── demo.html           # Archivo de demostración
└── README.md           # Documentación de la actividad
```

### 2. Integración en el Editor
- **Archivo modificado**: `components/editor/component-editor.tsx`
- **Cambio**: Se reemplazó la actividad "Arrastrar y Soltar" por "Ordenar Pasos"
- **Icono**: 🔢 (emoji de números)

## 🎨 Configuración en el Editor

### Cómo usar en el editor:
1. Arrastra el componente **"Actividad"** al editor visual
2. Haz clic en **"Editar"** sobre el componente
3. Selecciona **"Ordenar Pasos"** (icono 🔢)
4. Agrega los pasos en el **orden correcto**:
   - Haz clic en "+ Agregar Paso"
   - Escribe cada paso
   - Puedes eliminar pasos con el botón ×
5. Guarda los cambios

### Ejemplo de configuración:
```javascript
{
  activityType: 'ordenar-pasos',
  activityData: {
    pasos: [
      "Paso 1: Evaluar riesgos",
      "Paso 2: Instalar guardas",
      "Paso 3: Capacitar trabajadores",
      "Paso 4: Implementar mantenimiento",
      "Paso 5: Verificar antes de cada turno"
    ]
  }
}
```

## 🔧 Personalización

### Modificar los pasos (script.js):
```javascript
const pasosCorrectos = [
    "Tu paso 1 aquí",
    "Tu paso 2 aquí",
    "Tu paso 3 aquí",
    // ... más pasos
];
```

### Cambiar el breakpoint responsive (styles.css):
```css
@media (max-width: 48rem) { /* 768px */
    .mobile-version { display: block; }
    .web-version { display: none; }
}
```

### Personalizar colores (styles.css):
```css
.tarjeta-paso1 {
    background: #0f172a;  /* Color de fondo de tarjetas */
}

.tarjeta-paso1.correcto {
    background: #4caf50;  /* Verde para correcto */
}

.tarjeta-paso1.incorrecto {
    background: #f44336;  /* Rojo para incorrecto */
}
```

## 🖼️ Recursos Necesarios

### Imágenes (ya existen en el proyecto):
- `assets/img/checkAct.png` - Icono de correcto ✓
- `assets/img/xmarkAct.png` - Icono de incorrecto ✗

### Librerías externas:
- Font Awesome 6.4.0 (para iconos de botones)

## 🧪 Probar la Actividad

### Opción 1: Demo Standalone
Abre el archivo `demo.html` en tu navegador para ver la actividad funcionando de forma independiente.

### Opción 2: En el Editor
1. Ve al editor de cursos
2. Crea un nuevo momento
3. Agrega el componente "Actividad"
4. Selecciona "Ordenar Pasos"
5. Configura los pasos
6. Previsualiza el momento

## 📊 Flujo de Usuario

1. **Inicio**: El usuario ve los pasos desordenados
2. **Interacción**: 
   - Desktop: Arrastra las tarjetas para reordenar
   - Móvil: Selecciona el orden desde dropdowns
3. **Validación**: Hace clic en "Validar"
4. **Feedback**: Ve qué pasos están correctos/incorrectos y su porcentaje
5. **Reintentar**: Puede hacer clic en "Reiniciar" para volver a intentar

## 🎯 Casos de Uso

Esta actividad es ideal para:
- ✅ Procedimientos paso a paso
- ✅ Secuencias de seguridad
- ✅ Procesos de manufactura
- ✅ Protocolos de emergencia
- ✅ Flujos de trabajo
- ✅ Recetas o instrucciones

## 🔄 Próximas Mejoras Sugeridas

- [ ] Agregar límite de intentos
- [ ] Guardar progreso en localStorage
- [ ] Agregar temporizador opcional
- [ ] Permitir imágenes en cada paso
- [ ] Agregar sonidos de feedback
- [ ] Integración con sistema de puntos
- [ ] Exportar resultados a PDF

## 📝 Notas Técnicas

- **Compatibilidad**: Funciona en todos los navegadores modernos
- **Accesibilidad**: Usa HTML semántico y ARIA labels
- **Performance**: Optimizado para listas de hasta 10 pasos
- **Mobile First**: Diseñado pensando primero en móviles

## 🐛 Solución de Problemas

### Las imágenes no se muestran
- Verifica que las rutas en `script.js` apunten correctamente a las imágenes
- Asegúrate de que `checkAct.png` y `xmarkAct.png` existan en `assets/img/`

### El drag & drop no funciona en móvil
- Es normal, en móvil se usan selects en lugar de drag & drop
- Verifica que el breakpoint sea correcto (768px)

### Los pasos no se desordenan
- Revisa el array `pasosDesordenadosIniciales` en `script.js`
- Asegúrate de que los números y textos coincidan con `pasosCorrectos`

## 👥 Créditos

- **Desarrollado para**: SF CoursePress
- **Versión**: 1.0.0
- **Fecha**: 2025
- **Licencia**: MIT

---

¡Disfruta creando actividades interactivas con Ordenar Pasos! 🎉
