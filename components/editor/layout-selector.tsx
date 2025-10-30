"use client"

import { useState, useEffect } from "react"
import { Grid, Layout, Columns, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LayoutSelectorProps {
  onSelectLayout: (layout: string) => void
  momentId?: string
  projectId?: string
}

export function LayoutSelector({ onSelectLayout, momentId, projectId }: LayoutSelectorProps) {
  const [momentoUsed, setMomentoUsed] = useState<{[key: string]: boolean}>({})
  const [isLoading, setIsLoading] = useState(true)

  // Detectar lección actual desde momentId (formato: momento1_1, momento2_3, etc.)
  const currentLesson = momentId ? parseInt(momentId.split('_')[0].replace('momento', '')) : 1

  // Cargar estado de layouts usados
  useEffect(() => {
    const checkMomentoUsage = async () => {
      if (!projectId) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/course-structure?projectId=${projectId}`)
        if (response.ok) {
          const data = await response.json()
          const used: {[key: string]: boolean} = {}
          
          // Revisar cada lección para ver si ya tiene el layout "momento"
          for (const lesson of data.structure || []) {
            const lessonNum = parseInt(lesson.name.replace('leccion', ''))
            
            // Revisar cada momento de la lección
            for (const moment of lesson.moments || []) {
              // Saltar el momento actual que estamos editando
              if (moment.id === momentId) continue
              
              const momentResponse = await fetch(`/api/load-moment?projectId=${projectId}&momentId=${moment.id}`)
              if (momentResponse.ok) {
                const momentData = await momentResponse.json()
                if (momentData.htmlContent && momentData.htmlContent.includes('dividerImgSeccion')) {
                  used[`leccion${lessonNum}`] = true
                  break
                }
              }
            }
          }
          
          setMomentoUsed(used)
        }
      } catch (error) {
        console.error('Error verificando uso de momento:', error)
      }
      setIsLoading(false)
    }

    checkMomentoUsage()
  }, [projectId, momentId])

  const isMomentoDisabled = momentoUsed[`leccion${currentLesson}`] || false
  const layouts = [
    {
      id: "momento",
      name: "Momento - Portada de lección",
      icon: <Grid className="w-8 h-8" />,
      preview: "Portada especial"
    },
    {
      id: "6-6",
      name: "6/6 - Dos columnas iguales",
      icon: <Columns className="w-8 h-8" />,
      preview: "col-6 | col-6"
    },
    {
      id: "5-7", 
      name: "5/7 - Izquierda menor",
      icon: <Layout className="w-8 h-8" />,
      preview: "col-5 | col-7"
    },
    {
      id: "7-5",
      name: "7/5 - Izquierda mayor", 
      icon: <Layout className="w-8 h-8 rotate-180" />,
      preview: "col-7 | col-5"
    },
    {
      id: "12-12",
      name: "12/12 - Una columna",
      icon: <Square className="w-8 h-8" />,
      preview: "col-12"
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Selecciona un Layout</h2>
        <p className="text-muted-foreground">Elige la estructura base para tu momento</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Verificando layouts disponibles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {layouts.map((layout) => {
            const isDisabled = layout.id === 'momento' && isMomentoDisabled
            return (
              <Card 
                key={layout.id}
                className={`transition-shadow ${
                  isDisabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer hover:shadow-md'
                }`}
                onClick={() => !isDisabled && onSelectLayout(layout.id)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-2 text-primary">
                    {layout.icon}
                  </div>
                  <CardTitle className="text-sm">{layout.name}</CardTitle>
                  {isDisabled && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Ya usado en esta lección
                    </p>
                  )}
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-muted rounded p-2 text-xs font-mono">
                    {layout.preview}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}