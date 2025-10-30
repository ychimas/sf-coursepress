// Project Manager for local courses
export interface LocalProject {
  id: string
  name: string
  path: string
  description: string
  createdAt: string
  lastModified: string
  lessons: number
}

export class ProjectManager {
  private static STORAGE_KEY = 'sf-coursepress-projects'

  static getProjects(): LocalProject[] {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static getProjectById(id: string): LocalProject | null {
    const projects = this.getProjects()
    return projects.find(p => p.id === id) || null
  }

  static async addCourseAsProject(courseId: string, courseName: string, lessonsCount: number): Promise<LocalProject> {
    const newProject: LocalProject = {
      id: `curso-${courseId}`,
      name: courseName,
      path: `cursos/${courseId}`,
      description: 'Curso guardado localmente',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      lessons: lessonsCount
    }
    
    const projects = this.getProjects()
    const existingIndex = projects.findIndex(p => p.id === newProject.id)
    
    if (existingIndex !== -1) {
      projects[existingIndex] = newProject
    } else {
      projects.push(newProject)
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects))
    return newProject
  }

  static async addProject(project: Omit<LocalProject, 'id' | 'createdAt' | 'lastModified'>, isExisting = false): Promise<LocalProject> {
    const newProject: LocalProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
    
    // Inicializar estructura de archivos
    try {
      if (isExisting) {
        // Cargar proyecto existente desde carpeta
        await fetch('/api/load-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            projectId: newProject.id, 
            sourcePath: project.path 
          })
        })
        
        // Actualizar número de lecciones
        const updateResponse = await fetch('/api/update-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: newProject.id })
        })
        
        if (updateResponse.ok) {
          const updateData = await updateResponse.json()
          newProject.lessons = updateData.lessonsCount || 0
        }
      } else {
        // Crear nuevo proyecto
        await fetch('/api/init-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: newProject.id })
        })
      }
    } catch (error) {
      console.error('Error inicializando proyecto:', error)
    }
    
    const projects = this.getProjects()
    projects.push(newProject)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects))
    
    return newProject
  }

  static removeProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects))
  }

  static updateProject(id: string, updates: Partial<LocalProject>): void {
    const projects = this.getProjects()
    const index = projects.findIndex(p => p.id === id)
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates, lastModified: new Date().toISOString() }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects))
    }
  }
}