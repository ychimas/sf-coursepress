"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, ArrowLeft, ArrowRight, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepOne } from "@/components/creator/step-one"
import { StepTwo } from "@/components/creator/step-two"
import { StepThree } from "@/components/creator/step-three"
// import { generateCourseFromTemplate } from "@/lib/template-generator"
import type { CourseData } from "@/lib/scorm-generator"
import { CustomModal } from "@/components/ui/custom-modal"

export default function CreatorPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [courseData, setCourseData] = useState<CourseData>({
    name: "",
    folderName: "",
    description: "",
    category: "",
    lessons: [],
  })
  const [customVideoFile, setCustomVideoFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([])
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'alert' | 'confirm' }>({ isOpen: false, title: '', message: '', type: 'alert' })

  const steps = [
    { number: 1, title: "Información Básica" },
    { number: 2, title: "Estructura del Curso" },
    { number: 3, title: "Confirmación" },
  ]

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGenerateCourse = async () => {
    setIsGenerating(true)

    try {
      // 1. Save to LocalStorage (Client-side persistence for Vercel Demo)
      try {
        const savedCoursesStr = localStorage.getItem('sf-coursepress-courses')
        const savedCourses = savedCoursesStr ? JSON.parse(savedCoursesStr) : []
        
        // Generate a unique ID if not present (usually name-based in this app, but let's be safe)
        const newCourseId = courseData.folderName || courseData.name.toLowerCase().replace(/\s+/g, '-')
        const newCourse = {
          ...courseData,
          id: newCourseId,
          path: newCourseId, // Simulate path
          createdAt: new Date().toISOString()
        }
        
        // Remove existing if updating (though creator usually makes new)
        const filteredCourses = savedCourses.filter((c: any) => c.id !== newCourseId)
        filteredCourses.push(newCourse)
        
        localStorage.setItem('sf-coursepress-courses', JSON.stringify(filteredCourses))
        console.log("Course saved to localStorage successfully")
      } catch (e) {
        console.error("Failed to save to localStorage", e)
      }

      // 2. Attempt to save to server (Normal flow)
      const formData = new FormData()
      formData.append('metadata', JSON.stringify(courseData))
      if (customVideoFile) {
        formData.append('customVideo', customVideoFile, customVideoFile.name)
      }
      
      const response = await fetch('/api/cursos/save', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        // On Vercel, this WILL fail. But since we saved to localStorage, 
        // we can pretend it succeeded for the user's session.
        console.warn('Server save failed (expected on demo), using client-side data')
        throw new Error('Server save failed') // Trigger catch block to decide next step
      }

      // If server success (local dev), all good
      const result = await response.json()
      setModal({ isOpen: true, title: '¡Éxito!', message: '¡Curso creado exitosamente! Ahora puedes editarlo desde el Dashboard.', type: 'alert' })
      setTimeout(() => window.location.href = '/dashboard', 1500)
      
    } catch (error) {
      console.warn("Server save failed, relying on localStorage:", error)
      
      // Since we successfully saved to localStorage (Step 1), we treat this as a success for the user.
      // We show a slightly different message indicating it's a "local" course.
      setModal({ 
        isOpen: true, 
        title: '¡Curso Creado!', 
        message: 'El curso se ha guardado en tu navegador (Modo Demo). Puedes verlo y editarlo en el Dashboard.', 
        type: 'alert' 
      })
      setTimeout(() => window.location.href = '/dashboard', 2000)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateZipLocally = async () => {
    try {
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      // Generate structure
      const { generateCourse } = await import("@/lib/scorm-generator")
      const files = generateCourse(courseData)

      // Add generated files
      files.forEach(file => {
        zip.file(file.path, file.content)
      })

      // Add custom video if exists
      if (customVideoFile) {
        zip.file("assets/video/custom_video.mp4", customVideoFile)
      }

      // Add images if they exist in courseData
      courseData.lessons.forEach((lesson, lIndex) => {
        lesson.moments.forEach((moment: any, mIndex) => {
          if (moment.image && moment.image.data) {
            const momentFolder = `momento${lIndex + 1}_${mIndex + 1}`
            const ext = moment.image.name.split('.').pop() || 'webp'
            const base64Data = moment.image.data.includes(',') ? moment.image.data.split(',')[1] : moment.image.data
            zip.file(`module/leccion${lIndex + 1}/${momentFolder}/img/img.${ext}`, base64Data, { base64: true })
          }
        })
      })

      // Generate blob
      const content = await zip.generateAsync({ type: "blob" })

      // Trigger download
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = `${courseData.folderName || "curso"}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error generating zip locally:", err)
      alert("Error generando el archivo ZIP localmente.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-color.svg" alt="SF CoursePress" className="h-10" />
            <span className="text-2xl font-bold text-gray-900">SF CoursePress</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-2 transition-colors shadow-lg text-xl ${currentStep > step.number
                      ? "bg-blue-600 text-white"
                      : currentStep === step.number
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-400"
                      }`}
                  >
                    {currentStep > step.number ? <Check className="w-6 h-6" /> : <span>{step.number}</span>}
                  </div>
                  <span
                    className={`text-sm font-medium text-center ${currentStep >= step.number ? "text-slate-900" : "text-slate-400"
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 rounded transition-colors ${currentStep > step.number ? "bg-blue-600" : "bg-slate-200"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 mb-8 shadow-lg">
          {currentStep === 1 && <StepOne courseData={courseData} setCourseData={setCourseData} setCustomVideoFile={setCustomVideoFile} />}
          {currentStep === 2 && <StepTwo courseData={courseData} setCourseData={setCourseData} />}
          {currentStep === 3 && <StepThree courseData={courseData} />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="border-slate-300 text-slate-600 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          {currentStep < 3 ? (
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" onClick={handleGenerateCourse} disabled={isGenerating}>
              {isGenerating ? (
                <>Creando...</>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Crear Curso
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div >
  )
}
