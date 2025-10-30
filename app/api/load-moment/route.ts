import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const momentId = searchParams.get('momentId')
    
    if (!projectId || !momentId) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 })
    }

    // Determinar la ruta base según el tipo de proyecto
    let filePath: string
    
    if (projectId.startsWith('curso-')) {
      // Es un curso guardado localmente - usar estructura del template
      const courseId = projectId.replace('curso-', '')
      // Extraer leccion del momentId (ej: momento1_1 -> leccion1)
      const lessonMatch = momentId.match(/momento(\d+)_/)
      const lessonNum = lessonMatch ? lessonMatch[1] : '1'
      filePath = join(process.cwd(), 'cursos', courseId, 'module', `leccion${lessonNum}`, momentId, 'index.html')
    } else {
      // Es un proyecto externo
      filePath = join(process.cwd(), 'projects', projectId, 'module', 'leccion1', momentId, 'index.html')
    }
    
    try {
      const htmlContent = await readFile(filePath, 'utf8')
      return NextResponse.json({ success: true, htmlContent })
    } catch (fileError) {
      return NextResponse.json({ success: true, htmlContent: null })
    }
  } catch (error) {
    console.error('Error al cargar momento:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}