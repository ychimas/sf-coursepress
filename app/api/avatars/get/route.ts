import { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const projectId = searchParams.get('projectId')
        const name = searchParams.get('name')
        if (!projectId || !name) {
            return new Response('Bad Request', { status: 400 })
        }
        const courseId = projectId.startsWith('curso-') ? projectId.replace('curso-', '') : projectId
        const coursePath = join(process.cwd(), 'cursos', courseId, 'assets', 'img', 'avatars', name)
        const templatePath = join(process.cwd(), 'templates', 'base', 'assets', 'img', 'avatars', name)
        let buf: Buffer | null = null
        try { buf = await readFile(coursePath) } catch { }
        if (!buf) {
            try { buf = await readFile(templatePath) } catch { }
        }
        if (!buf) return new Response('Not Found', { status: 404 })
        const ext = name.toLowerCase().split('.').pop() || 'webp'
        const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`
        return new Response(new Uint8Array(buf), { status: 200, headers: { 'Content-Type': mime } })
    } catch {
        return new Response('Internal Server Error', { status: 500 })
    }
}

