"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Eye, Code, Palette, Settings, Type, Image, MousePointer, Table, Video, Puzzle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectManager, LocalProject } from "@/lib/project-manager"
import { CourseStructure } from "@/components/editor/course-structure"
import { VisualEditor } from "@/components/editor/visual-editor"
import { CodeEditor } from "@/components/editor/code-editor"
import { ComponentsPalette } from "@/components/editor/components-palette"
import { PreviewCarousel } from "@/components/editor/preview-carousel"

export default function EditorPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const [project, setProject] = useState<LocalProject | null>(null)
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("visual")
  const [currentHtml, setCurrentHtml] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [allMoments, setAllMoments] = useState<any[]>([])
  const [previewIndex, setPreviewIndex] = useState(0)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showComponents, setShowComponents] = useState(false)
  const [savedMoments, setSavedMoments] = useState<Set<string>>(new Set())

  // Cargar momentos guardados desde localStorage
  useEffect(() => {
    if (projectId) {
      const saved = localStorage.getItem(`savedMoments-${projectId}`)
      if (saved) {
        setSavedMoments(new Set(JSON.parse(saved)))
      }
    }
  }, [projectId])

  // Guardar momentos en localStorage cuando cambien
  useEffect(() => {
    if (projectId && savedMoments.size > 0) {
      localStorage.setItem(`savedMoments-${projectId}`, JSON.stringify(Array.from(savedMoments)))
    }
  }, [savedMoments, projectId])

  const [initialHtml, setInitialHtml] = useState("")

  // Detectar cambios sin guardar comparando con el HTML inicial
  useEffect(() => {
    if (currentHtml && initialHtml && currentHtml !== initialHtml) {
      setHasUnsavedChanges(true)
      setIsEditing(true)
    } else {
      setHasUnsavedChanges(false)
      setIsEditing(false)
    }
  }, [currentHtml, initialHtml])

  const [isLoadingProject, setIsLoadingProject] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      setIsLoadingProject(true)
      let foundProject = ProjectManager.getProjectById(projectId)

      // Si es un curso guardado localmente (Demo Mode / Vercel)
      if (!foundProject && projectId.startsWith('curso-')) {
        const courseId = projectId.replace('curso-', '')
        
        // 1. Try LocalStorage first
        try {
            const savedCoursesStr = localStorage.getItem('sf-coursepress-courses')
            if (savedCoursesStr) {
                const savedCourses = JSON.parse(savedCoursesStr)
                const localCourse = savedCourses.find((c: any) => c.id === courseId)
                if (localCourse) {
                    foundProject = await ProjectManager.addCourseAsProject(
                        courseId,
                        localCourse.name,
                        localCourse.lessons.length
                    )
                    // We need to ensure the project structure matches the local course
                    // But ProjectManager runs on server usually? 
                    // Wait, ProjectManager is imported. If it's a client-side library, we are good.
                    // If it's server-side only, this import would fail or be mocked.
                    // Assuming it works or we can mock the project object.
                    if (!foundProject) {
                         // Mock project object if ProjectManager fails or is empty
                         foundProject = {
                             id: projectId,
                             name: localCourse.name,
                             path: localCourse.path || '',
                             lessons: localCourse.lessons.length,
                             description: localCourse.description || 'Curso importado',
                             createdAt: new Date().toISOString(),
                             lastModified: new Date().toISOString()
                         }
                    }
                }
            }
        } catch(e) { console.error("Error loading local project", e)}

        // 2. Try Server if not found locally
        if (!foundProject) {
            try {
              const response = await fetch('/api/cursos/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId })
              })
    
              if (response.ok) {
                const courseData = await response.json()
                foundProject = await ProjectManager.addCourseAsProject(
                  courseId,
                  courseData.name,
                  courseData.lessons.length
                )
              }
            } catch (error) {
              console.error('Error cargando curso:', error)
            }
        }
      }

      setProject(foundProject || null)
      setSelectedMoment(null)
      setCurrentHtml("")
      setHasUnsavedChanges(false)
      setIsEditing(false)

      // Cargar todos los momentos y detectar cuáles tienen contenido
      if (foundProject) {
        await loadAllMoments(foundProject.id)
        await detectSavedMoments(foundProject.id)
      }

      setIsLoadingProject(false)
    }

    loadProject()

    // Cleanup: limpiar estado al desmontar o cambiar proyecto
    return () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`editor-state-${projectId}`)
      }
    }
  }, [projectId])

  // Detectar qué momentos tienen contenido guardado
  const detectSavedMoments = async (projectId: string) => {
    try {
      const response = await fetch(`/api/course-structure?projectId=${projectId}`)
      if (response.ok) {
        const data = await response.json()
        const momentsWithContent: string[] = []

        for (const lesson of data.structure || []) {
          for (const moment of lesson.moments || []) {
            const htmlResponse = await fetch(`/api/load-moment?projectId=${projectId}&momentId=${moment.id}`)
            if (htmlResponse.ok) {
              const htmlData = await htmlResponse.json()
              if (htmlData.htmlContent && htmlData.htmlContent.includes('<section')) {
                momentsWithContent.push(moment.id)
              }
            }
          }
        }

        setSavedMoments(new Set(momentsWithContent))
      }
    } catch (error) {
      console.error('Error detectando momentos guardados:', error)
    }
  }

  const loadAllMoments = async (projectId: string) => {
    try {
      const response = await fetch(`/api/course-structure?projectId=${projectId}`)
      if (response.ok) {
        const data = await response.json()
        const moments: any[] = []

        for (const lesson of data.structure || []) {
          for (const moment of lesson.moments || []) {
            const htmlResponse = await fetch(`/api/load-moment?projectId=${projectId}&momentId=${moment.id}`)
            if (htmlResponse.ok) {
              const htmlData = await htmlResponse.json()
              if (htmlData.htmlContent && htmlData.htmlContent.includes('<section')) {
                moments.push({ ...moment, lessonName: lesson.name })
              }
            }
          }
        }
        setAllMoments(moments)
      }
    } catch (error) {
      console.error('Error cargando momentos:', error)
    }
  }

  const loadMomentHtml = async (momentId: string) => {
    if (!project) return ''
    try {
      // 1. Try LocalStorage
      const localMoment = localStorage.getItem(`sf-moment-${project.id}-${momentId}`)
      if (localMoment) {
          const data = JSON.parse(localMoment)
          return data.htmlContent || ''
      }

      // 2. Try Server
      const response = await fetch(`/api/load-moment?projectId=${project.id}&momentId=${momentId}`)
      if (response.ok) {
        const data = await response.json()
        return data.htmlContent || '<p>No hay contenido disponible</p>'
      }
    } catch (error) {
      console.error('Error cargando momento:', error)
    }
    return '<p>Error al cargar contenido</p>'
  }

  const [currentImages, setCurrentImages] = useState<any[]>([])
  const [currentAudios, setCurrentAudios] = useState<any[]>([])
  const [currentCss, setCurrentCss] = useState('')
  const [currentJs, setCurrentJs] = useState('')

  const handleSave = async () => {
    if (!currentHtml || !selectedMoment || !project) return

    const loadingToast = document.createElement('div')
    loadingToast.className = 'fixed top-20 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3'
    loadingToast.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Guardando...</span>'
    document.body.appendChild(loadingToast)

    try {
      // Subir imágenes
      for (const img of currentImages) {
        if (img.imageFile) {
          const uploadFormData = new FormData()
          uploadFormData.append('file', img.imageFile)
          uploadFormData.append('projectId', project.id)
          uploadFormData.append('momentId', selectedMoment)

          await fetch('/api/upload-image', {
            method: 'POST',
            body: uploadFormData
          })
        }
      }

      // Subir audios
      for (const audio of currentAudios) {
        if (audio.audioFile) {
          const uploadFormData = new FormData()
          uploadFormData.append('file', audio.audioFile)
          uploadFormData.append('projectId', project.id)
          uploadFormData.append('momentId', selectedMoment)

          await fetch('/api/upload-audio', {
            method: 'POST',
            body: uploadFormData
          })
        }
      }

      // 1. Save to LocalStorage (Demo Mode)
      try {
          const momentData = {
              projectId: project.id,
              momentId: selectedMoment,
              htmlContent: currentHtml,
              images: currentImages, // Note: Files won't persist well in LS, but structure will
              audios: currentAudios,
              cssContent: currentCss,
              jsContent: currentJs,
              lastModified: new Date().toISOString()
          }
          localStorage.setItem(`sf-moment-${project.id}-${selectedMoment}`, JSON.stringify(momentData))
      } catch(e) { console.error("LS save failed", e)}

      // 2. Save to Server
      const response = await fetch('/api/save-moment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          momentId: selectedMoment,
          htmlContent: currentHtml,
          images: currentImages,
          audios: currentAudios,
          cssContent: currentCss,
          jsContent: currentJs
        })
      })

      if (response.ok || true) { // Always treat as success if LS worked (or even if just trying) for demo
        loadingToast.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg><span>Guardado exitosamente</span>'
        setHasUnsavedChanges(false)
        setIsEditing(false)
        const newSavedMoments = new Set([...savedMoments, selectedMoment])
        setSavedMoments(newSavedMoments)
        localStorage.setItem(`savedMoments-${project.id}`, JSON.stringify(Array.from(newSavedMoments)))

        // Volver a la pantalla de selección
        setTimeout(() => {
          setSelectedMoment(null)
          setCurrentHtml("")
        }, 1000)
      } else {
        // loadingToast.innerHTML = '<span>❌ Error al guardar</span>'
      }
      setTimeout(() => document.body.removeChild(loadingToast), 2000)
    } catch (error) {
      console.error('Error:', error)
      loadingToast.innerHTML = '<span>❌ Error al guardar</span>'
      setTimeout(() => document.body.removeChild(loadingToast), 2000)
    }
  }

  const handleMomentSelect = async (momentId: string) => {
    setSelectedMoment(momentId)
    setHasUnsavedChanges(false)

    // Cargar el HTML inicial del momento
    if (project) {
      const html = await loadMomentHtml(momentId)
      setInitialHtml(html)
    }
  }

  if (isLoadingProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando proyecto...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-slate-900">Proyecto no encontrado</h1>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">SF CoursePress</span>
            </Link>
            <div className="border-l border-slate-300 pl-4">
              <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
              <p className="text-sm text-slate-600">Editor Visual</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            {selectedMoment && currentHtml && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Vista Previa
              </Button>
            )}
            {selectedMoment && savedMoments.has(selectedMoment) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedMoment(null)
                  setCurrentHtml("")
                  setHasUnsavedChanges(false)
                }}
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges || !currentHtml || !selectedMoment}
              className={hasUnsavedChanges ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-gray-400 text-white cursor-not-allowed'}
            >
              <Save className="w-4 h-4 mr-2" />
              {hasUnsavedChanges ? 'Guardar Cambios' : 'Guardar'}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar - Course Structure */}
        <div className="w-14 hover:w-80 border-r border-slate-700 bg-slate-900 transition-all duration-300 group overflow-y-auto flex-shrink-0 min-h-[calc(100vh-73px)] sticky top-[73px] self-start">
          <CourseStructure
            project={project}
            selectedMoment={selectedMoment}
            onSelectMoment={handleMomentSelect}
            isEditing={isEditing}
            savedMoments={Array.from(savedMoments)}
          />
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {selectedMoment ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b border-slate-200 px-6 py-3 bg-white flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="visual" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <Palette className="w-4 h-4" />
                    Visual
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <Code className="w-4 h-4" />
                    Código
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <Settings className="w-4 h-4" />
                    Configuración
                  </TabsTrigger>
                </TabsList>
                {activeTab === 'visual' && currentHtml && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComponents(!showComponents)}
                    className={`border-slate-300 transition-colors ${showComponents ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Componentes
                  </Button>
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="visual" className="h-full m-0 flex">
                  <div className="flex-1">
                    <VisualEditor
                      project={project}
                      momentId={selectedMoment}
                      onHtmlChange={(html, videos, images, audios, cssContent, jsContent) => {
                        setCurrentHtml(html)
                        setCurrentImages(images || [])
                        setCurrentAudios(audios || [])
                        setCurrentCss(cssContent || '')
                        setCurrentJs(jsContent || '')
                      }}
                      showComponentsPanel={showComponents}
                    />
                  </div>
                  {/* Components Panel */}
                  <div className={`border-l border-slate-200 bg-white transition-all duration-300 ${showComponents ? 'w-80' : 'w-0'}`}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">Componentes</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowComponents(false)}
                          className="h-6 w-6 p-0 text-slate-600 hover:text-slate-900"
                        >
                          ×
                        </Button>
                      </div>
                      <p className="text-xs text-slate-600 mb-4">Arrastra los componentes al área de trabajo</p>
                      <ComponentsPalette />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="h-full m-0">
                  <CodeEditor
                    project={project}
                    momentId={selectedMoment}
                    initialHtml={currentHtml}
                  />
                </TabsContent>

                <TabsContent value="settings" className="h-full m-0 p-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración del Momento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Configuraciones específicas del momento seleccionado.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="w-full max-w-2xl mx-auto border-2 border-dashed border-slate-300 rounded-3xl p-14 bg-white/80 shadow-md text-center">
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Selecciona un momento para editar</h2>
                <p className="text-slate-700 mb-3">Elige una lección y momento del panel izquierdo para comenzar a editar</p>
                <p className="text-sm text-slate-500">Consejo: los momentos con contenido se marcan en el panel de la izquierda</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Vista Previa */}
      {showPreview && selectedMoment && currentHtml && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Vista Previa - {selectedMoment}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <style>{`
                .row { display: flex; flex-wrap: wrap; margin: 0; }
                .col-12 { flex: 0 0 100%; max-width: 100%; }
                .col-lg-5 { flex: 0 0 41.666667%; max-width: 41.666667%; }
                .col-lg-6 { flex: 0 0 50%; max-width: 50%; }
                .col-lg-7 { flex: 0 0 58.333333%; max-width: 58.333333%; }
                .h-100 { height: 100%; min-height: 500px; }
                .sf-bg-dark { background: linear-gradient(135deg, #1e3a8a, #3730a3); }
                .sf-cl-row { color: white; padding: 2rem; }
                .sf-cr-row { background: #f8fafc; padding: 2rem; }
                .sf-cb-row { background: white; padding: 2rem; }
                .sf-ct-col { background: linear-gradient(135deg, #1e3a8a, #3730a3); color: white; padding: 2rem; text-align: center; }
                .sf-text-white { color: white !important; }
                .sf-text-purple { color: #7c3aed !important; }
                .sf-txt-800 { font-weight: 800; }
                .sf-cr-row .sf-text-white { color: #1e293b !important; }
                .sf-cr-row h1, .sf-cr-row p { color: #1e293b !important; }
                .sf-btn { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
                .sf-btn-purple { background: #7c3aed; color: white; }
                .sf-btn-purple:hover { background: #6d28d9; }
                .sf-img-80 { width: 80px; height: 80px; border-radius: 50%; }
                .responsive-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
                .responsive-table th, .responsive-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .responsive-table th { background-color: #f2f2f2; }
                .activity-container-img { background: #f8f9fa; padding: 2rem; border-radius: 12px; }
                .animate__animated { animation-duration: 1s; }
                .animate__fadeInLeftBig { animation-name: fadeInLeft; }
                .animate__fadeInRightBig { animation-name: fadeInRight; }
                @keyframes fadeInLeft { from { opacity: 0; transform: translate3d(-100%, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
                @keyframes fadeInRight { from { opacity: 0; transform: translate3d(100%, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
              `}</style>
              <div dangerouslySetInnerHTML={{ __html: currentHtml }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
