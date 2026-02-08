import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    })

    const formattedCourses = courses.map(course => {
      const lessons = course.lessons as any[]
      return {
        id: course.folderName, // Use folderName as ID for frontend compatibility
        name: course.name,
        description: course.description,
        category: course.category,
        lessons: Array.isArray(lessons) ? lessons.length : 0,
        createdAt: course.createdAt,
        path: `/cursos/${course.folderName}` // Logical path, though files might not exist on Vercel
      }
    })

    return NextResponse.json(formattedCourses)
  } catch (error) {
    console.error("Error listando cursos (DB):", error)
    return NextResponse.json([], { status: 200 })
  }
}
