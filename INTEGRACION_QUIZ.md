# ✅ Integración Completa: Actividad Quiz

## 🎯 Nueva Actividad Agregada
Se ha integrado la actividad de **Quiz** con el mismo sistema de generación automática de código que las actividades anteriores (Select Texto y Ordenar Pasos).

## 🔧 Cambios Realizados

### 1. Archivo: `component-editor.tsx`

**Nueva configuración de Quiz agregada:**
- Interfaz para agregar múltiples preguntas
- Cada pregunta tiene:
  - Texto de la pregunta
  - 3 opciones (A, B, C)
  - Radio button para marcar la respuesta correcta
- Botones para agregar/eliminar preguntas

### 2. Archivo: `drag-drop-builder.tsx`

#### Funciones Agregadas:

**`generateQuizCSS()`**
- Genera estilos para:
  - Tarjetas de preguntas
  - Opciones de respuesta (hover, seleccionada, correcta, incorrecta)
  - Feedback (success, error, warning)
  - Barra de progreso
  - Navegación

**`generateQuizJS(activityData)`**
- Genera lógica completa del quiz:
  - Navegación secuencial entre preguntas
  - Validación de respuestas
  - Contador de progreso
  - Resumen final con resultados
  - Sistema de reinicio
  - Navegación post-completado

**Generación de HTML dinámico:**
- Crea estructura completa del quiz
- Genera preguntas con sus opciones
- Incluye botones de validar/continuar
- Agrega navegación y feedback

## 📋 Cómo Usar

### 1. En el Editor Visual:

1. Arrastra el componente **"Actividad"**
2. Selecciona **"Quiz Interactivo"** ❓
3. Haz clic en **"+ Agregar Pregunta"**
4. Para cada pregunta:
   - Escribe el texto de la pregunta
   - Escribe las 3 opciones (A, B, C)
   - Marca con el radio button cuál es la correcta
5. Agrega todas las preguntas que necesites
6. Guarda

### 2. Ejemplo de Configuración:

```typescript
{
  type: 'activity',
  activityType: 'quiz',
  activityData: {
    preguntas: [
      {
        texto: "¿Qué tipo de riesgo puede causar cortes profundos?",
        opciones: [
          "Aplastamientos",
          "Golpes",
          "Cortes"
        ],
        correcta: 2  // Índice de la respuesta correcta (0=A, 1=B, 2=C)
      },
      {
        texto: "¿Qué situación puede generar golpes o fracturas?",
        opciones: [
          "Uso incorrecto de sierra",
          "Caída de herramienta pesada",
          "Movimiento de bloques"
        ],
        correcta: 1
      }
    ]
  }
}
```

## 🎨 Código Generado

### HTML Generado:
```html
<div class="mx-lg-0" id="preguntas-container">
    <div>
        <div id="contador-preguntas" class="mb-2 text-center">
            <p id="progress-text">0 de 2 preguntas validadas</p>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar-fill" id="progress-bar-fill"></div>
        </div>
    </div>

    <!-- Pregunta 1 -->
    <div class="preguntas_01" data-pregunta="1">
        <div class="ctItem fixed-size-question-box">
            <p><strong>Pregunta 1: </strong>¿Qué tipo de riesgo...?</p>
            <div class="opciones-pregunta">
                <p class="opcion-respuesta" data-letra="a">A. Aplastamientos</p>
                <p class="opcion-respuesta" data-letra="b">B. Golpes</p>
                <p class="opcion-respuesta" data-letra="c">C. Cortes</p>
            </div>
            <button class="sf-btn sf-btn-purple btn-validar" data-pregunta="1">
                <i class="fas fa-check-circle"></i> Validar
            </button>
            <!-- Botón Continuar (oculto inicialmente) -->
        </div>
        <div id="mensaje_error_1" class="mt-3 d-none"></div>
        <div id="resultado_alertas_1" class="mt-3 d-none"></div>
    </div>

    <!-- Navegación post-completado -->
    <div id="navegacion-resumen" class="d-none">
        <!-- Botones Anterior/Siguiente -->
        <!-- Botón Reiniciar -->
    </div>

    <div id="feedback-final-externo" class="d-none"></div>
</div>
```

### CSS Generado:
- Estilos completos para todas las clases
- Colores: gris (normal), azul oscuro (seleccionada), verde (correcta), rojo (incorrecta)
- Transiciones suaves
- Responsive

