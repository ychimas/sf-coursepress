import { CheckCircle, Folder, FileText, Code } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { generateCourseFromTemplate } from "@/lib/template-generator"
import { ConfigPreview } from "./config-preview"
import type { CourseData } from "@/lib/scorm-generator"

interface StepThreeProps {
  courseData: CourseData
}

export function StepThree({ courseData }: StepThreeProps) {
  const totalMoments = courseData.lessons.reduce((acc: number, lesson: any) => acc + lesson.moments.length, 0)

  const templateFiles = courseData.folderName ? generateCourseFromTemplate(courseData) : []
  
  const filesToGenerate = [
    "imsmanifest.xml - Configuración SCORM",
    "plugins/js/config/curso-config.js - Configuración dinámica del curso",
    `${courseData.lessons.length} carpetas de lecciones con momentos`,
    "module/inicio/inicio.html - Página de inicio",
    "Archivos CSS y JS de la plantilla base",
    "Sistema de tracking SCORM integrado",
  ]

  const fileStructure = templateFiles.map(file => file.path).sort()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Confirmación y Generación</h2>
        <p className="text-muted-foreground">Revisa el resumen de tu curso antes de generar los archivos</p>
      </div>

      {/* Course Summary */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Resumen del Curso
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nombre:</span>
                <span className="font-medium">{courseData.name || "Sin nombre"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Carpeta:</span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  {courseData.folderName || "sin-nombre"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categoría:</span>
                <span className="font-medium">{courseData.category || "Sin categoría"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lecciones:</span>
                <span className="font-medium">{courseData.lessons.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Momentos:</span>
                <span className="font-medium">{totalMoments}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Structure */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Estructura de Lecciones
          </h3>
          {courseData.lessons.length > 0 ? (
            <div className="space-y-3">
              {courseData.lessons.map((lesson: any, index: number) => (
                <div key={lesson.id} className="border border-border rounded-lg p-4">
                  <div className="font-medium mb-2">
                    Lección {index + 1}: {lesson.name || "Sin nombre"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {lesson.moments.length} momento(s): {lesson.moments.map((m: any) => m.type).join(", ") || "Ninguno"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay lecciones definidas</p>
          )}
        </CardContent>
      </Card>

      {/* Files to Generate */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Archivos que se Generarán
          </h3>
          <div className="space-y-2">
            {filesToGenerate.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>{file}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Config Preview */}
      <ConfigPreview courseData={courseData} />

      {/* Folder Structure Preview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Folder className="w-5 h-5 text-primary" />
            Vista Previa de Carpetas
          </h3>
          <div className="font-mono text-sm space-y-1 bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
            <div className="font-bold text-primary">{courseData.folderName || "mi-curso"}/</div>
            {fileStructure.length > 0 ? (
              fileStructure.map((filePath, index) => (
                <div key={index} className="ml-2">
                  ├── {filePath}
                </div>
              ))
            ) : (
              <div className="ml-2 text-muted-foreground">No hay archivos para mostrar</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
