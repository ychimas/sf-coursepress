import { NextResponse } from "next/server"
import { writeFile, mkdir, rm, readdir, unlink } from "fs/promises"
import { join, dirname } from "path"
import type { CourseData } from "@/lib/scorm-generator"
import { generateCourseFromTemplate, type TemplateFile } from "@/lib/template-generator"
import { copyTemplateFiles } from "@/lib/file-copier"
import { Buffer } from "buffer"

export async function PUT(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let courseId: string
    let courseData: CourseData
    let uploadedVideo: File | null = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const id = formData.get('courseId') as string | null
      const metadata = formData.get('metadata') as string | null
      if (!id || !metadata) {
        return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
      }
      courseId = id
      courseData = JSON.parse(metadata)
      const file = formData.get('customVideo')
      uploadedVideo = (file && typeof file !== 'string') ? (file as File) : null
    } else {
      const body = await request.json() as { courseId: string, courseData: CourseData }
      courseId = body.courseId
      courseData = body.courseData
    }

    if (!courseId || !courseData) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const coursePath = join(process.cwd(), "cursos", courseId)
    await rm(coursePath, { recursive: true, force: true })
    await mkdir(coursePath, { recursive: true })

    const templateFiles = await copyTemplateFiles(courseData)
    for (const file of templateFiles) {
      const fullPath = join(coursePath, file.path)
      const dir = dirname(fullPath)
      await mkdir(dir, { recursive: true })
      if ((file as any).isBuffer) {
        await writeFile(fullPath, file.content as Buffer)
      } else {
        await writeFile(fullPath, file.content as string, "utf-8")
      }
    }

    const files: TemplateFile[] = generateCourseFromTemplate(courseData)
    for (const file of files) {
      const fullPath = join(coursePath, file.path)
      const dir = dirname(fullPath)
      await mkdir(dir, { recursive: true })
      if (file.type === "copy") {
        const content = file.content as string
        const base64Data = content.includes(',') ? content.split(',')[1] : content
        const buffer = Buffer.from(base64Data, 'base64')
        await writeFile(fullPath, buffer)
      } else {
        await writeFile(fullPath, file.content as string, "utf-8")
      }
    }

    const saveDir = join(coursePath, "assets", "video")
    if (uploadedVideo) {
      await mkdir(saveDir, { recursive: true })
      const arrayBuffer = await uploadedVideo.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const originalName = uploadedVideo.name || 'custom_video.mp4'
      const sanitizedName = originalName
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9._-]/g, "")
      try {
        const existing = await readdir(saveDir)
        for (const name of existing) {
          const lower = name.toLowerCase()
          const isVideo = lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg')
          if (isVideo && lower !== sanitizedName && lower !== 'background_index.mp4') {
            await unlink(join(saveDir, name))
          }
        }
      } catch {}
      await writeFile(join(saveDir, sanitizedName), buffer)
      ;(courseData as any).customVideo = { name: originalName, saved: true }
    }

    await writeFile(join(coursePath, "course-metadata.json"), JSON.stringify(courseData, null, 2), "utf-8")

    return NextResponse.json({ success: true, message: "Curso actualizado" })
  } catch (error) {
    console.error("Error actualizando curso:", error)
    return NextResponse.json({ error: "Error al actualizar el curso" }, { status: 500 })
  }
}
