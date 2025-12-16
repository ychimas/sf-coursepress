import { NextRequest, NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()
    if (!projectId) {
      return NextResponse.json({ error: 'Falta projectId' }, { status: 400 })
    }
    const courseId = projectId.startsWith('curso-') ? projectId.replace('curso-', '') : projectId
    const courseAvatarsDir = join(process.cwd(), 'cursos', courseId, 'assets', 'img', 'avatars')
    const templateAvatarsDir = join(process.cwd(), 'templates', 'base', 'assets', 'img', 'avatars')

    const readDirSafe = async (dir: string) => {
      try { return await readdir(dir) } catch { return [] }
    }
    const courseFiles = await readDirSafe(courseAvatarsDir)
    const templateFiles = await readDirSafe(templateAvatarsDir)

    const allNamesSet = new Set<string>([...courseFiles, ...templateFiles])
    const images: Array<{ name: string }> = []
    for (const name of Array.from(allNamesSet)) {
      const lower = name.toLowerCase()
      const ext = lower.split('.').pop() || ''
      if (!['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) continue
      images.push({ name })
    }
    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error listando avatars:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
