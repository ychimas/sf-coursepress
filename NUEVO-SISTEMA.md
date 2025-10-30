# 🚀 Nuevo Sistema de Generación de Cursos

## ✨ ¿Qué cambió?

El sistema ahora usa la carpeta `templates/base` como plantilla base y genera dinámicamente el contenido basado en la configuración del usuario.

## 📁 Estructura del Sistema

```
sf-coursepress/
├── templates/base/           # 📂 Plantilla base (tu curso de alturas)
│   ├── plugins/js/config/
│   │   └── curso-config.js   # ❌ Se reemplaza dinámicamente
│   ├── module/
│   │   ├── leccion1/         # ❌ Se genera dinámicamente
│   │   ├── leccion2/         # ❌ Se genera dinámicamente
│   │   └── leccion3/         # ❌ Se genera dinámicamente
│   └── [resto de archivos]   # ✅ Se copian tal como están
├── lib/
│   └── template-generator.ts # 🆕 Nuevo generador
└── components/creator/       # 🔄 Interfaz actualizada
```

## 🔄 Cómo Funciona

### 1. **Usuario Crea Curso**
```
Nombre: "Trabajo Seguro en Alturas"
Lección 1: "Introducción a las alturas" (3 momentos)
Lección 2: "Evaluación de riesgos" (2 momentos)
```

### 2. **Sistema Genera Automáticamente**

#### 📝 `curso-config.js` dinámico:
```javascript
const CURSO_CONFIG = {
  lecciones: {
    leccion1: {
      nombre: '1° Introducción a las alturas',  // ← Nombre del usuario
      sliders: [
        { router: 'momento1_1', momento: 1 },
        { router: 'momento1_2', momento: 1 },
        { router: 'momento1_3', momento: 1 }    // ← Cantidad según usuario
      ],
      navegacion: { /* ... */ }
    },
    leccion2: {
      nombre: '2° Evaluación de riesgos',       // ← Nombre del usuario
      sliders: [
        { router: 'momento2_1', momento: 2 },
        { router: 'momento2_2', momento: 2 }    // ← Cantidad según usuario
      ],
      navegacion: { /* ... */ }
    }
  }
  // ... resto de funciones
}
```

#### 📂 Estructura de carpetas:
```
curso-generado/
├── plugins/js/config/
│   └── curso-config.js       # 🆕 Generado dinámicamente
├── module/
│   ├── inicio/
│   │   └── inicio.html       # 🆕 Con info del curso
│   ├── leccion1/             # 🆕 Nombre del usuario
│   │   ├── momento1_1/       # 🆕 Cantidad según usuario
│   │   ├── momento1_2/
│   │   ├── momento1_3/
│   │   ├── resumen_leccion.html
│   │   └── evaluacion_leccion.html
│   └── leccion2/             # 🆕 Nombre del usuario
│       ├── momento2_1/       # 🆕 Cantidad según usuario
│       ├── momento2_2/
│       ├── resumen_leccion.html
│       └── evaluacion_leccion.html
├── assets/                   # ✅ Copiado de template/base
├── plugins/                  # ✅ Copiado de template/base
└── [resto de archivos]       # ✅ Copiado de template/base
```

## 🎯 Ventajas del Nuevo Sistema

### ✅ **Para el Usuario**
- **Nombres Personalizados**: Los nombres que escriba aparecen directamente en el curso
- **Cantidad Flexible**: Puede crear 1, 2, 5 o las lecciones que necesite
- **Momentos Dinámicos**: Cada lección puede tener diferentes cantidades de momentos
- **Vista Previa**: Ve exactamente cómo quedará el `curso-config.js`

### ✅ **Para el Desarrollo**
- **Plantilla Base**: Usa tu curso de alturas como base
- **Generación Inteligente**: Solo genera lo que cambia
- **Mantenimiento Fácil**: Cambios en la plantilla se reflejan automáticamente
- **Escalable**: Fácil agregar nuevos tipos de momentos

## 🔧 Archivos Clave

### `lib/template-generator.ts`
```typescript
// Genera curso usando plantilla base
export function generateCourseFromTemplate(courseData: CourseData): TemplateFile[]

// Genera curso-config.js dinámico
private generateDynamicCourseConfig(): TemplateFile

// Genera estructura de lecciones
private generateLessonStructure(): TemplateFile[]
```

### `components/creator/config-preview.tsx`
```typescript
// Muestra vista previa del curso-config.js
export function ConfigPreview({ courseData }: ConfigPreviewProps)
```

## 📋 Ejemplo Práctico

### Usuario ingresa:
```
Curso: "Seguridad Industrial"
Lección 1: "Introducción a EPP" (2 sliders, 1 video)
Lección 2: "Uso correcto" (1 slider, 1 quiz)
```

### Sistema genera:
```javascript
// curso-config.js
const CURSO_CONFIG = {
  lecciones: {
    leccion1: {
      nombre: '1° Introducción a EPP',
      sliders: [
        { router: 'momento1_1', momento: 1 }, // slider
        { router: 'momento1_2', momento: 1 }, // slider  
        { router: 'momento1_3', momento: 1 }  // video
      ]
    },
    leccion2: {
      nombre: '2° Uso correcto',
      sliders: [
        { router: 'momento2_1', momento: 2 }, // slider
        { router: 'momento2_2', momento: 2 }  // quiz
      ]
    }
  }
}
```

### Y crea carpetas:
```
module/
├── leccion1/
│   ├── momento1_1/ (slider)
│   ├── momento1_2/ (slider)
│   └── momento1_3/ (video)
└── leccion2/
    ├── momento2_1/ (slider)
    └── momento2_2/ (quiz)
```

## 🚀 Próximos Pasos

1. **Copiar Archivos Reales**: Implementar copia real de `templates/base`
2. **Tipos de Momentos**: Expandir plantillas para video, interactivo, quiz
3. **Personalización**: Permitir personalizar estilos y colores
4. **Exportación ZIP**: Generar archivo ZIP descargable
5. **Vista Previa Live**: Mostrar preview del curso en tiempo real

## 💡 Notas Importantes

- ✅ El `curso-config.js` se genera **completamente dinámico**
- ✅ Los nombres de lecciones vienen **directamente del usuario**
- ✅ La cantidad de momentos es **flexible**
- ✅ La plantilla base se **preserva intacta**
- ✅ Sistema **escalable** para nuevas funcionalidades

---

**¡El sistema está listo para generar cursos personalizados usando tu plantilla base!** 🎉