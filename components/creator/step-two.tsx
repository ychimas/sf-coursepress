"use client"

import { Plus, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRef } from "react"

interface StepTwoProps {
  courseData: any
  setCourseData: (data: any) => void
}

export function StepTwo({ courseData, setCourseData }: StepTwoProps) {
  const addLesson = () => {
    const newLesson = {
      id: Date.now(),
      name: "",
      moments: [],
    }
    setCourseData({
      ...courseData,
      lessons: [...courseData.lessons, newLesson],
    })
  }

  const removeLesson = (lessonId: number) => {
    setCourseData({
      ...courseData,
      lessons: courseData.lessons.filter((l: any) => l.id !== lessonId),
    })
  }

  const updateLesson = (lessonId: number, field: string, value: any) => {
    setCourseData({
      ...courseData,
      lessons: courseData.lessons.map((l: any) => (l.id === lessonId ? { ...l, [field]: value } : l)),
    })
  }

  const addMoment = (lessonId: number) => {
    const lesson = courseData.lessons.find((l: any) => l.id === lessonId)
    const lessonIndex = courseData.lessons.findIndex((l: any) => l.id === lessonId)
    const momentIndex = lesson.moments.length
    const newMoment = {
      id: Date.now(),
      type: "slider",
      name: `momento${lessonIndex + 1}_${momentIndex + 1}`,
    }
    setCourseData({
      ...courseData,
      lessons: courseData.lessons.map((l: any) =>
        l.id === lessonId ? { ...l, moments: [...l.moments, newMoment] } : l,
      ),
    })
  }

  const removeMoment = (lessonId: number, momentId: number) => {
    setCourseData({
      ...courseData,
      lessons: courseData.lessons.map((l: any) =>
        l.id === lessonId ? { ...l, moments: l.moments.filter((m: any) => m.id !== momentId) } : l,
      ),
    })
  }

  const updateMoment = (lessonId: number, momentId: number, field: string, value: any) => {
    setCourseData({
      ...courseData,
      lessons: courseData.lessons.map((l: any) =>
        l.id === lessonId
          ? {
              ...l,
              moments: l.moments.map((m: any) => (m.id === momentId ? { ...m, [field]: value } : m)),
            }
          : l,
      ),
    })
  }





  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Estructura del Curso</h2>
        <p className="text-muted-foreground">Define las lecciones y momentos de tu curso</p>
      </div>

      <div className="space-y-4">
        {courseData.lessons.map((lesson: any, lessonIndex: number) => (
          <Card key={lesson.id}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                <CardTitle className="text-lg">Lección {lessonIndex + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLesson(lesson.id)}
                  className="ml-auto text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nombre de la Lección</Label>
                <Input
                  placeholder="Ej: Introducción al tema"
                  value={lesson.name}
                  onChange={(e) => updateLesson(lesson.id, "name", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Momentos</Label>
                  <Button variant="outline" size="sm" onClick={() => addMoment(lesson.id)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar Momento
                  </Button>
                </div>

                <div className="space-y-3">
                  {lesson.moments.map((moment: any, momentIndex: number) => (
                    <div key={moment.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                      <span className="text-sm font-medium flex-1">{moment.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMoment(lesson.id, moment.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {lesson.moments.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay momentos. Agrega el primero.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {courseData.lessons.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No hay lecciones creadas. Comienza agregando la primera.</p>
          </Card>
        )}

        <Button onClick={addLesson} variant="outline" className="w-full bg-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Lección
        </Button>
      </div>
    </div>
  )
}
