# SF CoursePress - Generador de Cursos E-Learning

Plataforma profesional para crear cursos SCORM sin conocimientos técnicos.

## Características

- **Generación Automática**: Crea toda la estructura de archivos SCORM automáticamente
- **Interfaz Intuitiva**: Creador de cursos en 3 pasos simples
- **SCORM 1.2**: Compatibilidad completa con estándares SCORM
- **Plantillas Profesionales**: Templates listos para Slider, Video, Interactivo y Quiz
- **Tracking Integrado**: Sistema de seguimiento de progreso automático

## Estructura del Proyecto

\`\`\`
sf-coursepress/
├── app/                    # Páginas de Next.js
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Dashboard de gestión
│   └── creator/           # Creador de cursos
├── components/            # Componentes React
│   ├── creator/          # Componentes del creador
│   └── ui/               # Componentes UI (shadcn)
├── lib/                  # Utilidades
│   └── scorm-generator.ts # Sistema generador SCORM
└── public/               # Archivos estáticos
\`\`\`

## Uso

1. **Crear Curso**: Ingresa información básica del curso
2. **Definir Estructura**: Agrega lecciones y momentos
3. **Generar**: Descarga todos los archivos SCORM listos

## Tipos de Momentos

- **Slider**: Diapositivas con contenido
- **Video**: Reproductor de video integrado
- **Interactivo**: Actividades drag & drop
- **Quiz**: Evaluaciones con feedback

## Archivos Generados

Cada curso incluye:
- `imsmanifest.xml` - Configuración SCORM
- `curso-config.js` - Configuración del curso
- `css/main.css` - Estilos profesionales
- `js/navegacion.js` - Sistema de navegación
- `js/scorm-api.js` - API SCORM 1.2
- `lecciones/*.html` - Archivos HTML de cada momento

## Tecnologías

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

## Licencia

© 2025 SF CoursePress. Todos los derechos reservados.
