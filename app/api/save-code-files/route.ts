import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { projectId, momentId, htmlContent, cssContent, jsContent } = await request.json()
    
    if (!projectId || !momentId) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 })
    }

    let momentPath: string
    
    if (projectId.startsWith('curso-')) {
      const courseId = projectId.replace('curso-', '')
      const lessonMatch = momentId.match(/momento(\d+)_/)
      const lessonNum = lessonMatch ? lessonMatch[1] : '1'
      momentPath = join(process.cwd(), 'cursos', courseId, 'module', `leccion${lessonNum}`, momentId)
    } else {
      momentPath = join(process.cwd(), 'projects', projectId, 'module', 'leccion1', momentId)
    }
    
    await mkdir(momentPath, { recursive: true })
    
    // Guardar HTML
    if (htmlContent !== undefined) {
      await writeFile(join(momentPath, 'index.html'), htmlContent, 'utf8')
    }
    
    // Guardar CSS
    if (cssContent !== undefined) {
      await writeFile(join(momentPath, 'slider.css'), cssContent, 'utf8')
    }
    
    // Guardar JS
    if (jsContent !== undefined) {
      await writeFile(join(momentPath, 'slider.js'), jsContent, 'utf8')
    }
    
    return NextResponse.json({ success: true, message: 'Archivos guardados exitosamente' })
  } catch (error) {
    console.error('Error al guardar archivos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
