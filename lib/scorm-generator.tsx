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

  // Generate index.html
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
