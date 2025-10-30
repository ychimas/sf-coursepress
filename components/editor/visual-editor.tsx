"use client"

import { useState, useEffect, useCallback } from "react"
import { LocalProject } from "@/lib/project-manager"
import { LayoutSelector } from "./layout-selector"
import { DragDropBuilder } from "./drag-drop-builder"

interface VisualEditorProps {
  project: LocalProject
  momentId: string
  onHtmlChange?: (html: string, videos?: any[], images?: any[], audios?: any[], cssContent?: string, jsContent?: string) => void
  showComponentsPanel?: boolean
}

// Estado global para mantener datos entre pestañas
const editorState = new Map<string, {
  selectedLayout: string | null
  leftContent: any[]
  rightContent: any[]
  htmlContent: string
  videos?: any[]
  images?: any[]
}>()

// Función para limpiar estado de un proyecto
const clearProjectState = (projectId: string) => {
  const keysToDelete = Array.from(editorState.keys()).filter(key => key.startsWith(`${projectId}-`))
  keysToDelete.forEach(key => editorState.delete(key))
}

// Función para cargar contenido guardado
const loadSavedContent = async (projectId: string, momentId: string) => {
  try {
    const response = await fetch(`/api/load-moment?projectId=${projectId}&momentId=${momentId}`)
    if (response.ok) {
      const data = await response.json()
      return data.htmlContent || null
    }
  } catch (error) {
    console.error('Error cargando contenido:', error)
  }
  return null
}

// Función para parsear componentes desde HTML guardado (solo en cliente)
const parseComponentsFromHTML = (html: string) => {
  const leftContent: any[] = []
  const rightContent: any[] = []
  
  // Solo parsear en el navegador
  if (typeof window === 'undefined') {
    return { leftContent, rightContent }
  }
  
  try {
    parseCounter = 0 // Resetear contador
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    // Buscar todas las columnas dentro de la sección
    const section = doc.querySelector('section.row')
    if (!section) return { leftContent, rightContent }
    
    const columns = Array.from(section.children).filter(child => 
      child.classList.contains('col-12') || 
      child.classList.contains('col-lg-5') || 
      child.classList.contains('col-lg-6') || 
      child.classList.contains('col-lg-7')
    )
    
    // Primera columna (izquierda)
    if (columns[0]) {
      parseColumn(columns[0], leftContent)
    }
    
    // Segunda columna (derecha)
    if (columns[1]) {
      parseColumn(columns[1], rightContent)
    }
  } catch (error) {
    console.error('Error parseando HTML:', error)
  }
  
  return { leftContent, rightContent }
}

let parseCounter = 0
const parseColumn = (column: Element, content: any[]) => {
  const children = Array.from(column.children)
  
  children.forEach((child) => {
    // Recursivamente parsear divs contenedores (incluyendo text-center para actividades)
    if (child.tagName === 'DIV' && (child.classList.contains('ms-xl-4') || child.classList.contains('my-4') || child.classList.contains('mx-xl-0') || child.classList.contains('text-center'))) {
      parseColumn(child, content)
      return
    }
    
    const id = Date.now() + (parseCounter++)
    
    // PRIMERO: Detectar actividades
    if (child.classList.contains('activity-container-img') || 
        child.classList.contains('select-container') ||
        child.classList.contains('quiz-container') ||
        child.classList.contains('ordenar-pasos-container') ||
        child.id === 'ordenar-pasos-actividad' ||
        child.querySelector('.quiz-container') ||
        child.querySelector('.select-container') ||
        child.querySelector('#ordenar-pasos-actividad') ||
        child.querySelector('.w-80') ||
        child.querySelector('#preguntas-container')) {
      
      console.log('🎯 Actividad detectada en parseColumn')
      
      if (child.classList.contains('select-container') || child.querySelector('.select-container')) {
        content.push({ id, type: 'activity', activityType: 'select-text', activityData: {} })
      } else if (child.classList.contains('quiz-container') || child.querySelector('.quiz-container')) {
        content.push({ id, type: 'activity', activityType: 'select-imagen', activityData: { items: [], opciones: [] } })
      } else if (child.classList.contains('ordenar-pasos-container') || child.id === 'ordenar-pasos-actividad' || child.querySelector('#ordenar-pasos-actividad')) {
        content.push({ id, type: 'activity', activityType: 'ordenar-pasos', activityData: { pasos: [] } })
      } else if (child.querySelector('.w-80')) {
        content.push({ id, type: 'activity', activityType: 'drag-clasificar', activityData: { items: [], categorias: [] } })
      } else if (child.querySelector('#preguntas-container')) {
        const hasVerdaderoFalso = child.innerHTML.includes('A. Verdadero')
        content.push({ id, type: 'activity', activityType: hasVerdaderoFalso ? 'verdadero-falso' : 'quiz', activityData: { preguntas: [] } })
      } else {
        content.push({ id, type: 'activity', activityData: {} })
      }
      return
    }
    
    // Detectar tipo de componente
    if (child.tagName === 'H1') {
      const fullText = child.innerHTML
      const subtitleMatch = fullText.match(/<span[^>]*class="[^"]*sf-text-purple[^"]*"[^>]*>([^<]*)<\/span>/)
      const subtitle = subtitleMatch ? subtitleMatch[1].trim() : ''
      const text = child.textContent?.replace(subtitle, '').replace(/\n/g, ' ').trim() || ''
      content.push({ id, type: 'titulo', text, subtitle })
    } else if (child.tagName === 'P' && !child.classList.contains('hipt')) {
      const highlightElem = child.querySelector('.sf-txt-800')
      const highlight = highlightElem?.textContent?.trim() || ''
      const fullText = child.textContent || ''
      const text = fullText.replace(highlight, '').trim()
      content.push({ id, type: 'texto', text, highlight })
    } else if (child.tagName === 'I' && child.classList.contains('hipt')) {
      const text = child.textContent?.replace('↳', '').replace(/\s+/g, ' ').trim() || ''
      content.push({ id, type: 'instruccion', text })
    } else if (child.tagName === 'IMG') {
      const src = child.getAttribute('src') || ''
      content.push({ id, type: 'image', src })
    } else if (child.tagName === 'BUTTON') {
      const text = child.textContent?.trim() || ''
      content.push({ id, type: 'button', text })
    } else if (child.querySelector('table')) {
      content.push({ id, type: 'table' })
    } else if (child.querySelector('.iframe-container')) {
      const videoElem = child.querySelector('[id*="Web"]')
      const videoId = videoElem?.id?.replace('Web', '') || 'Slide-Video'
      content.push({ id, type: 'video', videoId })
    } else if (child.querySelector('.table-container')) {
      content.push({ id, type: 'table' })
    }
  })
}

