import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { join } from 'path'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { projectId, name } = await request.json()
    if (!projectId || !name) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }
    const courseId = projectId.startsWith('curso-') ? projectId.replace('curso-', '') : projectId
    const sanitized = (name as string)
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9._-]/g, '')
    const filePath = join(process.cwd(), 'cursos', courseId, 'assets', 'img', 'avatars', sanitized)
    await unlink(filePath)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error eliminando avatar:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
