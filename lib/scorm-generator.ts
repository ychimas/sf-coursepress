// SCORM File Generator System
// This utility generates the complete SCORM course structure

export interface Moment {
  id: number
  type: "slider" | "video" | "interactive" | "quiz"
  name: string
}

export interface Lesson {
  id: number
  name: string
  moments: Moment[]
}

export interface CourseData {
  name: string
  folderName: string
  description: string
  category: string
  lessons: Lesson[]
}

export interface GeneratedFile {
  path: string
  content: string
  type: "html" | "css" | "js" | "xml" | "json"
}

export class SCORMGenerator {
  private courseData: CourseData

  constructor(courseData: CourseData) {
    this.courseData = courseData
  }

  // Generate all files for the SCORM course
  generateAllFiles(): GeneratedFile[] {
    const files: GeneratedFile[] = []

    // Generate manifest
    files.push(this.generateManifest())

    // Generate course config
    files.push(this.generateCourseConfig())

    // Generate CSS files
    files.push(this.generateMainCSS())

    // Generate JavaScript files
    files.push(this.generateNavigationJS())
    files.push(this.generateSCORMAPI())

    // Generate HTML files for each lesson and moment
    this.courseData.lessons.forEach((lesson, lessonIndex) => {
      lesson.moments.forEach((moment, momentIndex) => {
        files.push(this.generateMomentHTML(lesson, lessonIndex, moment, momentIndex))
      })
      files.push(this.generateEvaluacionHTML(lesson, lessonIndex))
      files.push(this.generateResumenHTML(lesson, lessonIndex))
    })

    // Generate index file
    files.push(this.generateIndexHTML())

    return files
  }

