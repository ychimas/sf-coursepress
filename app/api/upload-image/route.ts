import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string
    const momentId = formData.get('momentId') as string
    
    if (!file || !projectId || !momentId) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let imgPath: string
    
    if (projectId.startsWith('curso-')) {
      const courseId = projectId.replace('curso-', '')
      const lessonMatch = momentId.match(/momento(\d+)_/)
      const lessonNum = lessonMatch ? lessonMatch[1] : '1'
      imgPath = join(process.cwd(), 'cursos', courseId, 'module', `leccion${lessonNum}`, momentId, 'img')
    } else {
      imgPath = join(process.cwd(), 'projects', projectId, 'module', 'leccion1', momentId, 'img')
    }
    
    await mkdir(imgPath, { recursive: true })
    
    const filePath = join(imgPath, file.name)
    await writeFile(filePath, buffer)
    
    return NextResponse.json({ success: true, filename: file.name })
  } catch (error) {
    console.error('Error al subir imagen:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
