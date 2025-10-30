// File copier for template base
import { promises as fs } from 'fs'
import * as path from 'path'
import type { CourseData } from './scorm-generator'

export interface CopiedFile {
  path: string
  content: string | Buffer
  isBuffer: boolean
}

export async function copyTemplateFiles(courseData?: CourseData): Promise<CopiedFile[]> {
  const files: CopiedFile[] = []
  const templatePath = path.join(process.cwd(), 'templates', 'base')
  
  // Determine which lessons and moments to copy based on courseData
  const lessonsToInclude = courseData ? 
    courseData.lessons.map((_, index) => `leccion${index + 1}`) : 
    ['leccion1', 'leccion2', 'leccion3'] // fallback to all if no courseData
  
  // Create a map of moments to include for each lesson
  const momentsToInclude: { [key: string]: string[] } = {}
  if (courseData) {
    courseData.lessons.forEach((lesson, lessonIndex) => {
      const leccionKey = `leccion${lessonIndex + 1}`
      momentsToInclude[leccionKey] = lesson.moments.map((_, momentIndex) => 
        `momento${lessonIndex + 1}_${momentIndex + 1}`
      )
    })
  }
  
  async function walkDirectory(dir: string, relativePath: string = '') {
    const items = await fs.readdir(dir, { withFileTypes: true })
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name)
      const relativeFilePath = path.join(relativePath, item.name).replace(/\\/g, '/')
      
      // Skip actividades folder
      if (item.name === 'actividades') {
        continue
      }
      
      // Skip lesson folders that are not in the user's configuration
      if (relativePath === 'module' && item.name.startsWith('leccion')) {
        if (!lessonsToInclude.includes(item.name)) {
          continue
        }
      }
      
      // Skip moment folders that are not in the user's configuration
      if (relativePath.includes('module/leccion') && item.name.startsWith('momento')) {
        const leccionMatch = relativePath.match(/leccion(\d+)$/)
        if (leccionMatch && courseData) {
          const leccionKey = `leccion${leccionMatch[1]}`
          if (momentsToInclude[leccionKey] && !momentsToInclude[leccionKey].includes(item.name)) {
            continue
          }
        }
      }
      
      if (item.isDirectory()) {
        await walkDirectory(fullPath, relativeFilePath)
      } else {
        // Read file content
        const ext = path.extname(item.name).toLowerCase()
        const isBinary = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.mp3', '.wav', '.pdf', '.zip'].includes(ext)
        
        if (isBinary) {
          const content = await fs.readFile(fullPath)
          files.push({
            path: relativeFilePath,
            content,
            isBuffer: true
          })
        } else {
          const content = await fs.readFile(fullPath, 'utf-8')
          files.push({
            path: relativeFilePath,
            content,
            isBuffer: false
          })
        }
      }
    }
  }
  
  await walkDirectory(templatePath)
  return files
}