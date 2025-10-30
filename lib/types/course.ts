export interface CourseData {
  title: string
  description: string
  author: string
  duration: string
  modules: Module[]
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  moments: Moment[]
}

export interface Moment {
  id: string
  title: string
  type: "slider" | "video" | "interactive" | "quiz"
  content?: string
  videoUrl?: string
  questions?: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

// Base template structure
export interface BaseTemplate {
  rootFiles: {
    indexHtml: string
    lmsJs: string
    packageJson: string
    buildJs: string
  }
  folders: {
    actividades: string[]
    assets: {
      img: string[]
      video: string[]
    }
    module: ModuleTemplate[]
    plugins: PluginTemplate
    wrappers: string[]
  }
}

export interface ModuleTemplate {
  name: string
  lessons: LessonTemplate[]
}

export interface LessonTemplate {
  name: string
  moments: string[]
  files: string[]
}

export interface PluginTemplate {
  css: string[]
  js: {
    config: string[]
    files: string[]
  }
  libs: string[]
  scss: string[]
}
