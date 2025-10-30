import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const momentId = searchParams.get('momentId')
    
    if (!projectId || !momentId) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
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
    
    let cssContent = ''
    let jsContent = ''
    
    try {
      cssContent = await readFile(join(momentPath, 'slider.css'), 'utf8')
    } catch {
      cssContent = `/* CSS del momento ${momentId} */\n`
    }
    
    try {
      jsContent = await readFile(join(momentPath, 'slider.js'), 'utf8')
    } catch {
      jsContent = `export function init() {\n  //--codigo dentro de la funcion init---//\n  \n}`
    }
    
    return NextResponse.json({ cssContent, jsContent })
  } catch (error) {
    console.error('Error cargando archivos:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
