import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const { projectId, momentId, htmlContent, images, audios, cssContent, jsContent } = await request.json()
    
    if (!projectId || !momentId || !htmlContent) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 })
    }

    // Determinar la ruta según el tipo de proyecto
    let momentPath: string
    let filePath: string
    
    if (projectId.startsWith('curso-')) {
      // Es un curso guardado localmente - usar estructura del template
      const courseId = projectId.replace('curso-', '')
      // Extraer leccion del momentId (ej: momento1_1 -> leccion1)
      const lessonMatch = momentId.match(/momento(\d+)_/)
      const lessonNum = lessonMatch ? lessonMatch[1] : '1'
      momentPath = join(process.cwd(), 'cursos', courseId, 'module', `leccion${lessonNum}`, momentId)
      await mkdir(momentPath, { recursive: true })
      filePath = join(momentPath, 'index.html')
    } else {
      // Es un proyecto externo
      momentPath = join(process.cwd(), 'projects', projectId, 'module', 'leccion1', momentId)
      await mkdir(momentPath, { recursive: true })
      filePath = join(momentPath, 'index.html')
    }
    
    // Crear carpeta img solo si hay componentes de imagen
    if (images && images.length > 0) {
      const imgPath = join(momentPath, 'img')
      await mkdir(imgPath, { recursive: true })
    }
    
    // Crear carpeta audio solo si hay componentes de audio
    if (audios && audios.length > 0) {
      const audioPath = join(momentPath, 'audio')
      await mkdir(audioPath, { recursive: true })
    }
    
    await writeFile(filePath, htmlContent, 'utf8')
    
    // Limpiar y guardar CSS
    const cssPath = join(momentPath, 'slider.css')
    try {
      let existingCss = ''
      try {
        existingCss = await readFile(cssPath, 'utf8')
      } catch {
        // Archivo no existe, crear vacío
        existingCss = ''
      }
      
      // Eliminar TODO el CSS de actividad (desde el comentario hasta el final del bloque)
      let cssWithoutActivity = existingCss
      const activityCssStart = cssWithoutActivity.indexOf('/* Estilos para la actividad de selección */')
      if (activityCssStart !== -1) {
        // Encontrar el final del último bloque de actividad
        const afterStart = cssWithoutActivity.substring(activityCssStart)
        const lastBraceMatch = afterStart.match(/\.select-reset:disabled[\s\S]*?\}/)
        if (lastBraceMatch) {
          const endIndex = activityCssStart + afterStart.indexOf(lastBraceMatch[0]) + lastBraceMatch[0].length
          cssWithoutActivity = cssWithoutActivity.substring(0, activityCssStart) + cssWithoutActivity.substring(endIndex)
        }
      }
      
      // Agregar nuevo CSS si existe
      if (cssContent) {
        await writeFile(cssPath, cssWithoutActivity.trim() + '\n\n' + cssContent, 'utf8')
      } else {
        await writeFile(cssPath, cssWithoutActivity.trim() || '/* Estilos del momento */', 'utf8')
      }
    } catch (error) {
      console.error('Error guardando CSS:', error)
    }
    
    // Limpiar y guardar JS
    const jsPath = join(momentPath, 'slider.js')
    try {
      let existingJs = ''
      try {
        existingJs = await readFile(jsPath, 'utf8')
      } catch {
        existingJs = 'export function init() {\n\n}'
      }
      
      // Extraer la función init
      const initMatch = existingJs.match(/(export function init\(\)\s*\{)([\s\S]*?)(\n\}\s*$)/)
      if (!initMatch) {
        await writeFile(jsPath, 'export function init() {\n\n}', 'utf8')
        return
      }
      
      const beforeInit = initMatch[1]
      let insideInit = initMatch[2]
      const afterInit = initMatch[3]
      
      // Buscar y eliminar TODO el bloque de actividad
      // Puede empezar con "// Actividad Select" o directamente con "const correctAnswers"
      let activityStart = insideInit.indexOf('// Actividad Select')
      if (activityStart === -1) {
        // Buscar por "const correctAnswers" si no hay comentario
        activityStart = insideInit.indexOf('const correctAnswers')
      }
      
      if (activityStart !== -1) {
        // Buscar el final con updateSelectOptions();
        const afterActivity = insideInit.substring(activityStart)
        const activityEnd = afterActivity.indexOf('updateSelectOptions();')
        if (activityEnd !== -1) {
          // Eliminar todo el bloque
          insideInit = insideInit.substring(0, activityStart) + insideInit.substring(activityStart + activityEnd + 'updateSelectOptions();'.length)
        } else {
          // Si no encuentra updateSelectOptions, eliminar todo desde activityStart
          insideInit = insideInit.substring(0, activityStart)
        }
      }
      
      // Limpiar espacios y líneas vacías extras
      const cleanInside = insideInit.split('\n').filter(line => line.trim()).join('\n').trim()
      
      // Inyectar nuevo JS si existe
      if (jsContent) {
        const newJs = beforeInit + (cleanInside ? '\n  ' + cleanInside.split('\n').map(l => '  ' + l.trim()).join('\n') + '\n' : '\n') + '\n  // Actividad Select\n' + jsContent + afterInit
        await writeFile(jsPath, newJs, 'utf8')
      } else {
        // Sin actividad, solo dejar el contenido limpio
        const cleanJs = beforeInit + (cleanInside ? '\n  ' + cleanInside.split('\n').map(l => '  ' + l.trim()).join('\n') + '\n' : '\n') + afterInit
        await writeFile(jsPath, cleanJs, 'utf8')
      }
    } catch (error) {
      console.error('Error guardando JS:', error)
    }
    
    // Eliminar carpeta img si no hay imágenes
    if (!images || images.length === 0) {
      const imgPath = join(momentPath, 'img')
      if (existsSync(imgPath)) {
        try {
          await rm(imgPath, { recursive: true, force: true })
        } catch (error) {
          console.error('Error eliminando carpeta img:', error)
        }
      }
    }
    
    // Eliminar carpeta audio si no hay audios
    if (!audios || audios.length === 0) {
      const audioPath = join(momentPath, 'audio')
      if (existsSync(audioPath)) {
        try {
          await rm(audioPath, { recursive: true, force: true })
        } catch (error) {
          console.error('Error eliminando carpeta audio:', error)
        }
      }
    }
    
    return NextResponse.json({ success: true, message: 'Momento guardado exitosamente' })
  } catch (error) {
    console.error('Error al guardar momento:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}