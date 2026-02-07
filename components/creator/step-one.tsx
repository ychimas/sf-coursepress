"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import { useRef, useState } from "react"

interface StepOneProps {
  courseData: any
  setCourseData: (data: any) => void
  setCustomVideoFile: (file: File | null) => void
}

export function StepOne({ courseData, setCourseData, setCustomVideoFile }: StepOneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [videoFileName, setVideoFileName] = useState<string>(courseData.customVideo?.name || "")

  const handleNameChange = (name: string) => {
    const folderName = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    setCourseData({ ...courseData, name, folderName })
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFileName(file.name)
      setCustomVideoFile(file)
      
      setCourseData({ 
        ...courseData, 
        customVideo: {
          name: file.name,
          mimeType: file.type
        }
      })
    }
  }

  const removeVideo = () => {
    setVideoFileName("")
    setCustomVideoFile(null)
    setCourseData({ ...courseData, customVideo: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Información Básica</h2>
        <p className="text-muted-foreground">Ingresa los datos principales de tu curso e-learning</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre del Curso *</Label>
          <Input
            id="name"
            placeholder="Ej: Introducción a la Seguridad Industrial"
            value={courseData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="folderName">Nombre de Carpeta</Label>
          <Input id="folderName" value={courseData.folderName} readOnly className="mt-1.5 bg-muted" />
          <p className="text-xs text-muted-foreground mt-1">Generado automáticamente desde el nombre del curso</p>
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Describe brevemente el contenido y objetivos del curso..."
            value={courseData.description}
            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
            className="mt-1.5 min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="glossary">Glosario (Opcional)</Label>
          <Textarea
            id="glossary"
            placeholder="Ingrese términos del glosario. Formato: Título: Contenido (presione Enter para agregar otro término)"
            value={courseData.glossary || ""}
            onChange={(e) => setCourseData({ ...courseData, glossary: e.target.value })}
            className="mt-1.5 min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground mt-1">Formato: Título: Contenido (un término por línea)</p>
        </div>

        <div>
          <Label htmlFor="objectives">Objetivos (Opcional)</Label>
          <Textarea
            id="objectives"
            placeholder="Ingrese objetivos del curso. Formato: Título: Contenido (presione Enter para agregar otro objetivo)"
            value={courseData.objectives || ""}
            onChange={(e) => setCourseData({ ...courseData, objectives: e.target.value })}
            className="mt-1.5 min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground mt-1">Formato: Título: Contenido (un objetivo por línea)</p>
        </div>

        <div>
          <Label htmlFor="video">Video Principal (Opcional)</Label>
          <p className="text-xs text-muted-foreground mb-2">Si no subes un video, se usará el video por defecto</p>
          
          {!videoFileName ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="mt-1.5 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click para subir video</p>
              <p className="text-xs text-muted-foreground mt-1">MP4, WebM, OGG</p>
            </div>
          ) : (
            <div className="mt-1.5 border border-border rounded-lg p-4 flex items-center justify-between bg-muted">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{videoFileName}</span>
              </div>
              <button
                type="button"
                onClick={removeVideo}
                className="text-destructive hover:text-destructive/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}
