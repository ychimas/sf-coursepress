import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  try {
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: "ID de curso requerido" }, { status: 400 })
    }

    const metadataPath = join(process.cwd(), "cursos", courseId, "course-metadata.json")
    const metadata = await readFile(metadataPath, "utf-8")
    const courseData = JSON.parse(metadata)

    return NextResponse.json(courseData)
  } catch (error) {
    console.error("Error obteniendo curso:", error)
    return NextResponse.json({ error: "Error al obtener el curso" }, { status: 500 })
  }
}
