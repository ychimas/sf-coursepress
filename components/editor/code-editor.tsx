"use client"

import { useState, useEffect } from "react"
import { LocalProject } from "@/lib/project-manager"

interface CodeEditorProps {
  project: LocalProject
  momentId: string
  initialHtml?: string
}

export function CodeEditor({ project, momentId, initialHtml }: CodeEditorProps) {
  const [htmlCode, setHtmlCode] = useState("")
  const [cssCode, setCssCode] = useState("")
  const [jsCode, setJsCode] = useState("")
  const [activeFile, setActiveFile] = useState("html")
  const [isLoading, setIsLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const [initialState, setInitialState] = useState({ html: '', css: '', js: '' })

  useEffect(() => {
    const loadSavedContent = async () => {
      setIsLoading(true)
      try {
        // Cargar HTML
        const htmlResponse = await fetch(`/api/load-moment?projectId=${project.id}&momentId=${momentId}`)
        if (htmlResponse.ok) {
          const data = await htmlResponse.json()
          if (data.htmlContent && data.htmlContent.includes('<section')) {
            setHtmlCode(data.htmlContent)
          } else if (initialHtml && initialHtml.includes('<section')) {
            setHtmlCode(initialHtml)
          } else {
            setHtmlCode(`<!-- Momento ${momentId} - Selecciona un layout en Visual para generar código -->`)
          }
        } else {
          setHtmlCode(`<!-- Momento ${momentId} - Selecciona un layout en Visual para generar código -->`)
        }
        
        // Cargar CSS y JS
        const filesResponse = await fetch(`/api/load-moment-files?projectId=${project.id}&momentId=${momentId}`)
        if (filesResponse.ok) {
          const filesData = await filesResponse.json()
          setCssCode(filesData.cssContent || `/* CSS del momento ${momentId} */\n`)
          setJsCode(filesData.jsContent || `export function init() {\n  //--codigo dentro de la funcion init---//\n  \n}`)
        } else {
          setCssCode(`/* CSS del momento ${momentId} */\n`)
          setJsCode(`export function init() {\n  //--codigo dentro de la funcion init---//\n  \n}`)
        }
      } catch (error) {
        console.error('Error cargando contenido:', error)
        setHtmlCode(`<!-- Error cargando contenido -->`)
        setCssCode(`/* CSS del momento ${momentId} */\n`)
        setJsCode(`export function init() {\n  //--codigo dentro de la funcion init---//\n  \n}`)
      }
      
      // Guardar estado inicial para detectar cambios
      setInitialState({
        html: htmlCode,
        css: cssCode,
        js: jsCode
      })
      setIsLoading(false)
    }
    loadSavedContent()
  }, [momentId, project.id, initialHtml])
  
  // Detectar cambios
  const checkForChanges = () => {
    const changed = htmlCode !== initialState.html || cssCode !== initialState.css || jsCode !== initialState.js
    setHasChanges(changed)
  }
  
  const handleSave = async () => {
    try {
      const response = await fetch('/api/save-code-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          momentId,
          htmlContent: htmlCode,
          cssContent: cssCode,
          jsContent: jsCode
        })
      })
      
      if (response.ok) {
        setInitialState({ html: htmlCode, css: cssCode, js: jsCode })
        setHasChanges(false)
        alert('Archivos guardados correctamente')
      } else {
        alert('Error al guardar archivos')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar archivos')
    }
  }

  const getFileContent = () => {
    switch (activeFile) {
      case 'html': return htmlCode
      case 'css': return cssCode
      case 'js': return jsCode
      default: return ''
    }
  }

  const setFileContent = (content: string) => {
    switch (activeFile) {
      case 'html': setHtmlCode(content); break
      case 'css': setCssCode(content); break
      case 'js': setJsCode(content); break
    }
    setTimeout(checkForChanges, 0)
  }

  return (
    <div className="h-full flex flex-col">
      {/* File Tabs */}
      <div className="flex items-center justify-between border-b border-border bg-card/30">
        <div className="flex">
        <button
          className={`px-4 py-2 text-sm font-medium border-r border-border ${
            activeFile === 'html' ? 'bg-background' : 'hover:bg-muted/50'
          }`}
          onClick={() => setActiveFile('html')}
        >
          index.html
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-r border-border ${
            activeFile === 'css' ? 'bg-background' : 'hover:bg-muted/50'
          }`}
          onClick={() => setActiveFile('css')}
        >
          slider.css
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeFile === 'js' ? 'bg-background' : 'hover:bg-muted/50'
          }`}
          onClick={() => setActiveFile('js')}
        >
          slider.js
        </button>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`mr-2 px-4 py-2 text-sm font-medium rounded ${
            hasChanges ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {hasChanges ? 'Guardar Cambios' : 'Sin cambios'}
        </button>
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Cargando código...</p>
            </div>
          </div>
        ) : (
          <textarea
            value={getFileContent()}
            onChange={(e) => setFileContent(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-background border-0 resize-none focus:outline-none"
            spellCheck={false}
          />
        )}
      </div>
    </div>
  )
}