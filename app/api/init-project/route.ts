import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, cp } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()
    
    if (!projectId) {
      return NextResponse.json({ error: 'ProjectId requerido' }, { status: 400 })
    }

    const projectPath = join(process.cwd(), 'projects', projectId)
    const templatePath = join(process.cwd(), 'templates', 'base')
    
    // Crear directorio del proyecto
    await mkdir(projectPath, { recursive: true })
    
    // Copiar toda la estructura base del template
    await cp(templatePath, projectPath, { recursive: true })
    
    // La estructura de lecciones y momentos ya está copiada del template base
    // No necesitamos crear estructura adicional aquí
    
    return NextResponse.json({ success: true, message: 'Proyecto inicializado correctamente' })
  } catch (error) {
    console.error('Error al inicializar proyecto:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}