### JS Generado:
- Variables de estado (pregunta actual, respuestas, resultados)
- Función `validarPregunta()` - Verifica respuesta y muestra feedback
- Función `mostrarPregunta()` - Navegación entre preguntas
- Función `mostrarResumenFinal()` - Calcula y muestra resultados
- Función `reiniciarActividad()` - Resetea todo el quiz
- Event listeners para clicks en opciones, botones, navegación

## ✨ Características Implementadas

### Flujo del Quiz:
1. ✅ Usuario ve pregunta 1
2. ✅ Selecciona una opción (se marca en azul)
3. ✅ Hace clic en "Validar"
4. ✅ Ve feedback (verde=correcto, rojo=incorrecto)
5. ✅ Hace clic en "Continuar" para siguiente pregunta
6. ✅ Repite hasta completar todas
7. ✅ Ve resumen final con porcentaje y detalle
8. ✅ Puede navegar entre preguntas completadas
9. ✅ Puede reiniciar el quiz

### Barra de Progreso:
- ✅ Muestra "X de Y preguntas validadas"
- ✅ Barra visual que se llena progresivamente
- ✅ Se actualiza automáticamente

### Resumen Final:
- ✅ Porcentaje de aciertos
- ✅ Lista detallada: "Pregunta X: correcta/incorrecta" con iconos
- ✅ Color según rendimiento (verde ≥75%, naranja ≥50%, rojo <50%)

### Navegación Post-Completado:
- ✅ Botones Anterior/Siguiente
- ✅ Contador "X de Y"
- ✅ Botón Reiniciar
- ✅ Oculta botones "Continuar" individuales

### Sistema de Reinicio:
- ✅ Limpia todas las selecciones
- ✅ Resetea colores y estados
- ✅ Vuelve a pregunta 1
- ✅ Reinicia contador de progreso
- ✅ Oculta resumen final

## 🎯 Validaciones

- ✅ No permite validar sin seleccionar opción
- ✅ Muestra mensaje de advertencia si no hay selección
- ✅ Deshabilita opciones después de validar
- ✅ Solo cuenta cada pregunta una vez en el progreso
- ✅ Previene navegación durante quiz activo

## 📊 Comparación con Otras Actividades

| Característica | Select Texto | Ordenar Pasos | Quiz |
|---------------|--------------|---------------|------|
| Generación HTML | ✅ | ✅ | ✅ |
| Generación CSS | ✅ | ✅ | ✅ |
| Generación JS | ✅ | ✅ | ✅ |
| Visible en Código | ✅ | ✅ | ✅ |
| Guardado automático | ✅ | ✅ | ✅ |
| Validación | ✅ | ✅ | ✅ |
| Reinicio | ✅ | ✅ | ✅ |
| Progreso visual | ❌ | ❌ | ✅ |
| Navegación | ❌ | ❌ | ✅ |
| Múltiples items | ✅ | ✅ | ✅ |

## 🧪 Para Probar

1. **Crear Quiz**:
   - Abre el editor de un momento
   - Arrastra "Actividad"
   - Selecciona "Quiz Interactivo" ❓
   - Agrega 2-3 preguntas con sus opciones
   - Marca las respuestas correctas
   - Guarda

2. **Ver Código**:
   - Ve a pestaña "Código"
   - `index.html` - Estructura completa del quiz
   - `slider.css` - Todos los estilos
   - `slider.js` - Lógica completa

3. **Probar Funcionalidad**:
   - Previsualiza el momento
   - Responde las preguntas
   - Valida cada una
   - Ve el resumen final
   - Navega entre preguntas
   - Reinicia el quiz

## 🎉 Resultado Final

Ahora tienes **3 actividades completamente integradas**:

1. ✅ **Select Texto** 📝 - Completar texto con selects
2. ✅ **Ordenar Pasos** 🔢 - Drag & drop / selects para ordenar
3. ✅ **Quiz** ❓ - Cuestionario secuencial con validación

Todas con:
- ✅ Configuración visual intuitiva
- ✅ Generación automática de HTML, CSS y JS
- ✅ Código visible en pestaña "Código"
- ✅ Guardado persistente
- ✅ Validación y feedback
- ✅ Sistema de reinicio

---

**¡El sistema de actividades está completo y funcional!** 🚀
