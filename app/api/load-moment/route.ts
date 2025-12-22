import { NextRequest, NextResponse } from 'next/server'
import { readFile, access } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const momentId = searchParams.get('momentId')
    
    if (!projectId || !momentId) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 })
    }

    // Siempre devolver null si no existe el archivo, sin error
    try {
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
      
      // Verificar si el archivo existe
      await access(filePath)
      const htmlContent = await readFile(filePath, 'utf8')
      return NextResponse.json({ success: true, htmlContent })
    } catch (fileError) {
      // Archivo no existe o no se puede leer - devolver null sin error
      return NextResponse.json({ success: true, htmlContent: null })
    }
  } catch (error) {
    console.error('Error al cargar momento:', error)
    return NextResponse.json({ success: true, htmlContent: null })
  }
}