import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  const { courseId, repository, branch } = await request.json()
  
  const cookieStore = await cookies()
  const token = cookieStore.get('github_token')?.value

  if (!token) {
    return NextResponse.json({ success: false, error: 'No autenticado' })
  }

  try {
    const coursePath = path.join(process.cwd(), 'cursos', courseId)
    
    if (!fs.existsSync(coursePath)) {
      return NextResponse.json({ success: false, error: 'Curso no encontrado' })
    }

    const [owner, repo] = repository.split('/')

    const files = getAllFiles(coursePath)
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'base64')
      const relativePath = path.relative(coursePath, file).replace(/\\/g, '/')
      
      await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update ${relativePath}`,
          content,
          branch,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Push error:', error)
    return NextResponse.json({ success: false, error: 'Error al hacer push' })
  }
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}
