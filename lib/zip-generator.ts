// ZIP Generator for course files
import JSZip from 'jszip'
import { generateCourseFromTemplate, TemplateFile } from './template-generator'
import { copyTemplateFiles } from './file-copier'
import type { CourseData } from './scorm-generator'

export async function generateCourseZip(courseData: CourseData): Promise<Blob> {
  const zip = new JSZip()
  
  // Copy template files (server-side only) - only copy lessons specified by user
  const templateFiles = await copyTemplateFiles(courseData)
  templateFiles.forEach(file => {
    if (file.path === 'plugins/js/config/curso-config.js') return
    
    if (file.isBuffer) {
      zip.file(file.path, file.content as Buffer)
    } else {
      zip.file(file.path, file.content as string)
    }
  })
  
  // Generate dynamic files
  const dynamicFiles = generateCourseFromTemplate(courseData)
  dynamicFiles.forEach((file: TemplateFile) => {
    zip.file(file.path, file.content)
  })
  
  return await zip.generateAsync({ type: 'blob' })
}