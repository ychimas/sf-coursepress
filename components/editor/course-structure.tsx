"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, FileText, Play, Puzzle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LocalProject } from "@/lib/project-manager"

interface CourseStructureProps {
  project: LocalProject
  selectedMoment: string | null
  onSelectMoment: (momentId: string) => void
  isEditing?: boolean
  savedMoments?: string[]
}

export function CourseStructure({ project, selectedMoment, onSelectMoment, isEditing, savedMoments = [] }: CourseStructureProps) {
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set(['leccion1']))
  const [lessons, setLessons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons(new Set([lessonId]))
  }

  const getMomentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />
      case 'interactive': return <Puzzle className="w-4 h-4" />
      case 'quiz': return <HelpCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  // Cargar estructura del proyecto
  useEffect(() => {
    const loadStructure = async () => {
      try {
        const response = await fetch(`/api/course-structure?projectId=${project.id}`)
        if (response.ok) {
          const data = await response.json()
          setLessons(data.structure || [])
        }
      } catch (error) {
        console.error('Error cargando estructura:', error)
        setLessons([])
      } finally {
        setIsLoading(false)
      }
    }
    loadStructure()
  }, [project.id])

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-4 border-b border-slate-700">
        <div className="group-hover:block hidden">
          <h2 className="font-semibold text-lg text-white">Estructura del Curso</h2>
          <p className="text-sm text-slate-400">{project.name}</p>
        </div>
        <div className="group-hover:hidden block text-center">
          <FileText className="w-6 h-6 mx-auto text-blue-400" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-900">
        <div className="p-2">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <p className="text-sm text-slate-400">Cargando...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-slate-400">No hay lecciones disponibles</p>
            </div>
          ) : (
            lessons.map((lesson) => (
            <div key={lesson.id} className="mb-2">
              <Button
                variant="ghost"
                className="w-full justify-start p-2 h-auto hover:bg-slate-800 text-slate-300"
                onClick={() => toggleLesson(lesson.id)}
              >
                <div className="group-hover:hidden block">
                  <div className="w-6 h-6 bg-blue-500/20 rounded text-xs flex items-center justify-center text-blue-400 font-bold">
                    {lesson.id.slice(-1)}
                  </div>
                </div>
                <div className="group-hover:block hidden flex items-center">
                  {expandedLessons.has(lesson.id) ? (
                    <ChevronDown className="w-4 h-4 mr-2 text-slate-300" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2 text-slate-300" />
                  )}
                  <div className="text-left">
                    <div className="font-medium text-white">{lesson.name}</div>
                    <div className="text-xs text-slate-400">
                      {lesson.moments.length} momentos
                    </div>
                  </div>
                </div>
              </Button>
              
              {expandedLessons.has(lesson.id) && (
                <div className="ml-6 mt-1 space-y-1 group-hover:block hidden">
                  {lesson.moments.map((moment: any) => (
                    <Button
                      key={moment.id}
                      variant="ghost"
                      className={`w-full justify-start p-2 h-auto text-sm hover:bg-slate-800 ${
                        selectedMoment === moment.id ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-300'
                      } ${
                        selectedMoment && selectedMoment !== moment.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => {
                        if (!selectedMoment || selectedMoment === moment.id) {
                          onSelectMoment(moment.id)
                        }
                      }}
                      disabled={selectedMoment !== null && selectedMoment !== moment.id}
                    >
                      {getMomentIcon(moment.type)}
                      <span className="ml-2">{moment.name}</span>
                      {savedMoments.includes(moment.id) && (
                        <span className="ml-auto text-green-400">✓</span>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  )
}