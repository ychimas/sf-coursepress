# Actividad: Ordenar Pasos

## Descripción
Actividad interactiva donde el usuario debe ordenar una serie de pasos en la secuencia correcta.

## Características
- **Versión Web**: Drag & Drop (arrastrar y soltar)
- **Versión Móvil**: Selects desplegables
- **Responsive**: Se adapta automáticamente al tamaño de pantalla
- **Validación**: Muestra feedback visual con iconos de correcto/incorrecto
- **Reinicio**: Permite reintentar la actividad

## Archivos
- `index.html` - Estructura HTML
- `styles.css` - Estilos CSS
- `script.js` - Lógica JavaScript

## Configuración
Los pasos se configuran en el array `pasosCorrectos` dentro de `script.js`:

```javascript
const pasosCorrectos = [
    "Paso 1 en orden correcto",
    "Paso 2 en orden correcto",
    "Paso 3 en orden correcto",
    // ...
];
```

## Uso en el Editor
1. Arrastra el componente "Actividad" al editor
2. Selecciona "Ordenar Pasos" en el modal
3. Agrega los pasos en el orden correcto
4. Los pasos se mostrarán desordenados al usuario

## Recursos Necesarios
- Font Awesome (iconos)
- Imágenes: `checkAct.png` y `xmarkAct.png` (en assets/img/)
