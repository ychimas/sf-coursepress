import { NextRequest, NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()
    
    if (!projectId) {
      return NextResponse.json({ error: 'ProjectId requerido' }, { status: 400 })
    }

    const projectPath = join(process.cwd(), 'projects', projectId)
    
    // Contar carpetas de lecciones directamente
    let lessonsCount = 0
    try {
      const moduleDir = join(projectPath, 'module')
      const moduleContents = await readdir(moduleDir)
      lessonsCount = moduleContents.filter(item => item.startsWith('leccion')).length
    } catch (error) {
      console.log('No se pudo contar lecciones')
    }

    return NextResponse.json({ success: true, lessonsCount })
  } catch (error) {
    console.error('Error al actualizar proyecto:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
