import { NextResponse } from "next/server"
import { rm } from "fs/promises"
import { join } from "path"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: Request) {
  try {
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: "ID de curso requerido" }, { status: 400 })
    }

    // 1. Delete from DB
    try {
        // Try deleting by folderName first (legacy ID format)
        await prisma.course.delete({
            where: { folderName: courseId }
        })
    } catch (dbError) {
        // If failed, try deleting by UUID (new ID format)
        try {
            await prisma.course.delete({
                where: { id: courseId }
            })
        } catch (secondDbError) {
             console.warn("Could not delete from DB (might not exist or connection failed):", secondDbError)
             // If both fail, it might be a local-only file course, so we proceed to file deletion
        }
    }

    // 2. Delete files (Local dev only)
    try {
        const coursePath = join(process.cwd(), "cursos", courseId)
        await rm(coursePath, { recursive: true, force: true })
    } catch (fsError) {
        // Expected to fail on Vercel
        console.warn("Could not delete files (expected on Vercel):", fsError)
    }

    return NextResponse.json({ success: true, message: "Curso eliminado" })
  } catch (error) {
    console.error("Error eliminando curso:", error)
    return NextResponse.json({ error: "Error al eliminar el curso" }, { status: 500 })
  }
}
