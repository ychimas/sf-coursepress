import { NextRequest, NextResponse } from 'next/server'
import { cp, mkdir, access } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { projectId, sourcePath } = await request.json()
    
    if (!projectId || !sourcePath) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 })
    }

    const projectPath = join(process.cwd(), 'projects', projectId)
    
    // Crear directorio del proyecto
    await mkdir(projectPath, { recursive: true })
    
    // Verificar que la ruta fuente existe
    try {
      await access(sourcePath)
    } catch {
      return NextResponse.json({ error: 'La ruta especificada no existe' }, { status: 400 })
    }
    
    // Copiar desde la ruta fuente
    await cp(sourcePath, projectPath, { recursive: true, force: true })
    
    return NextResponse.json({ success: true, message: 'Proyecto cargado correctamente' })
  } catch (error) {
    console.error('Error al cargar proyecto:', error)
    return NextResponse.json({ error: 'Error al cargar el proyecto: ' + error }, { status: 500 })
  }
}
