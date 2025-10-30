import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    
    if (!projectId) {
      return NextResponse.json({ error: 'ProjectId requerido' }, { status: 400 })
    }

    let structure = []
    
    if (projectId.startsWith('curso-')) {
      // Es un curso guardado localmente - SIEMPRE leer desde metadata
      const courseId = projectId.replace('curso-', '')
      const coursePath = join(process.cwd(), 'cursos', courseId)
      
      try {
        const metadataPath = join(coursePath, 'course-metadata.json')
        const metadata = await readFile(metadataPath, 'utf-8')
        const courseData = JSON.parse(metadata)
        
        structure = courseData.lessons.map((lesson: any, lessonIndex: number) => ({
          id: `leccion${lessonIndex + 1}`,
          name: `leccion${lessonIndex + 1}`,
          displayName: lesson.name || `Lección ${lessonIndex + 1}`,
          moments: lesson.moments.map((moment: any, momentIndex: number) => ({
            id: `momento${lessonIndex + 1}_${momentIndex + 1}`,
            name: moment.name || `Momento ${momentIndex + 1}`,
            type: moment.type
          }))
        }))
      } catch (error) {
        console.error('Error leyendo estructura del curso:', error)
      }
    } else {
      // Es un proyecto externo
      const projectPath = join(process.cwd(), 'projects', projectId)
      const modulePath = join(projectPath, 'module')
      
      const lessons = await readdir(modulePath)
      
      for (const lessonDir of lessons.filter(dir => dir.startsWith('leccion'))) {
        const lessonPath = join(modulePath, lessonDir)
        const items = await readdir(lessonPath, { withFileTypes: true })
        
        const lessonNumber = lessonDir.replace('leccion', '')
        const validMoments = items.filter(item => item.isDirectory() && item.name.startsWith('momento'))
        
        if (validMoments.length > 0) {
          structure.push({
            id: lessonDir,
            name: lessonDir,
            displayName: `Lección ${lessonNumber}`,
            moments: validMoments.map(momentDir => ({
              id: momentDir.name,
              name: momentDir.name,
              type: 'slider'
            }))
          })
        }
      }
    }

    return NextResponse.json({ success: true, structure })
  } catch (error) {
    console.error('Error al obtener estructura:', error)
    return NextResponse.json({ success: true, structure: [] })
  }
}
