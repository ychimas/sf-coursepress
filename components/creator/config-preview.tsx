"use client"

import { useState } from "react"
import { Eye, EyeOff, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CourseData } from "@/lib/scorm-generator"

interface ConfigPreviewProps {
  courseData: CourseData
}

export function ConfigPreview({ courseData }: ConfigPreviewProps) {
  const [showPreview, setShowPreview] = useState(false)

  const generateConfigPreview = () => {
    const lecciones: any = {}

    courseData.lessons.forEach((lesson, lessonIndex) => {
      const leccionKey = `leccion${lessonIndex + 1}`
      
      lecciones[leccionKey] = {
        nombre: `${lessonIndex + 1}° ${lesson.name || 'Lección sin nombre'}`,
        sliders: lesson.moments.map((moment, momentIndex) => ({
          router: `momento${lessonIndex + 1}_${momentIndex + 1}`,
          momento: lessonIndex + 1
        })),
        navegacion: {
          paginaAnterior: lessonIndex === 0 ? '../inicio/inicio.html' : `../leccion${lessonIndex}/evaluacion_leccion.html`,
          paginaSiguiente: './resumen_leccion.html',
          mostrarConfirmacion: false
        }
      }
    })

    return `// Configuración global del curso - ${courseData.name}
// Generado automáticamente por SF CoursePress

const CURSO_CONFIG = {
  // Configuración de lecciones del curso
  lecciones: ${JSON.stringify(lecciones, null, 4)},

  // Función para obtener información de una lección específica
  getLeccion(leccionId) {
    return this.lecciones[leccionId] || null;
  },

  // Función para obtener todos los sliders de una lección
  getSliders(leccionId) {
    const leccion = this.getLeccion(leccionId);
    return leccion ? leccion.sliders : [];
  },

  // ... más funciones de utilidad

  // Función para detectar la lección actual basada en la URL
  getLeccionActual() {
    const currentPath = window.location.pathname;
    
    ${courseData.lessons.map((_, index) => 
      `if (currentPath.includes('leccion${index + 1}')) return 'leccion${index + 1}';`
    ).join('\n    ')}
    
    return 'leccion1';
  }
};

// Exportar la configuración para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CURSO_CONFIG;
} else {
  window.CURSO_CONFIG = CURSO_CONFIG;
}`
  }

  if (courseData.lessons.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Vista Previa: curso-config.js
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Ocultar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Ver Código
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      {showPreview && (
        <CardContent>
          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code>{generateConfigPreview()}</code>
            </pre>
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Explicación:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Los nombres de las lecciones se toman directamente de lo que escribiste</li>
              <li>• Se numeran automáticamente: "1°", "2°", etc.</li>
              <li>• Cada momento genera un "router" único: momento1_1, momento1_2, etc.</li>
              <li>• La navegación se configura automáticamente entre lecciones</li>
              <li>• Este archivo controla toda la lógica del curso SCORM</li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  )
}