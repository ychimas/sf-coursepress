"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, ArrowLeft, Save, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepOne } from "@/components/creator/step-one"
import { StepTwo } from "@/components/creator/step-two"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CourseData } from "@/lib/scorm-generator"

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [errorModal, setErrorModal] = useState<{ show: boolean; message: string }>({ show: false, message: '' })
  const [customVideoFile, setCustomVideoFile] = useState<File | null>(null)

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      const response = await fetch('/api/cursos/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })
      const data = await response.json()
      setCourseData(data)
    } catch (error) {
      console.error('Error cargando curso:', error)
      setErrorModal({ show: true, message: 'Error al cargar el curso' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!courseData) return
    
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('courseId', courseId)
      formData.append('metadata', JSON.stringify(courseData))
      if (customVideoFile) {
        formData.append('customVideo', customVideoFile, customVideoFile.name)
      }
      const response = await fetch('/api/cursos/update', {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) throw new Error('Error al guardar')

      setSuccessModal(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Error guardando curso:', error)
      setErrorModal({ show: true, message: 'Error al guardar el curso' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4 text-slate-900">Curso no encontrado</p>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-color.svg" alt="SF CoursePress" className="h-10" />
            <span className="text-2xl font-bold text-gray-900">SF CoursePress</span>
          </Link>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline" className="border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </Link>
            <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar Cambios
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Editar Curso</h1>
        <p className="text-slate-600 mb-8">{courseData.name}</p>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-slate-200">
            <TabsTrigger value="info" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Información Básica</TabsTrigger>
            <TabsTrigger value="structure" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Estructura</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-6">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-lg">
              <StepOne courseData={courseData} setCourseData={setCourseData} setCustomVideoFile={setCustomVideoFile} />
            </div>
          </TabsContent>
          
          <TabsContent value="structure" className="mt-6">
            <StepTwo courseData={courseData} setCourseData={setCourseData} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Curso Guardado!</h3>
            <p className="text-slate-600">Los cambios se han guardado exitosamente</p>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setErrorModal({ show: false, message: '' })}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Error</h3>
            <p className="text-slate-600 mb-6">{errorModal.message}</p>
            <Button onClick={() => setErrorModal({ show: false, message: '' })} className="bg-red-600 hover:bg-red-700">
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
