import { NextResponse } from "next/server"
import { readdir, readFile, stat } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    const cursosPath = join(process.cwd(), "cursos")
    
    const folders = await readdir(cursosPath)
    
    const courses = await Promise.all(
      folders.map(async (folder) => {
        try {
          const metadataPath = join(cursosPath, folder, "course-metadata.json")
          const metadata = await readFile(metadataPath, "utf-8")
          const courseData = JSON.parse(metadata)
          
          const folderStat = await stat(join(cursosPath, folder))
          
          return {
            id: folder,
            name: courseData.name,
            description: courseData.description,
            category: courseData.category,
            lessons: courseData.lessons.length,
            createdAt: folderStat.birthtime,
            path: join(cursosPath, folder)
          }
        } catch {
          return null
        }
      })
    )

    return NextResponse.json(courses.filter(Boolean))
  } catch (error) {
    console.error("Error listando cursos:", error)
    return NextResponse.json([], { status: 200 })
  }
}