  // Generate imsmanifest.xml
  private generateManifest(): GeneratedFile {
    const resources = this.courseData.lessons
      .flatMap((lesson, lessonIndex) =>
        lesson.moments.map(
          (moment, momentIndex) => `
    <resource identifier="resource_${lessonIndex}_${momentIndex}" type="webcontent" adlcp:scormType="sco" href="lecciones/leccion-${lessonIndex + 1}-momento-${momentIndex + 1}.html">
      <file href="lecciones/leccion-${lessonIndex + 1}-momento-${momentIndex + 1}.html"/>
    </resource>`,
        ),
      )
      .join("")

    const items = this.courseData.lessons
      .map(
        (lesson, lessonIndex) => `
      <item identifier="item_${lessonIndex}" identifierref="resource_${lessonIndex}_0" isvisible="true">
        <title>${lesson.name || `Lección ${lessonIndex + 1}`}</title>
      </item>`,
      )
      .join("")

    const content = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.sfcoursepress.${this.courseData.folderName}" version="1.0"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org_1">
    <organization identifier="org_1">
      <title>${this.courseData.name}</title>${items}
    </organization>
  </organizations>
  <resources>${resources}
  </resources>
</manifest>`

    return {
      path: "imsmanifest.xml",
      content,
      type: "xml",
    }
  }

  // Generate curso-config.js
  private generateCourseConfig(): GeneratedFile {
    const lessonsConfig = this.courseData.lessons.map((lesson, lessonIndex) => ({
      id: lessonIndex + 1,
      name: lesson.name || `Lección ${lessonIndex + 1}`,
      moments: lesson.moments.map((moment, momentIndex) => ({
        id: momentIndex + 1,
        type: moment.type,
        name: moment.name || `Momento ${momentIndex + 1}`,
        file: `lecciones/leccion-${lessonIndex + 1}-momento-${momentIndex + 1}.html`,
      })),
    }))

    const content = `// Configuración del Curso - ${this.courseData.name}
// Generado automáticamente por SF CoursePress

const cursoConfig = {
  nombre: "${this.courseData.name}",
  descripcion: "${this.courseData.description}",
  categoria: "${this.courseData.category}",
  version: "1.0",
  lecciones: ${JSON.stringify(lessonsConfig, null, 2)},
  
  // Configuración de navegación
  navegacion: {
    mostrarMenu: true,
    permitirSaltar: false,
    mostrarProgreso: true
  },
  
  // Configuración SCORM
  scorm: {
    version: "1.2",
    trackingActivo: true,
    guardarProgreso: true
  }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = cursoConfig;
}`

    return {
      path: "curso-config.js",
      content,
      type: "js",
    }
  }

  // Generate main CSS
  private generateMainCSS(): GeneratedFile {
    const content = `/* Estilos principales del curso - ${this.courseData.name} */
/* Generado por SF CoursePress */

:root {
  --primary-color: #2563eb;
  --secondary-color: #3b82f6;
  --text-color: #0f172a;
  --bg-color: #ffffff;
  --border-color: #e2e8f0;
  --success-color: #10b981;
  --error-color: #ef4444;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
}

.curso-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.curso-header {
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.curso-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.curso-content {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.slide-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.slide-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.slide-content {
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.video-container iframe,
.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.quiz-container {
  padding: 1.5rem;
}

.quiz-question {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quiz-option {
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.quiz-option:hover {
  border-color: var(--primary-color);
  background-color: #f8fafc;
}

.quiz-option.selected {
  border-color: var(--primary-color);
  background-color: #dbeafe;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: var(--border-color);
  color: var(--text-color);
}

.btn-secondary:hover {
  background-color: #cbd5e1;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--secondary-color), var(--primary-color));
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .curso-container {
    padding: 1rem;
  }
  
  .curso-header h1 {
    font-size: 1.5rem;
  }
  
  .slide-title {
    font-size: 1.5rem;
  }
  
  .navigation-buttons {
    flex-direction: column;
  }
}`

    return {
      path: "css/main.css",
      content,
      type: "css",
    }
  }

  // Generate navigation JavaScript
  private generateNavigationJS(): GeneratedFile {
    const content = `// Sistema de Navegación del Curso
// Generado por SF CoursePress

class CursoNavegacion {
  constructor(config) {
    this.config = config;
    this.currentLesson = 0;
    this.currentMoment = 0;
    this.completedMoments = new Set();
    this.init();
  }

  init() {
    this.loadProgress();
    this.setupEventListeners();
    this.updateProgress();
  }

  setupEventListeners() {
    const nextBtn = document.getElementById('btn-siguiente');
    const prevBtn = document.getElementById('btn-anterior');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.siguiente());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.anterior());
    }
  }

  siguiente() {
    this.markCurrentAsCompleted();
    
    const currentLesson = this.config.lecciones[this.currentLesson];
    
    if (this.currentMoment < currentLesson.moments.length - 1) {
      this.currentMoment++;
    } else if (this.currentLesson < this.config.lecciones.length - 1) {
      this.currentLesson++;
      this.currentMoment = 0;
    } else {
      this.completarCurso();
      return;
    }

    this.navegarA(this.currentLesson, this.currentMoment);
  }

  anterior() {
    if (this.currentMoment > 0) {
      this.currentMoment--;
    } else if (this.currentLesson > 0) {
      this.currentLesson--;
      const prevLesson = this.config.lecciones[this.currentLesson];
      this.currentMoment = prevLesson.moments.length - 1;
    } else {
      return;
    }

    this.navegarA(this.currentLesson, this.currentMoment);
  }

  navegarA(lessonIndex, momentIndex) {
    const lesson = this.config.lecciones[lessonIndex];
    const moment = lesson.moments[momentIndex];
    
    this.currentLesson = lessonIndex;
    this.currentMoment = momentIndex;
    
    this.saveProgress();
    this.updateProgress();
    
    window.location.href = moment.file;
  }

  markCurrentAsCompleted() {
    const key = \`\${this.currentLesson}-\${this.currentMoment}\`;
    this.completedMoments.add(key);
    this.saveProgress();
    
    if (window.scormAPI) {
      window.scormAPI.setCompleted();
    }
  }

  updateProgress() {
    const totalMoments = this.config.lecciones.reduce(
      (sum, lesson) => sum + lesson.moments.length, 
      0
    );
    const completed = this.completedMoments.size;
    const percentage = (completed / totalMoments) * 100;

    const progressBar = document.getElementById('progress-fill');
    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }

    const progressText = document.getElementById('progress-text');
    if (progressText) {
      progressText.textContent = \`\${completed} de \${totalMoments} completados\`;
    }

    // Update SCORM
    if (window.scormAPI) {
      window.scormAPI.setProgress(percentage);
    }
  }

  saveProgress() {
    const progress = {
      currentLesson: this.currentLesson,
      currentMoment: this.currentMoment,
      completed: Array.from(this.completedMoments)
    };
    localStorage.setItem('curso_progress', JSON.stringify(progress));
  }

  loadProgress() {
    const saved = localStorage.getItem('curso_progress');
    if (saved) {
      const progress = JSON.parse(saved);
      this.currentLesson = progress.currentLesson || 0;
      this.currentMoment = progress.currentMoment || 0;
      this.completedMoments = new Set(progress.completed || []);
    }
  }

  completarCurso() {
    alert('¡Felicitaciones! Has completado el curso.');
    if (window.scormAPI) {
      window.scormAPI.setCourseComplete();
    }
  }
}

// Inicializar cuando el DOM esté listo
if (typeof cursoConfig !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.navegacion = new CursoNavegacion(cursoConfig);
    });
  } else {
    window.navegacion = new CursoNavegacion(cursoConfig);
  }
}`

    return {
      path: "js/navegacion.js",
      content,
      type: "js",
    }
  }

  // Generate SCORM API wrapper
  private generateSCORMAPI(): GeneratedFile {
    const content = `// SCORM API Wrapper - Versión 1.2
// Generado por SF CoursePress

class SCORMAPI {
  constructor() {
    this.API = null;
    this.initialized = false;
    this.findAPI();
  }

  findAPI() {
    let win = window;
    let attempts = 0;
    const maxAttempts = 10;

    while (!win.API && win.parent && win.parent != win && attempts < maxAttempts) {
      attempts++;
      win = win.parent;
    }

    if (win.API) {
      this.API = win.API;
      this.initialize();
    }
  }

  initialize() {
    if (!this.API) return false;

    const result = this.API.LMSInitialize('');
    if (result === 'true') {
      this.initialized = true;
      console.log('SCORM API inicializada correctamente');
      return true;
    }
    return false;
  }

  getValue(parameter) {
    if (!this.API || !this.initialized) return '';
    return this.API.LMSGetValue(parameter);
  }

  setValue(parameter, value) {
    if (!this.API || !this.initialized) return false;
    const result = this.API.LMSSetValue(parameter, value);
    return result === 'true';
  }

  commit() {
    if (!this.API || !this.initialized) return false;
    const result = this.API.LMSCommit('');
    return result === 'true';
  }

  finish() {
    if (!this.API || !this.initialized) return false;
    const result = this.API.LMSFinish('');
    this.initialized = false;
    return result === 'true';
  }

  // Métodos de conveniencia
  setCompleted() {
    this.setValue('cmi.core.lesson_status', 'completed');
    this.commit();
  }

  setCourseComplete() {
    this.setValue('cmi.core.lesson_status', 'completed');
    this.setValue('cmi.core.score.raw', '100');
    this.commit();
  }

  setProgress(percentage) {
    this.setValue('cmi.core.score.raw', percentage.toString());
    this.commit();
  }

  setScore(score, min = 0, max = 100) {
    this.setValue('cmi.core.score.raw', score.toString());
    this.setValue('cmi.core.score.min', min.toString());
    this.setValue('cmi.core.score.max', max.toString());
    this.commit();
  }

  getStudentName() {
    return this.getValue('cmi.core.student_name');
  }

  getStudentId() {
    return this.getValue('cmi.core.student_id');
  }

  getLessonStatus() {
    return this.getValue('cmi.core.lesson_status');
  }
}

// Inicializar SCORM API globalmente
window.scormAPI = new SCORMAPI();

// Cerrar sesión SCORM al salir
window.addEventListener('beforeunload', () => {
  if (window.scormAPI) {
    window.scormAPI.finish();
  }
});`

    return {
      path: "js/scorm-api.js",
      content,
      type: "js",
    }
  }

  // Generate HTML for each moment
  private generateMomentHTML(lesson: Lesson, lessonIndex: number, moment: Moment, momentIndex: number): GeneratedFile {
    const templates = {
      slider: this.getSliderTemplate(lesson, moment, lessonIndex, momentIndex),
      video: this.getVideoTemplate(lesson, moment, lessonIndex, momentIndex),
      interactive: this.getInteractiveTemplate(lesson, moment, lessonIndex, momentIndex),
      quiz: this.getQuizTemplate(lesson, moment, lessonIndex, momentIndex),
    }

    const content = templates[moment.type]

    return {
      path: `lecciones/leccion-${lessonIndex + 1}-momento-${momentIndex + 1}.html`,
      content,
      type: "html",
    }
  }

  private generateEvaluacionHTML(lesson: Lesson, lessonIndex: number): GeneratedFile {
    return {
      path: `lecciones/evaluacion_leccion_${lessonIndex + 1}.html`,
      content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evaluación - ${lesson.name}</title>
  <link rel="stylesheet" href="../css/main.css">
  <script src="../curso-config.js"></script>
  <script src="../js/scorm-api.js"></script>
  <script src="../js/navegacion.js"></script>
</head>
<body>
  <div class="curso-container">
    <div class="curso-header">
      <h1>${this.courseData.name}</h1>
      <p>Evaluación - Lección ${lessonIndex + 1}: ${lesson.name}</p>
    </div>
    <div class="curso-content">
      <h2>Evaluación de la Lección</h2>
      <p>Contenido de evaluación aquí.</p>
      <div class="navigation-buttons">
        <button id="btn-anterior" class="btn btn-secondary">← Anterior</button>
        <button id="btn-siguiente" class="btn btn-primary">Siguiente →</button>
      </div>
    </div>
  </div>
</body>
</html>`,
      type: "html",
    }
  }

  private generateResumenHTML(lesson: Lesson, lessonIndex: number): GeneratedFile {
    // Para lecciones 2 y 3, usar las plantillas base específicas
    if (lessonIndex === 1) { // Lección 2
      return {
        path: `lecciones/resumen_leccion_${lessonIndex + 1}.html`,
        content: this.getResumenLeccion2Template(),
        type: "html",
      }
    } else if (lessonIndex === 2) { // Lección 3
      return {
        path: `lecciones/resumen_leccion_${lessonIndex + 1}.html`,
        content: this.getResumenLeccion3Template(),
        type: "html",
      }
    }
    
    // Para otras lecciones, usar plantilla genérica
    return {
      path: `lecciones/resumen_leccion_${lessonIndex + 1}.html`,
      content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resumen - ${lesson.name}</title>
  <link rel="stylesheet" href="../css/main.css">
  <script src="../curso-config.js"></script>
  <script src="../js/scorm-api.js"></script>
  <script src="../js/navegacion.js"></script>
</head>
<body>
  <div class="curso-container">
    <div class="curso-header">
      <h1>${this.courseData.name}</h1>
      <p>Resumen - Lección ${lessonIndex + 1}: ${lesson.name}</p>
    </div>
    <div class="curso-content">
      <h2>Resumen de la Lección</h2>
      <p>Descarga el PDF de resumen:</p>
      <a href="#" class="btn btn-primary">Descargar PDF</a>
      <div class="navigation-buttons" style="margin-top: 2rem;">
        <button id="btn-anterior" class="btn btn-secondary">← Anterior</button>
        <button id="btn-siguiente" class="btn btn-primary">Siguiente →</button>
      </div>
    </div>
  </div>
</body>
</html>`,
      type: "html",
    }
  }

  private getSliderTemplate(lesson: Lesson, moment: Moment, lessonIndex: number, momentIndex: number): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${moment.name || `Momento ${momentIndex + 1}`} - ${lesson.name}</title>
  <link rel="stylesheet" href="../css/main.css">
  <script src="../curso-config.js"></script>
  <script src="../js/scorm-api.js"></script>
  <script src="../js/navegacion.js"></script>
</head>
<body>
  <div class="curso-container">
    <div class="curso-header">
      <h1>${this.courseData.name}</h1>
      <p>Lección ${lessonIndex + 1}: ${lesson.name}</p>
    </div>

    <div class="progress-bar">
      <div id="progress-fill" class="progress-fill" style="width: 0%"></div>
    </div>

    <div class="curso-content">
      <div class="slide-container">
        <h2 class="slide-title">${moment.name || `Momento ${momentIndex + 1}`}</h2>
        <div class="slide-content">
          <p>Este es un slide de contenido. Aquí puedes agregar:</p>
          <ul>
            <li>Texto explicativo sobre el tema</li>
            <li>Imágenes ilustrativas</li>
            <li>Listas de puntos importantes</li>
            <li>Cualquier contenido HTML personalizado</li>
          </ul>
          <p><strong>Instrucciones:</strong> Edita este archivo HTML para personalizar el contenido de este momento del curso.</p>
        </div>
      </div>

      <div class="navigation-buttons">
        <button id="btn-anterior" class="btn btn-secondary">← Anterior</button>
        <button id="btn-siguiente" class="btn btn-primary">Siguiente →</button>
      </div>
    </div>
  </div>
</body>
</html>`
  }

  private getVideoTemplate(lesson: Lesson, moment: Moment, lessonIndex: number, momentIndex: number): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${moment.name || `Momento ${momentIndex + 1}`} - ${lesson.name}</title>
  <link rel="stylesheet" href="../css/main.css">
  <script src="../curso-config.js"></script>
  <script src="../js/scorm-api.js"></script>
  <script src="../js/navegacion.js"></script>
</head>
<body>
  <div class="curso-container">
    <div class="curso-header">
      <h1>${this.courseData.name}</h1>
      <p>Lección ${lessonIndex + 1}: ${lesson.name}</p>
    </div>

    <div class="progress-bar">
      <div id="progress-fill" class="progress-fill" style="width: 0%"></div>
    </div>

    <div class="curso-content">
      <div class="slide-container">
        <h2 class="slide-title">${moment.name || `Video ${momentIndex + 1}`}</h2>
        
        <div class="video-container">
           Reemplaza el src con tu URL de video 
          <iframe 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>

        <div class="slide-content">
          <p><strong>Instrucciones:</strong> Reemplaza la URL del video en el iframe con tu propio contenido de video.</p>
          <p>Puedes usar videos de YouTube, Vimeo, o archivos de video locales usando la etiqueta &lt;video&gt;.</p>
        </div>
      </div>

      <div class="navigation-buttons">
        <button id="btn-anterior" class="btn btn-secondary">← Anterior</button>
        <button id="btn-siguiente" class="btn btn-primary">Siguiente →</button>
      </div>
    </div>
  </div>
</body>
</html>`
  }

  private getInteractiveTemplate(lesson: Lesson, moment: Moment, lessonIndex: number, momentIndex: number): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${moment.name || `Momento ${momentIndex + 1}`} - ${lesson.name}</title>
  <link rel="stylesheet" href="../css/main.css">
  <script src="../curso-config.js"></script>
  <script src="../js/scorm-api.js"></script>
  <script src="../js/navegacion.js"></script>
  <style>
    .interactive-area {
      min-height: 300px;
      border: 2px dashed #e2e8f0;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      background-color: #f8fafc;
    }
    .interactive-item {
      display: inline-block;
      padding: 1rem 2rem;
      margin: 0.5rem;
      background-color: #3b82f6;
      color: white;
      border-radius: 8px;
      cursor: move;
      user-select: none;
    }
  </style>
</head>
<body>
  <div class="curso-container">
    <div class="curso-header">
      <h1>${this.courseData.name}</h1>
      <p>Lección ${lessonIndex + 1}: ${lesson.name}</p>
    </div>

    <div class="progress-bar">
      <div id="progress-fill" class="progress-fill" style="width: 0%"></div>
    </div>

    <div class="curso-content">
      <div class="slide-container">
        <h2 class="slide-title">${moment.name || `Actividad Interactiva ${momentIndex + 1}`}</h2>
        
        <div class="slide-content">
          <p>Esta es una plantilla para contenido interactivo. Puedes agregar:</p>
          <ul>
            <li>Elementos drag & drop</li>
            <li>Actividades de emparejamiento</li>
            <li>Simulaciones interactivas</li>
            <li>Ejercicios prácticos</li>
          </ul>
        </div>

        <div class="interactive-area">
          <div class="interactive-item" draggable="true">Elemento 1</div>
          <div class="interactive-item" draggable="true">Elemento 2</div>
          <div class="interactive-item" draggable="true">Elemento 3</div>
          <p style="margin-top: 2rem; color: #64748b;">Arrastra los elementos para interactuar</p>
        </div>
      </div>

      <div class="navigation-buttons">
        <button id="btn-anterior" class="btn btn-secondary">← Anterior</button>
        <button id="btn-siguiente" class="btn btn-primary">Siguiente →</button>
      </div>
    </div>
  </div>

  <script>
    // Ejemplo básico de drag & drop
    const items = document.querySelectorAll('.interactive-item');
    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', item.innerHTML);
      });
    });
  </script>
