import { NextResponse } from "next/server"
import { generateCourseZip } from "@/lib/zip-generator"
import type { CourseData } from "@/lib/scorm-generator"

export async function POST(request: Request) {
  try {
    const courseData: CourseData = await request.json()

    // Validate course data
    if (!courseData.name || !courseData.folderName) {
      return NextResponse.json({ error: "Datos del curso incompletos" }, { status: 400 })
    }

    // Generate course ZIP
    const zipBlob = await generateCourseZip(courseData)
    const buffer = Buffer.from(await zipBlob.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${courseData.folderName}.zip"`,
      },
    })
  } catch (error) {
    console.error("Error generating course:", error)
    return NextResponse.json({ error: "Error al generar el curso" }, { status: 500 })
  }
}
