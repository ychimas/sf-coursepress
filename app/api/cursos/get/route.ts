import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: "ID de curso requerido" }, { status: 400 })
    }

    const course = await prisma.course.findUnique({
      where: { folderName: courseId }
    })

    if (!course) {
       return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 })
    }

    // Reconstruct the CourseData structure expected by the frontend
    const courseData = {
      name: course.name,
      folderName: course.folderName,
      description: course.description,
      category: course.category,
      lessons: course.lessons
    }

    return NextResponse.json(courseData)
  } catch (error) {
    console.error("Error obteniendo curso (DB):", error)
    return NextResponse.json({ error: "Error al obtener el curso" }, { status: 500 })
  }
}
