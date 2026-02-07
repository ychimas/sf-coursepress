import { NextResponse } from "next/server"
import { readFile, readdir, stat } from "fs/promises"
import { join } from "path"
import JSZip from "jszip"
import { copyTemplateFiles } from "@/lib/file-copier"
import { generateCourseFromTemplate } from "@/lib/template-generator"

async function walkDirectory(dir: string, baseDir: string, zip: JSZip, basePath: string = '') {
  try {
    const items = await readdir(dir, { withFileTypes: true })
    
    for (const item of items) {
      const fullPath = join(dir, item.name)
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name
      
      if (item.isDirectory()) {
        await walkDirectory(fullPath, baseDir, zip, relativePath)
      } else {
        const content = await readFile(fullPath)
        zip.file(relativePath, content)
      }
    }
  } catch (error) {
    // Directorio no existe, continuar
  }
}

export async function POST(request: Request) {
  try {
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: "ID de curso requerido" }, { status: 400 })
    }

    const coursePath = join(process.cwd(), "cursos", courseId)
    const metadataPath = join(coursePath, "course-metadata.json")
    const metadata = await readFile(metadataPath, "utf-8")
    const courseData = JSON.parse(metadata)

    const zip = new JSZip()
    
    // Copiar archivos del template en paralelo
    const [templateFiles, dynamicFiles] = await Promise.all([
      copyTemplateFiles(courseData),
      Promise.resolve(generateCourseFromTemplate(courseData))
    ])
    
    templateFiles.forEach(file => {
      if (file.path === 'plugins/js/config/curso-config.js') return
      
      if (file.isBuffer) {
        zip.file(file.path, file.content as Buffer)
      } else {
        zip.file(file.path, file.content as string)
      }
    })
    
    dynamicFiles.forEach(file => {
      zip.file(file.path, file.content)
    })
    
    // Copiar archivos editados desde cursos/[id]/module/
    const modulePath = join(coursePath, "module")
    try {
      await walkDirectory(modulePath, coursePath, zip, 'module')
    } catch (error) {
      console.log('No hay archivos editados en module')
    }
    
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    })
    const buffer = Buffer.from(await zipBlob.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${courseId}.zip"`,
      },
    })
  } catch (error) {
    console.error("Error descargando curso:", error)
    return NextResponse.json({ error: "Error al descargar el curso" }, { status: 500 })
  }
}
