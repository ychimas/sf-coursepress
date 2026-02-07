import { NextResponse } from "next/server"
import { writeFile, mkdir, rm } from "fs/promises"
import { join } from "path"
import { generateCourse } from "@/lib/scorm-generator"
import type { CourseData } from "@/lib/scorm-generator"

export async function PUT(request: Request) {
  try {
    const { courseId, courseData } = await request.json() as { courseId: string, courseData: CourseData }

    if (!courseId || !courseData) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const coursePath = join(process.cwd(), "cursos", courseId)
    
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

    return NextResponse.json({ success: true, message: "Curso actualizado" })
  } catch (error) {
    console.error("Error actualizando curso:", error)
    return NextResponse.json({ error: "Error al actualizar el curso" }, { status: 500 })
  }
}
