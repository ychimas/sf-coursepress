import { NextResponse } from "next/server"
import { writeFile, mkdir, rm } from "fs/promises"
import { join } from "path"
import { generateCourse } from "@/lib/scorm-generator"
import type { CourseData } from "@/lib/scorm-generator"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request) {
  try {
    const { courseId, courseData } = await request.json() as { courseId: string, courseData: CourseData }

    if (!courseId || !courseData) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // 1. Update DB
    await prisma.course.update({
      where: { folderName: courseId },
      data: {
        name: courseData.name,
        description: courseData.description,
        category: courseData.category,
        lessons: courseData.lessons as any
      }
    })

    // 2. Update files (Try/Catch for Vercel)
    try {
      const coursePath = join(process.cwd(), "cursos", courseId)
      
      // We don't want to nuclear delete the folder on Vercel if we can't recreate it
      // But locally we do to ensure clean state.
      // We can try to recreate.
      
      await rm(coursePath, { recursive: true, force: true })
      await mkdir(coursePath, { recursive: true })

      const files = generateCourse(courseData)

      for (const file of files) {
        const fullPath = join(coursePath, file.path)
        const dir = fullPath.substring(0, fullPath.lastIndexOf("\\") || fullPath.lastIndexOf("/"))
        await mkdir(dir, { recursive: true })
        await writeFile(fullPath, file.content, "utf-8")
      }

      await writeFile(
        join(coursePath, "course-metadata.json"),
        JSON.stringify(courseData, null, 2),
        "utf-8"
      )
    } catch (fsError) {
       console.warn("File update skipped (expected on Vercel):", fsError)
    }

    return NextResponse.json({ success: true, message: "Curso actualizado (DB)" })
  } catch (error) {
    console.error("Error actualizando curso:", error)
    return NextResponse.json({ error: "Error al actualizar el curso" }, { status: 500 })
  }
}