export function VisualEditor({ project, momentId, onHtmlChange, showComponentsPanel }: VisualEditorProps) {
  const stateKey = `${project.id}-${momentId}`
  const [lessonName, setLessonName] = useState<string>('')
  
  // Obtener estado guardado o crear nuevo
  const getInitialState = () => {
    return editorState.get(stateKey) || {
      selectedLayout: null,
      leftContent: [],
      rightContent: [],
      htmlContent: "",
      videos: [],
      images: [],
      audios: [],
      cssContent: '',
      jsContent: ''
    }
  }
  
  const [state, setState] = useState(getInitialState)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar contenido guardado al montar el componente
  useEffect(() => {
    const loadContent = async () => {
      // Cargar nombre de la lección
      try {
        const response = await fetch(`/api/course-structure?projectId=${project.id}`)
        if (response.ok) {
          const data = await response.json()
          const lessonNum = parseInt(momentId.split('_')[0].replace('momento', ''))
          const lesson = data.structure?.find((l: any) => l.name === `leccion${lessonNum}`)
          if (lesson) {
            setLessonName(lesson.displayName || `Lección ${lessonNum}`)
          }
        }
      } catch (error) {
        console.error('Error cargando nombre de lección:', error)
      }
      
      // Siempre cargar desde archivo primero
      const savedContent = await loadSavedContent(project.id, momentId)
      if (savedContent && savedContent.includes('<section')) {
        let detectedLayout = null
        
        // Detectar layout "momento"
        if (savedContent.includes('dividerImgSeccion')) {
          detectedLayout = 'momento'
        } else {
          const layoutMatch = savedContent.match(/col-12 col-lg-(\d+)/)
          detectedLayout = layoutMatch ? 
            (layoutMatch[1] === '6' ? '6-6' : 
             layoutMatch[1] === '5' ? '5-7' : 
             layoutMatch[1] === '7' ? '7-5' : '12-12') : '6-6'
        }
        
        // Parsear componentes desde el HTML guardado
        const { leftContent, rightContent } = parseComponentsFromHTML(savedContent)
        
        const newState = {
          selectedLayout: detectedLayout,
          leftContent,
          rightContent,
          htmlContent: savedContent
        }
        setState(newState)
        editorState.set(stateKey, newState)
      } else {
        const newState = {
          selectedLayout: null,
          leftContent: [],
          rightContent: [],
          htmlContent: ""
        }
        setState(newState)
        editorState.set(stateKey, newState)
      }
      setIsLoading(false)
    }
    loadContent()
  }, [project.id, momentId, stateKey])

  // Guardar estado cuando cambie
  useEffect(() => {
    editorState.set(stateKey, state)
  }, [state, stateKey])
  
  useEffect(() => {
    if (onHtmlChange && state.htmlContent) {
      onHtmlChange(state.htmlContent, state.videos, state.images, state.audios, state.cssContent, state.jsContent)
    }
  }, [state.htmlContent])

  const handleLayoutSelect = (layout: string) => {
    setState(prev => {
      const newState = { ...prev, selectedLayout: layout }
      editorState.set(stateKey, newState)
      return newState
    })
  }

  const handleContentChange = useCallback((leftContent: any[], rightContent: any[], htmlContent: string, videos?: any[], images?: any[], audios?: any[], cssContent?: string, jsContent?: string) => {
    setState(prev => ({
      ...prev,
      leftContent, 
      rightContent, 
      htmlContent,
      videos: videos || [],
      images: images || [],
      audios: audios || [],
      cssContent: cssContent || '',
      jsContent: jsContent || ''
    }))
  }, [])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Cargando momento...</p>
        </div>
      </div>
    )
  }

  if (!state.selectedLayout) {
    return <LayoutSelector 
      onSelectLayout={handleLayoutSelect} 
      momentId={momentId}
      projectId={project.id}
    />
  }



  const handleLayoutChange = (newLayout: string) => {
    setState(prev => {
      const newState = { ...prev, selectedLayout: null }
      editorState.set(stateKey, newState)
      return newState
    })
  }

  return (
    <DragDropBuilder 
      layout={state.selectedLayout}
      initialLeftContent={state.leftContent}
      initialRightContent={state.rightContent}
      onContentChange={handleContentChange}
      onLayoutChange={handleLayoutChange}
      momentId={momentId}
      lessonName={lessonName}
      projectId={project.id}
    />
  )
}