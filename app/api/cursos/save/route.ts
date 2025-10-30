import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join, dirname } from "path"
import { generateCourse } from "@/lib/scorm-generator.tsx"
import type { CourseData } from "@/lib/scorm-generator.tsx"
import { Buffer } from "buffer"

export async function POST(request: Request) {
  try {
    const courseData: CourseData = await request.json()

    if (!courseData.name || !courseData.folderName) {
      return NextResponse.json({ error: "Datos del curso incompletos" }, { status: 400 })
    }

    // Ensure cursos directory exists
    const cursosDir = join(process.cwd(), "cursos")
    await mkdir(cursosDir, { recursive: true })
    
    const coursePath = join(cursosDir, courseData.folderName)
    await mkdir(coursePath, { recursive: true })

    const files = generateCourse(courseData)

    for (const file of files) {
      const fullPath = join(coursePath, file.path)
      const dir = dirname(fullPath)
      await mkdir(dir, { recursive: true })
      await writeFile(fullPath, file.content, "utf-8")
    }

    // Save custom video if provided
    if ((courseData as any).customVideo?.data) {
      const videoPath = join(coursePath, "assets", "video")
      await mkdir(videoPath, { recursive: true })
      
      const videoBuffer = Buffer.from((courseData as any).customVideo.data, 'base64')
      
      await writeFile(
        join(videoPath, "custom_video.mp4"),
        videoBuffer
      )
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