</body>
</html>`
  }

  private getQuizTemplate(lesson: Lesson, moment: Moment, lessonIndex: number, momentIndex: number): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${moment.name || `Momento ${momentIndex + 1}`} - ${lesson.name}</title>
  <link rel="stylesheet" href="../css/main.css">
  <script src="../curso-config.js"></script>
  <script src="../js/scorm-api.js"></script>
  <script src="../js/navegacion.js"></script>
</head>
<body>
  <div class="curso-container">
    <div class="curso-header">
      <h1>${this.courseData.name}</h1>
      <p>Lección ${lessonIndex + 1}: ${lesson.name}</p>
    </div>

    <div class="progress-bar">
      <div id="progress-fill" class="progress-fill" style="width: 0%"></div>
    </div>

    <div class="curso-content">
      <div class="quiz-container">
        <h2 class="slide-title">${moment.name || `Evaluación ${momentIndex + 1}`}</h2>
        
        <div class="quiz-question">
          ¿Cuál es la respuesta correcta a esta pregunta de ejemplo?
        </div>

        <div class="quiz-options">
          <div class="quiz-option" data-correct="false">
            <strong>A)</strong> Esta es una opción incorrecta
          </div>
          <div class="quiz-option" data-correct="true">
            <strong>B)</strong> Esta es la opción correcta
          </div>
          <div class="quiz-option" data-correct="false">
            <strong>C)</strong> Esta es otra opción incorrecta
          </div>
          <div class="quiz-option" data-correct="false">
            <strong>D)</strong> Esta también es incorrecta
          </div>
        </div>

        <div id="quiz-feedback" style="margin-top: 1.5rem; padding: 1rem; border-radius: 8px; display: none;"></div>
      </div>

      <div class="navigation-buttons">
        <button id="btn-anterior" class="btn btn-secondary">← Anterior</button>
        <button id="btn-verificar" class="btn btn-primary">Verificar Respuesta</button>
        <button id="btn-siguiente" class="btn btn-primary" style="display: none;">Siguiente →</button>
      </div>
    </div>
  </div>

  <script>
    let selectedOption = null;

    document.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('click', function() {
        document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        selectedOption = this;
      });
    });

    document.getElementById('btn-verificar').addEventListener('click', function() {
      if (!selectedOption) {
        alert('Por favor selecciona una respuesta');
        return;
      }

      const feedback = document.getElementById('quiz-feedback');
      const isCorrect = selectedOption.dataset.correct === 'true';

      if (isCorrect) {
        feedback.style.backgroundColor = '#d1fae5';
        feedback.style.color = '#065f46';
        feedback.textContent = '✓ ¡Correcto! Has seleccionado la respuesta correcta.';
        
        if (window.scormAPI) {
          window.scormAPI.setScore(100);
        }
      } else {
        feedback.style.backgroundColor = '#fee2e2';
        feedback.style.color = '#991b1b';
        feedback.textContent = '✗ Incorrecto. Por favor intenta nuevamente.';
        
        if (window.scormAPI) {
          window.scormAPI.setScore(0);
        }
      }

      feedback.style.display = 'block';
      this.style.display = 'none';
      document.getElementById('btn-siguiente').style.display = 'inline-block';
    });
  </script>
</body>
</html>`
  }

  private getResumenLeccion2Template(): string {
    return `<!DOCTYPE html>
<html lang="es">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- library bootstrap v.5.0.2 -->
    <script src="../../plugins/libs/jquery-3.3.1.js"></script>
    <link rel="stylesheet" type="text/css" href="../../plugins/libs/bootstrap/css/bootstrap.css">
    <script src="../../plugins/libs/bootstrap/js/bootstrap.bundle.js"></script>
    <link rel="stylesheet" type="text/css" href="../../plugins/css/sofactia.css">

    <!--Montserrat-->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">

    <!--Libreria iconos-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Estilos del widget -->
    <link rel="stylesheet" href="../../plugins/libs/assetsWidget/css/widget.css">
    <!-- Estilos de transcripción -->
    <link rel="stylesheet" href="../../plugins/libs/component/transcripcion/transcripcion.css">
</head>

<body class="sf-scroll-y-hidden sf-bg-dark">
    <!-- content fluid -->
    <div class="container-fluid pb-5 pb-md-0 px-0 px-md-5 py-0 text-center">
        <div class="row d-flex justify-content-center align-items-center sf-min-h-vh100 mx-5">
            <div class="col-lg-4 col-md-3 mt-5 my-md-0 px-0">
                <h1 class="sf-txt-1xl-700 sf-text-white">Resumen <span class="sf-text-purple">Lección 2</span></h1>
                <img class="mx-auto sf-img-40 sf-img-md-100 sf-img-sm-30" src="../leccion2/gif/avatar_compromiso.gif"
                    alt="avatar">
                <div class="audio-center py-4">
                    <audio class="audio-con-transcripcion" controls data-transcripcion='[
                        {"end":4.66,"start":0,"text":"La lección 2 se centra en la prevención, comenzando por diferenciar un conflicto de una"},
                        {"end":9.74,"start":4.66,"text":"agresión. Un conflicto es una diferencia legítima de opinión que se puede resolver"},
                        {"end":13.2,"start":9.74,"text":"con diálogo, como una discusión por el reparto de tareas."},
                        {"end":20.26,"start":14.08,"text":"El acoso, en cambio, es una conducta repetitiva o única que daña, humilla o perjudica, como"},
                        {"end":22.78,"start":20.26,"text":"las burlas constantes sobre la orientación sexual."},
                        {"end":29.44,"start":23.94,"text":"Finalmente, la violencia es una agresión directa, física o verbal, especialmente cuando"},
                        {"end":33.9,"start":29.44,"text":"proviene de terceros, como un cliente que insulta y amenaza a un trabajador."},
                        {"end":39.5,"start":34.72,"text":"Para prevenir estas conductas, es esencial reconocer los entornos que las facilitan."},
                        {"end":45.88,"start":40.44,"text":"Los ambientes con comunicación deficiente, liderazgo autoritario, alta rotación o presión"},
                        {"end":47.7,"start":45.88,"text":"excesiva son focos de riesgo."},
                        {"end":53.66,"start":48.58,"text":"Las señales de alerta incluyen la normalización del maltrato, las bromas sexistas, las"},
                        {"end":58.46,"start":53.66,"text":"sobrecarga injustificada o el aislamiento, bajo excusas como así se trabaja aquí."},
                        {"end":64.42,"start":59.2,"text":"Las señales comunes de acoso laboral incluyen la asignación de tareas degradantes, gritos,"},
                        {"end":68.28,"start":64.86,"text":"burlas, exclusión del equipo y sobrecarga injustificada."},
                        {"end":72.88,"start":68.96,"text":"La prevención efectiva requiere de prácticas organizacionales robustas."},
                        {"end":79,"start":73.76,"text":"Esto implica tener reglas claras y conocidas, reglamento interno y protocolo de prevención"},
                        {"end":84.22,"start":79,"text":"y promover un liderazgo ejemplar con jefaturas formadas en respeto y manejo de conflictos."},
                        {"end":90.02,"start":84.88,"text":"Otras medidas claves son fomentar la comunicación abierta a través de espacios seguros y realizar"},
                        {"end":94.16,"start":90.02,"text":"una evaluación periódica del clima laboral mediante encuestas o foques group."},
                        {"end":100.12,"start":95.08,"text":"Finalmente, el trabajador tiene un rol activo en la prevención, debe conocer sus derechos"},
                        {"end":101.9,"start":100.12,"text":"y el protocolo institucional."},
                        {"end":107.58,"start":102.78,"text":"Se espera que esté atento a comportamientos inapropiados en compañeros que intervenga"},
                        {"end":113.02,"start":107.58,"text":"de forma segura o reporte al canal correspondiente si presencia un hecho inadecuado y que promueva"},
                        {"end":114.92,"start":113.02,"text":"el respeto mutuo en cada interacción."},
                        {"end":121.62,"start":115.86,"text":"Si se es víctima, se debe denunciar y documentar, si se es testigo, se debe reportar y no"},
                        {"end":122.74,"start":121.62,"text":"ser cómplice pasivo."}
                        ]'>
                        <source src="../leccion2/resumen_leccion-2.mp3" type="audio/mp3">
                    </audio>
                    <i class="transcription-toggle fas fa-closed-captioning audio-estilos"></i>
                </div>
            </div>
            <div class="col-lg-8 col-md-9 mt-4 my-md-0">
                <div class="mx-md-5 mx-4 sf-lh-xs">
                    <p class="sf-text-white mb-2">¡Bien hecho! Has terminado la Lección 2</p>
                    <p class="sf-text-white mb-2">¡Revisemos este resumen de lo visto en esta lección!</p>
                    <embed src="../leccion2/doc/resumen_leccion2.pdf" type="application/pdf" class="pdf-viewer">
                    <a href="../leccion2/doc/resumen_leccion2.pdf" download="Resumen-Leccion-2.pdf"
                        class="sf-btn sf-btn-purple">
                        <i class="fa fa-download"></i> Descargar PDF
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="btn-navigation-container glass-back">
        <button id="pagIndex" class="btn-navigation btn-navigation--prev" onclick="btnPrev()">
            <i class="fas fa-angle-left"></i> <span>Anterior</span>
        </button>
        <button id="next" class="btn-navigation btn-navigation--next" onclick="btnNext()">
            <span>Siguiente</span> <i class="fas fa-angle-right"></i>
        </button>
    </div>

    <!--library javascript-->
    <script src="../../plugins/libs/jquery-3.3.1.js"></script>
    <!-- Script del Widget -->
    <script src="../../plugins/libs/assetsWidget/js/widget.js"></script>
    <!-- Script de transcripción -->
    <script src="../../plugins/libs/component/transcripcion/transcripcion.js"></script>

    <script>
        function btnPrev() {
            const path = location.pathname.split("/").slice(0, -1).join("/");
            window.location.href = "./index.html";
        };

        function btnNext() {
            const path = location.pathname.split("/").slice(0, -1).join("/");
            window.location.href = "./evaluacion_leccion.html";
        };

        // Inicializar transcripciones cuando el DOM esté listo
        $(document).ready(function () {
            if (typeof initTranscripciones === 'function') {
                initTranscripciones();
            }
        });
    </script>
    <!-- Contenedor global para transcripciones -->
    <div id="transcripcion-global"></div>
</body>

</html>`
  }

  private getResumenLeccion3Template(): string {
    return `<!DOCTYPE html>
<html lang="es">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- library bootstrap v.5.0.2 -->
    <script src="../../plugins/libs/jquery-3.3.1.js"></script>
    <link rel="stylesheet" type="text/css" href="../../plugins/libs/bootstrap/css/bootstrap.css">
    <script src="../../plugins/libs/bootstrap/js/bootstrap.bundle.js"></script>

    <link rel="stylesheet" type="text/css" href="../../plugins/css/sofactia.css">

    <!--Montserrat-->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">

    <!--Libreria iconos-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Estilos del widget -->
    <link rel="stylesheet" href="../../plugins/libs/assetsWidget/css/widget.css">
    <!-- Estilos de transcripción -->
    <link rel="stylesheet" href="../../plugins/libs/component/transcripcion/transcripcion.css">
</head>

<body class="sf-scroll-y-hidden sf-bg-dark">
    <!-- content fluid -->
    <div class="container-fluid pb-5 pb-md-0 px-0 px-md-5 py-0 text-center">
        <div class="row d-flex justify-content-center align-items-center sf-min-h-vh100 mx-5">
            <div class="col-lg-4 col-md-3 mt-5 my-md-0 px-0">
                <h1 class="sf-txt-1xl-700 sf-text-white">Resumen <span class="sf-text-purple">Lección 3</span></h1>
                <img class="mx-auto sf-img-30 sf-img-md-100 sf-img-sm-30"
                    src="../leccion3/gif/avatar_hombre_brazos_cruzados.gif" alt="avatar">
                <div class="audio-center py-4">
                    <audio class="audio-con-transcripcion" controls data-transcripcion='[
                        {"end":4.62,"start":0,"text":"La tercera lección aborda el proceso de denuncia, investigación y sanción, el cual debe"},
                        {"end":7.16,"start":4.62,"text":"regirse por los principios rectores de la Ley Karin."},
                        {"end":13.98,"start":8.2,"text":"Estos son: Confidencialidad, garantizar la reserva de antecedentes e identidades, Imparcialidad,"},
                        {"end":19.72,"start":14.3,"text":"asegurar la objetividad, Celeridad, el proceso debe ser rápido, con un plazo máximo de"},
                        {"end":25.12,"start":19.72,"text":"30 días hábiles para la investigación y Perspectiva de género, considerarlas asimetrías"},
                        {"end":27.64,"start":25.12,"text":"de poder y el impacto diferenciado de la cosa."},
                        {"end":31.94,"start":28.32,"text":"También se exige la No-revictimización de la persona denunciante."},
                        {"end":37.44,"start":32.64,"text":"El trabajador tiene la libertad de elegir dónde denunciar, por la vía interna, comité"},
                        {"end":44.06,"start":37.44,"text":"de ética o RRHH o por la vía externa, inspección del trabajo o contraloría para el sector público."},
                        {"end":49.78,"start":44.88,"text":"La denuncia debe ser escrita e incluir la identificación de las personas una descripción"},
                        {"end":55.28,"start":49.78,"text":"detallada de los hechos, cuando, donde, como, y la individualización de posibles testigos"},
                        {"end":60.36,"start":55.28,"text":"o pruebas, una vez recibida la denuncia, el empleador está obligado a tomar medidas"},
                        {"end":65.92,"start":60.36,"text":"de resguardo y protección inmediatas, medidas cautelares para proteger la salud y seguridad"},
                        {"end":66.74,"start":65.92,"text":"del afectado."},
                        {"end":73.14,"start":67.56,"text":"Estas medidas incluyen la separación de espacios, cambiando al denunciado de sección, la suspensión,"},
                        {"end":78.06,"start":73.5,"text":"solo para el denunciado, la opción de tele trabajo para el denunciante, si es factible,"},
                        {"end":82.16,"start":78.32,"text":"y la provisión de asistencia psicológica y médica al trabajador afectado."},
                        {"end":90.56,"start":82.88,"text":"La etapa de investigación interna (artículo 211-B a 211-E), debe ser realizada por un profesional"},
                        {"end":95.74,"start":90.56,"text":"imparcial y conformación en género. Se debe investigar todos los hechos denunciados"},
                        {"end":101.5,"start":95.74,"text":"dentro del plazo máximo de 30 días hábiles. El proceso debe garantizar el derecho de"},
                        {"end":107,"start":101.5,"text":"ambas partes a ser oídas. La investigación culmina con un informe final que establece las"},
                        {"end":112.14,"start":107,"text":"conclusiones y las anciones o medidas recomendadas, las cuales deben ser aplicadas por el empleador"},
                        {"end":118.02,"start":112.14,"text":"en un plazo de 15 días hábiles. Las sanciones van desde amonestaciones hasta el despido del"},
                        {"end":119.62,"start":118.02,"text":"acosador por causales graves."}
                        ]'>
                        <source src="../leccion3/resumen_leccion-3.mp3" type="audio/mp3">
                    </audio>
                    <i class="transcription-toggle fas fa-closed-captioning audio-estilos"></i>
                </div>
            </div>
            <div class="col-lg-8 col-md-9 mt-4 my-md-0">
                <div class="mx-md-5 mx-4 sf-lh-xs">
                    <p class="sf-text-white mb-2">¡Bien hecho! Has terminado la Lección 3</p>
                    <p class="sf-text-white mb-2">¡Revisemos este resumen de lo visto en esta lección!</p>
                    <embed src="../leccion3/doc/resumen_leccion3.pdf" type="application/pdf" class="pdf-viewer">
                    <a href="../leccion3/doc/resumen_leccion3.pdf" download="Resumen-Leccion-3.pdf"
                        class="sf-btn sf-btn-purple">
                        <i class="fa fa-download"></i>Descargar PDF
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="btn-navigation-container glass-back">
        <button id="pagIndex" class="btn-navigation btn-navigation--prev" onclick="btnPrev()">
            <i class="fas fa-angle-left"></i> <span>Anterior</span>
        </button>
        <button id="next" class="btn-navigation btn-navigation--next" onclick="btnNext()">
            <span>Siguiente</span> <i class="fas fa-angle-right"></i>
        </button>
    </div>

    <!--library javascript-->
    <script src="../../plugins/libs/jquery-3.3.1.js"></script>
    <!-- Script del Widget -->
    <script src="../../plugins/libs/assetsWidget/js/widget.js"></script>
    <!-- Script de transcripción -->
    <script src="../../plugins/libs/component/transcripcion/transcripcion.js"></script>

    <script>
        function btnPrev() {
            const path = location.pathname.split("/").slice(0, -1).join("/");
            window.location.href = "./index.html";
        };

        function btnNext() {
            const path = location.pathname.split("/").slice(0, -1).join("/");
            window.location.href = "./evaluacion_leccion.html";
        };

        // Inicializar transcripciones cuando el DOM esté listo
        $(document).ready(function () {
            if (typeof initTranscripciones === 'function') {
                initTranscripciones();
            }
        });
    </script>
    <!-- Contenedor global para transcripciones -->
    <div id="transcripcion-global"></div>
</body>

</html>`
  }
  private generateIndexHTML(): GeneratedFile {
    const firstLesson = this.courseData.lessons[0]
    const firstMoment = firstLesson?.moments[0]
    const firstFile = firstMoment ? "lecciones/leccion-1-momento-1.html" : "#"

    const content = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.courseData.name}</title>
  <link rel="stylesheet" href="css/main.css">
  <script src="curso-config.js"></script>
  <script src="js/scorm-api.js"></script>
