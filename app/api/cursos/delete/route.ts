import { NextResponse } from "next/server"
import { rm } from "fs/promises"
import { join } from "path"

export async function DELETE(request: Request) {
  try {
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: "ID de curso requerido" }, { status: 400 })
    }

    const coursePath = join(process.cwd(), "cursos", courseId)
    await rm(coursePath, { recursive: true, force: true })

    return NextResponse.json({ success: true, message: "Curso eliminado" })
  } catch (error) {
    console.error("Error eliminando curso:", error)
    return NextResponse.json({ error: "Error al eliminar el curso" }, { status: 500 })
  }
}
