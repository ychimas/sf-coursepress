"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, Plus, Search, FileText, CheckCircle, Clock, FolderOpen, Trash2, ArrowLeft, Download, Edit, Settings, LayoutGrid, List, MoreVertical, FolderGit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomModal } from "@/components/ui/custom-modal"
import { GitHubModal } from "@/components/dashboard/github-modal"

interface SavedCourse {
  id: string
  name: string
  description: string
  category: string
  lessons: number
  createdAt: string
  path: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCourses, setFilteredCourses] = useState<SavedCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [modalSearchQuery, setModalSearchQuery] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openMenuId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' && !showSearchModal) {
        e.preventDefault()
        setShowSearchModal(true)
      }
      if (e.key === 'Escape' && showSearchModal) {
        setShowSearchModal(false)
        setModalSearchQuery('')
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSearchModal])

  useEffect(() => {
    loadSavedCourses()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(savedCourses)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = savedCourses.filter(course =>
        course.name.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query)
      )
      setFilteredCourses(filtered)
    }
  }, [searchQuery, savedCourses])

  const loadSavedCourses = async () => {
    try {
      // 1. Load from Server (API)
      let serverCourses: SavedCourse[] = []
      try {
        const response = await fetch('/api/cursos/list')
        if (response.ok) {
          serverCourses = await response.json()
        }
      } catch (e) {
        console.warn('Failed to load courses from server (likely offline or demo)', e)
      }

      // 2. Load from LocalStorage (Client Persistence)
      let localCourses: SavedCourse[] = []
      try {
        const localData = localStorage.getItem('sf-coursepress-courses')
        if (localData) {
          localCourses = JSON.parse(localData)
        }
      } catch (e) {
        console.error('Failed to load from localStorage', e)
      }

      // 3. Merge: Server takes precedence if ID conflicts (or client? Let's say Client for "latest" feel)
      // Actually, let's just union them by ID.
      const allCoursesMap = new Map<string, SavedCourse>()
      
      // Add server courses first
      serverCourses.forEach(c => allCoursesMap.set(c.id, c))
      
      // Add local courses (overwriting if same ID, which effectively handles updates in demo mode)
      localCourses.forEach(c => allCoursesMap.set(c.id, c))

      const allCourses = Array.from(allCoursesMap.values())
      
      // Sort by date desc
      allCourses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setSavedCourses(allCourses)
      setFilteredCourses(allCourses)
    } catch (error) {
      console.error('Error cargando cursos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'alert' | 'confirm'; onConfirm?: () => void }>({ isOpen: false, title: '', message: '', type: 'alert' })
  const [editModal, setEditModal] = useState<{ isOpen: boolean; courseId: string }>({ isOpen: false, courseId: '' })
  const [gitModal, setGitModal] = useState<{ isOpen: boolean; courseId: string; courseName: string }>({ isOpen: false, courseId: '', courseName: '' })

  const handleDeleteCourse = async (courseId: string) => {
    setModal({
      isOpen: true,
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de eliminar este curso? Esta acción no se puede deshacer.',
      type: 'confirm',
      onConfirm: async () => {
        try {
          await fetch('/api/cursos/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseId })
          })
          loadSavedCourses()
        } catch (error) {
          console.error('Error eliminando curso:', error)
        }
      }
    })
  }

  const handleDownloadCourse = async (courseId: string) => {
    const progressModal = document.createElement('div')
    progressModal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center'
    progressModal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Preparando descarga</h3>
          <p class="text-sm text-slate-600">Generando archivo ZIP del curso...</p>
        </div>
        <div class="relative">
          <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div id="progress-bar" class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300" style="width: 0%"></div>
          </div>
          <p id="progress-text" class="text-xs text-slate-500 mt-2 text-center">0%</p>
        </div>
      </div>
    `
    document.body.appendChild(progressModal)

    const progressBar = progressModal.querySelector('#progress-bar') as HTMLElement
    const progressText = progressModal.querySelector('#progress-text') as HTMLElement

    let progress = 0
    const interval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 15
        if (progress > 90) progress = 90
        progressBar.style.width = `${progress}%`
        progressText.textContent = `${Math.round(progress)}%`
      }
    }, 200)

    try {
      const response = await fetch('/api/cursos/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })

      const blob = await response.blob()

      clearInterval(interval)
      progress = 100
      progressBar.style.width = '100%'
      progressText.textContent = '100%'

      await new Promise(resolve => setTimeout(resolve, 300))

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${courseId}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      document.body.removeChild(progressModal)
    } catch (error) {
      clearInterval(interval)
      console.error('Error descargando curso:', error)
      progressModal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Error al descargar</h3>
          <p class="text-sm text-slate-600 mb-4">No se pudo completar la descarga</p>
          <button onclick="this.closest('.fixed').remove()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Cerrar</button>
        </div>
      `
      setTimeout(() => {
        if (document.body.contains(progressModal)) {
          document.body.removeChild(progressModal)
        }
      }, 3000)
    }
  }


  const stats = [
    { label: "Total Cursos", value: savedCourses.length.toString(), icon: BookOpen, color: "text-blue-600" },
    { label: "Activos", value: savedCourses.length.toString(), icon: CheckCircle, color: "text-green-600" },
    { label: "Este Mes", value: savedCourses.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length.toString(), icon: Clock, color: "text-amber-600" },
    { label: "Total Lecciones", value: savedCourses.reduce((sum, c) => sum + c.lessons, 0).toString(), icon: FileText, color: "text-blue-600" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-color.svg" alt="SF CoursePress" className="h-10" />
            <span className="text-2xl font-bold text-gray-900">SF CoursePress</span>
          </Link>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <button
              onClick={() => setShowSearchModal(true)}
              className={`flex items-center justify-between h-9 px-4 w-48 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 text-slate-600 ${showSearchModal ? 'scale-110 bg-blue-50 border-blue-300' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Search className={`w-4 h-4 transition-transform duration-200 ${showSearchModal ? 'scale-125' : ''}`} />
                <span>Buscar...</span>
              </div>
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs">F</kbd>
            </button>
            <Link href="/">
              <Button variant="outline" className="border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Inicio
              </Button>
            </Link>
            <Link href="/creator">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Crear Curso
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="card-modern border-slate-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-1">{stat.label}</p>
                    <p className="text-xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              {mounted && (
                <Input
                  placeholder="Buscar cursos por nombre o descripción..."
                  className="pl-10 border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-slate-600 mt-2">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
              </p>
            )}
          </div>
          <div className="flex gap-1 border border-slate-300 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={`px-3 ${viewMode === 'list' ? 'bg-slate-100' : ''}`}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`px-3 ${viewMode === 'grid' ? 'bg-slate-100' : ''}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Saved Courses List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Mis Cursos</h2>
          {isLoading ? (
            <Card className="card-modern border-slate-200 p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Cargando cursos...</h3>
              <p className="text-slate-600">Por favor espera un momento</p>
            </Card>
          ) : filteredCourses.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid gap-6'}>
              {filteredCourses.map((course) => (
                <Card key={course.id} className="card-modern border-slate-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl mb-2 text-slate-900">
                          <div className="flex items-start gap-2">
                            <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="break-words">{course.name}</span>
                          </div>
                        </CardTitle>
                        <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {course.lessons} lecciones
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(course.createdAt).toLocaleDateString("es-ES")}
                          </span>
                        </CardDescription>
                        {course.description && (
                          <p className="text-sm text-slate-600 mt-2">{course.description}</p>
                        )}
                      </div>
                      {viewMode === 'grid' && (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              e.nativeEvent.stopImmediatePropagation()
                              setOpenMenuId(openMenuId === course.id ? null : course.id)
                            }}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                          {openMenuId === course.id && (
                            <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[160px] z-10">
                              <button
                                onClick={() => {
                                  setGitModal({ isOpen: true, courseId: course.id, courseName: course.name })
                                  setOpenMenuId(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-900"
                              >
                                <FolderGit2 className="w-4 h-4" />
                                GitHub
                              </button>
                              <button
                                onClick={() => {
                                  setEditModal({ isOpen: true, courseId: course.id })
                                  setOpenMenuId(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-blue-600"
                              >
                                <Edit className="w-4 h-4" />
                                Editar Curso
                              </button>
                              <button
                                onClick={() => {
                                  handleDownloadCourse(course.id)
                                  setOpenMenuId(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-600"
                              >
                                <Download className="w-4 h-4" />
                                Descargar ZIP
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteCourse(course.id)
                                  setOpenMenuId(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  {viewMode === 'list' && (
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto border-slate-900 text-slate-900 hover:bg-slate-50" onClick={() => setGitModal({ isOpen: true, courseId: course.id, courseName: course.name })}>
                          <FolderGit2 className="w-4 h-4 mr-2" />
                          GitHub
                        </Button>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => setEditModal({ isOpen: true, courseId: course.id })}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar Curso
                        </Button>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto border-slate-300 text-slate-600 hover:bg-slate-50" onClick={() => handleDownloadCourse(course.id)}>
                          <Download className="w-4 h-4 mr-2" />
                          Descargar ZIP
                        </Button>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto border-red-300 text-red-600 hover:bg-red-50" onClick={() => handleDeleteCourse(course.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : searchQuery ? (
            <Card className="card-modern border-slate-200 p-12 text-center">
              <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-slate-900">No se encontraron cursos</h3>
              <p className="text-slate-600 mb-6">Intenta con otros términos de búsqueda</p>
              <Button onClick={() => setSearchQuery('')} className="bg-blue-600 hover:bg-blue-700 text-white">
                Limpiar búsqueda
              </Button>
            </Card>
          ) : (
            <Card className="card-modern border-slate-200 p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-slate-900">No hay cursos creados</h3>
              <p className="text-slate-600 mb-6">Crea tu primer curso para comenzar</p>
              <Link href="/creator">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nuevo Curso
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      {/* Search Modal */}
      {showSearchModal && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-200" onClick={() => setShowSearchModal(false)} />
          <div className="fixed top-5 right-20 z-[60] animate-in zoom-in-95 slide-in-from-top-2 duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-96 border border-slate-200" onClick={(e) => e.stopPropagation()}>
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar cursos..."
                    className="w-full pl-9 pr-16 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs">ESC</kbd>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto border-t border-slate-200">
                {savedCourses
                  .filter(course =>
                    course.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                    course.description?.toLowerCase().includes(modalSearchQuery.toLowerCase())
                  )
                  .map((course) => (
                    <div
                      key={course.id}
                      className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      onClick={() => {
                        setEditModal({ isOpen: true, courseId: course.id })
                        setShowSearchModal(false)
                        setModalSearchQuery('')
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-900 truncate">{course.name}</h4>
                          <p className="text-xs text-slate-500 truncate">{course.lessons} lecciones</p>
                        </div>
                      </div>
                    </div>
                  ))}
                {savedCourses.filter(course =>
                  course.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                  course.description?.toLowerCase().includes(modalSearchQuery.toLowerCase())
                ).length === 0 && (
                    <div className="p-6 text-center text-sm text-slate-500">
                      No se encontraron cursos
                    </div>
                  )}
              </div>

            </div>
          </div>
        </>
      )}

      {/* GitHub Modal */}
      <GitHubModal
        isOpen={gitModal.isOpen}
        onClose={() => setGitModal({ isOpen: false, courseId: '', courseName: '' })}
        courseId={gitModal.courseId}
        courseName={gitModal.courseName}
      />

      {/* Edit Options Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditModal({ isOpen: false, courseId: '' })}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">¿Qué deseas editar?</h3>
            <p className="text-slate-600 mb-6">Selecciona el tipo de edición que necesitas</p>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                className="block h-full text-left"
                onClick={() => {
                  const id = editModal.courseId
                  setEditModal({ isOpen: false, courseId: '' })
                  setTimeout(() => router.push(`/edit/${id}`), 0)
                }}
              >
                <div className="border-2 border-slate-200 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                    <Settings className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Información y Estructura</h4>
                  <p className="text-sm text-slate-600">Edita el nombre, descripción y agrega o elimina lecciones del curso</p>
                </div>
              </button>

              <button
                type="button"
                className="block h-full text-left"
                onClick={() => {
                  const id = editModal.courseId
                  setEditModal({ isOpen: false, courseId: '' })
                  setTimeout(() => router.push(`/editor/curso-${id}`), 0)
                }}
              >
                <div className="border-2 border-slate-200 rounded-xl p-6 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group h-full">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                    <Edit className="w-6 h-6 text-green-600 group-hover:text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Editar Momentos</h4>
                  <p className="text-sm text-slate-600">Modifica el contenido de cada momento: textos, imágenes, videos y actividades</p>
                </div>
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setEditModal({ isOpen: false, courseId: '' })}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