</head>
<body>
  <div class="curso-container">
    <div class="curso-header">
      <h1>${this.courseData.name}</h1>
      <p>${this.courseData.description}</p>
    </div>

    <div class="curso-content">
      <h2>Bienvenido al Curso</h2>
      <p>Este curso contiene ${this.courseData.lessons.length} lecciones con contenido interactivo.</p>
      
      <div style="margin-top: 2rem;">
        <h3>Estructura del Curso:</h3>
        <ul style="list-style: none; padding: 0;">
          ${this.courseData.lessons
            .map(
              (lesson, index) => `
          <li style="margin-bottom: 1rem; padding: 1rem; background: #f8fafc; border-radius: 8px;">
            <strong>Lección ${index + 1}:</strong> ${lesson.name}
            <br>
            <small style="color: #64748b;">${lesson.moments.length} momento(s)</small>
          </li>`,
            )
            .join("")}
        </ul>
      </div>

      <div style="margin-top: 2rem;">
        <a href="${firstFile}" class="btn btn-primary" style="display: inline-block; text-decoration: none;">
          Comenzar Curso →
        </a>
      </div>
    </div>
  </div>
</body>
</html>`

    return {
      path: "index.html",
      content,
      type: "html",
    }
  }

  // Get file structure summary
  getFileStructure(): string[] {
    const structure = [
      `${this.courseData.folderName}/`,
      "├── css/",
      "│   └── main.css",
      "├── js/",
      "│   ├── navegacion.js",
      "│   └── scorm-api.js",
      "├── lecciones/",
    ]

    this.courseData.lessons.forEach((lesson, lessonIndex) => {
      lesson.moments.forEach((moment, momentIndex) => {
        const isLast = lessonIndex === this.courseData.lessons.length - 1 && momentIndex === lesson.moments.length - 1
        const prefix = isLast ? "│   └──" : "│   ├──"
        structure.push(`${prefix} leccion-${lessonIndex + 1}-momento-${momentIndex + 1}.html`)
      })
    })

    structure.push("├── assets/")
    structure.push("├── index.html")
    structure.push("├── imsmanifest.xml")
    structure.push("└── curso-config.js")

    return structure
  }
}

// Export for use in the application
export function generateCourse(courseData: CourseData): GeneratedFile[] {
  const generator = new SCORMGenerator(courseData)
  return generator.generateAllFiles()
}

export function getFileStructure(courseData: CourseData): string[] {
  const generator = new SCORMGenerator(courseData)
  return generator.getFileStructure()
}