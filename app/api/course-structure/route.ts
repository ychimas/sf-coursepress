import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile, access } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    
    if (!projectId) {
      return NextResponse.json({ error: 'ProjectId requerido' }, { status: 400 })
    }

    let structure = []
    
    try {
      if (projectId.startsWith('curso-')) {
        // Es un curso guardado localmente - SIEMPRE leer desde metadata
        const courseId = projectId.replace('curso-', '')
        const coursePath = join(process.cwd(), 'cursos', courseId)
        
        try {
          const metadataPath = join(coursePath, 'course-metadata.json')
          await access(metadataPath)
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
          // Si no existe metadata, crear estructura por defecto
          structure = [{
            id: 'leccion1',
            name: 'leccion1',
            displayName: 'Lección 1',
            moments: [
              { id: 'momento1_1', name: 'Momento 1', type: 'slider' },
              { id: 'momento1_2', name: 'Momento 2', type: 'slider' }
            ]
          }]
        }
      } else {
        // Es un proyecto externo
        const projectPath = join(process.cwd(), 'projects', projectId)
        const modulePath = join(projectPath, 'module')
        
        try {
          await access(modulePath)
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
        } catch (error) {
          // Si no existe el directorio, crear estructura por defecto
          structure = [{
            id: 'leccion1',
            name: 'leccion1',
            displayName: 'Lección 1',
            moments: [
              { id: 'momento1_1', name: 'Momento 1', type: 'slider' },
              { id: 'momento1_2', name: 'Momento 2', type: 'slider' }
            ]
          }]
        }
      }
    } catch (error) {
      // En caso de cualquier error, devolver estructura por defecto
      structure = [{
        id: 'leccion1',
        name: 'leccion1',
        displayName: 'Lección 1',
        moments: [
          { id: 'momento1_1', name: 'Momento 1', type: 'slider' },
          { id: 'momento1_2', name: 'Momento 2', type: 'slider' }
        ]
      }]
    }

    return NextResponse.json({ success: true, structure })
  } catch (error) {
    console.error('Error al obtener estructura:', error)
    // Siempre devolver una estructura por defecto
    return NextResponse.json({ 
      success: true, 
      structure: [{
        id: 'leccion1',
        name: 'leccion1',
        displayName: 'Lección 1',
        moments: [
          { id: 'momento1_1', name: 'Momento 1', type: 'slider' },
          { id: 'momento1_2', name: 'Momento 2', type: 'slider' }
        ]
      }]
    })
  }
}