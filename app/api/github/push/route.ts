import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  const { courseId, repository, branch } = await request.json()
  
  const cookieStore = await cookies()
  const token = cookieStore.get('github_token')?.value
  const username = cookieStore.get('github_user')?.value

  if (!token || !username) {
    return NextResponse.json({ success: false, error: 'No autenticado' })
  }

  try {
    const coursePath = path.join(process.cwd(), 'cursos', courseId)
    
    if (!fs.existsSync(coursePath)) {
      return NextResponse.json({ success: false, error: 'Curso no encontrado' })
    }

    // Leer metadata del curso para obtener el nombre
    const metadataPath = path.join(coursePath, 'course-metadata.json')
    let courseName = courseId
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
      courseName = metadata.name || courseId
    }

    // Crear nombre del repositorio basado en el curso
    const repoName = courseName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Remover guiones múltiples
      .trim()

    // Crear el repositorio si no existe
    const createRepoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName,
        description: `Curso SCORM: ${courseName}`,
        private: false,
        auto_init: true
      }),
    })

    let repoExists = true
    if (!createRepoResponse.ok) {
      const errorData = await createRepoResponse.json()
      if (errorData.message?.includes('already exists')) {
        console.log('Repository already exists, continuing...')
      } else {
        console.error('Error creating repository:', errorData)
        repoExists = false
      }
    }

    if (repoExists) {
      // Subir archivos al repositorio específico del curso
      const files = getAllFiles(coursePath)
      
      for (const file of files) {
        const content = fs.readFileSync(file, 'base64')
        const relativePath = path.relative(coursePath, file).replace(/\\/g, '/')
        
        const uploadResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${relativePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Add ${relativePath}`,
            content,
            branch: 'main',
          }),
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          if (errorData.message?.includes('already exists')) {
            // Si el archivo ya existe, actualizarlo
            const existingFile = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${relativePath}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
            
            if (existingFile.ok) {
              const existingData = await existingFile.json()
              await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${relativePath}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  message: `Update ${relativePath}`,
                  content,
                  sha: existingData.sha,
                  branch: 'main',
                }),
              })
            }
          }
        }
      }

      // Actualizar las cookies con el nuevo repositorio
      cookieStore.set('github_repo', `${username}/${repoName}`, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      })

      return NextResponse.json({ 
        success: true, 
        repository: `${username}/${repoName}`,
        url: `https://github.com/${username}/${repoName}`
      })
    } else {
      return NextResponse.json({ success: false, error: 'No se pudo crear el repositorio' })
    }
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
