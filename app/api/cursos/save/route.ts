import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join, dirname } from "path"
import { type CourseData } from "@/lib/scorm-generator"
import { generateCourseFromTemplate, type TemplateFile } from "@/lib/template-generator"
import { Buffer } from "buffer"
import { copyTemplateFiles } from "@/lib/file-copier"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let courseData: CourseData
    let uploadedVideo: File | null = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const metadata = formData.get('metadata') as string | null
      if (!metadata) {
        return NextResponse.json({ error: "Falta metadata" }, { status: 400 })
      }
      courseData = JSON.parse(metadata)
      const file = formData.get('customVideo')
      uploadedVideo = (file && typeof file !== 'string') ? (file as File) : null
    } else {
      courseData = await request.json()
    }

    if (!courseData.name || !courseData.folderName) {
      return NextResponse.json({ error: "Datos del curso incompletos" }, { status: 400 })
    }

    // Ensure cursos directory exists
    const cursosDir = join(process.cwd(), "cursos")
    await mkdir(cursosDir, { recursive: true })

    const coursePath = join(cursosDir, courseData.folderName)
    await mkdir(coursePath, { recursive: true })

    const templateFiles = await copyTemplateFiles(courseData)
    for (const file of templateFiles) {
      const fullPath = join(coursePath, file.path)
      const dir = dirname(fullPath)
      await mkdir(dir, { recursive: true })
      if (file.isBuffer) {
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

    // Save custom video (multipart) or base64 (legacy JSON)
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
      await writeFile(join(saveDir, sanitizedName), buffer)
        ; (courseData as any).customVideo = { name: originalName, saved: true }
    } else if ((courseData as any).customVideo?.data) {
      await mkdir(saveDir, { recursive: true })
      const videoBuffer = Buffer.from((courseData as any).customVideo.data, 'base64')
      const originalName = (courseData as any).customVideo.name || 'custom_video.mp4'
      const sanitizedName = originalName
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9._-]/g, "")
      await writeFile(join(saveDir, sanitizedName), videoBuffer)
    }

    // Save moment images if provided
    for (let lessonIndex = 0; lessonIndex < courseData.lessons.length; lessonIndex++) {
      const lesson = courseData.lessons[lessonIndex]
      for (let momentIndex = 0; momentIndex < lesson.moments.length; momentIndex++) {
        const moment = lesson.moments[momentIndex] as any
        if (moment.image) {
          const momentFolder = `momento${lessonIndex + 1}_${momentIndex + 1}`
          const imgPath = join(coursePath, "module", `leccion${lessonIndex + 1}`, momentFolder, "img")
          await mkdir(imgPath, { recursive: true })

          const imageData = moment.image.data
          const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData
          const imgBuffer = Buffer.from(base64Data, 'base64')
          const extension = moment.image.name.split('.').pop() || 'webp'

          await writeFile(
            join(imgPath, `img.${extension}`),
            imgBuffer
          )
        }
      }
    }

    // Save metadata without binary data (too large)
    const metadataToSave = { ...courseData }
    if ((metadataToSave as any).customVideo) {
      (metadataToSave as any).customVideo = {
        name: (courseData as any).customVideo.name,
        saved: true
      }
    }

    // Remove image data from metadata
    metadataToSave.lessons = metadataToSave.lessons.map(lesson => ({
      ...lesson,
      moments: lesson.moments.map((moment: any) => {
        if (moment.image) {
          return {
            ...moment,
            image: {
              name: moment.image.name,
              saved: true
            }
          }
        }
        return moment
      })
    }))

    await writeFile(
      join(coursePath, "course-metadata.json"),
      JSON.stringify(metadataToSave, null, 2),
      "utf-8"
    )

    return NextResponse.json({
      success: true,
      message: "Curso guardado exitosamente",
      courseId: courseData.folderName
    })
  } catch (error) {
    console.error("Error guardando curso:", error)
    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json({
      error: "Error al guardar el curso",
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    }, { status: 500 })
  }
}
