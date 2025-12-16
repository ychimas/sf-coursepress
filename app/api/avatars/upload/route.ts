import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const projectId = formData.get('projectId') as string | null
    if (!file || !projectId) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    const courseId = projectId.startsWith('curso-') ? projectId.replace('curso-', '') : projectId
    const avatarsDir = join(process.cwd(), 'cursos', courseId, 'assets', 'img', 'avatars')
    await mkdir(avatarsDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const sanitized = (file.name || 'imagen.webp')
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9._-]/g, '')

    await writeFile(join(avatarsDir, sanitized), buffer)
    return NextResponse.json({ success: true, name: sanitized })
  } catch (error) {
    console.error('Error subiendo avatar:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
