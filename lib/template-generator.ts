// Template-based Course Generator
// Uses the base template and generates dynamic content

import { CourseData, Lesson, Moment } from './scorm-generator'

export interface TemplateFile {
  path: string
  content: string
  type: "copy" | "generate"
}

export interface CustomVideo {
  name: string
  data: string
}

export interface MomentImage {
  name: string
  data: string
}

export class TemplateGenerator {
  private courseData: CourseData

  constructor(courseData: CourseData) {
    this.courseData = courseData
  }

  private sanitizeFileName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9._-]/g, "")
  }

  // Generate course using template base
  generateCourseFromTemplate(): TemplateFile[] {
    const files: TemplateFile[] = []

    // Generate essential files
    files.push(...this.generateBaseFiles())
    files.push(this.generateDynamicCourseConfig())
    files.push(...this.generateLessonStructure())

    // Add custom video only if data is provided (ZIP client-side)
    if ((this.courseData as any).customVideo?.data) {
      files.push({
        path: `assets/video/${this.sanitizeFileName((this.courseData as any).customVideo.name)}`,
        content: (this.courseData as any).customVideo.data,
        type: "copy"
      })
    }

    // Add moment images if provided
    this.courseData.lessons.forEach((lesson, lessonIndex) => {
      lesson.moments.forEach((moment: any, momentIndex) => {
        if (moment.image) {
          const momentFolder = `momento${lessonIndex + 1}_${momentIndex + 1}`
          const extension = moment.image.name.split('.').pop() || 'webp'
          files.push({
            path: `module/leccion${lessonIndex + 1}/${momentFolder}/img/img.${extension}`,
            content: moment.image.data,
            type: "copy"
          })
        }
      })
    })

    return files
  }

  // Generate essential base files
  private generateBaseFiles(): TemplateFile[] {
    const files: TemplateFile[] = []

    // Generate main index.html
    files.push({
      path: 'index.html',
      content: this.generateMainIndex(),
      type: "generate"
    })

    // Generate imsmanifest.xml for SCORM
    files.push({
      path: 'imsmanifest.xml',
      content: this.generateManifest(),
      type: "generate"
    })

    // Generate lms.js
    files.push({
      path: 'lms.js',
      content: this.generateLMSFile(),
      type: "generate"
    })

    // Generate package.json
    files.push({
      path: 'package.json',
      content: this.generatePackageJson(),
      type: "generate"
    })

    // Generate inicio module
    files.push({
      path: 'module/inicio/inicio.html',
      content: this.generateInicioPage(),
      type: "generate"
    })

    return files
  }

  private generateMainIndex(): string {
    const videoSource = (this.courseData as any).customVideo
      ? `./assets/video/${this.sanitizeFileName((this.courseData as any).customVideo.name)}`
      : `./assets/video/background_index.mp4`

    return `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHILE CURSOS</title>
    <link rel="stylesheet" type="text/css" href="./plugins/css/sofactia.css">
    <link rel="stylesheet" type="text/css" href="./plugins/css/inicio.css">
    <link rel="stylesheet" type="text/css" href="./plugins/libs/component/particules/particules.css">
    <!-- Librerías CSS -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.1/css/all.css" crossorigin="anonymous">
    <!-- Librería JavaScript -->
    <script src="plugins/libs/jquery-3.3.1.js" defer></script>
</head>

<body id="index">
    <div class="logo-container">
        <img src="./assets/img/logo/logo-white.svg" alt="Orientación en prevención de riesgos" class="logo">
    </div>
    <div class="container-1 sf-text-center">
        <h1 class="sf-fm-main sf-pt-p-5 sf-text-white sf-txt-3xl-xl sf-txt-2xl">
            ${this.courseData.name}
        </h1>
        <div class="icon-container">
            <div class="feature-icon">
                <i class="fas fa-clock"></i>
                <span>A tu ritmo</span>
            </div>
            <div class="feature-icon">
                <i class="fas fa-bolt"></i>
                <span>Aprendizaje rápido</span>
            </div>
            <div class="feature-icon">
                <i class="fas fa-laptop"></i>
                <span>Interactivo</span>
            </div>
        </div>
    </div>
    <div class="fullscreen-cover">
        <video autoplay muted loop id="overlayVideo">
            <source src="${videoSource}" type="video/mp4">
        </video>
    </div>
    <button class="btn-main sf-max-w-r11 sf-center-x" role="button" id="initView">
        <span class="btn-shadow"></span>
        <span class="btn-edge"></span>
        <span class="btn-front">
            <i class="fas fa-hand-point-right"></i> Iniciar
        </span>
    </button>
    <script src="./plugins/libs/component/particules/particule.js" defer></script>

    <script>
        document.getElementById('initView').addEventListener('click', function () {
            window.location.href = 'module/inicio/inicio.html';
        });
    </script>
</body>

</html>`
  }

  private generateManifest(): string {
    const resources = this.courseData.lessons
      .flatMap((lesson, lessonIndex) =>
        lesson.moments.map(
          (moment, momentIndex) => `
    <resource identifier="resource_${lessonIndex}_${momentIndex}" type="webcontent" adlcp:scormType="sco" href="module/leccion${lessonIndex + 1}/momento${lessonIndex + 1}_${momentIndex + 1}/index.html">
      <file href="module/leccion${lessonIndex + 1}/momento${lessonIndex + 1}_${momentIndex + 1}/index.html"/>
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

    return `<?xml version="1.0" encoding="UTF-8"?>
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
  }

  private generateLMSFile(): string {
    return `// LMS Integration File
// Generated by SF CoursePress

// SCORM API Detection and Initialization
function findAPI(win) {
    let attempts = 0;
    const maxAttempts = 500;
    
    while (!win.API && win.parent && win.parent != win && attempts < maxAttempts) {
        attempts++;
        win = win.parent;
    }
    
    return win.API || null;
}

// Initialize SCORM
const scormAPI = findAPI(window);
if (scormAPI) {
    scormAPI.LMSInitialize('');
    console.log('SCORM API initialized');
} else {
    console.log('SCORM API not found - running in standalone mode');
}

// Course completion tracking
function markComplete() {
    if (scormAPI) {
        scormAPI.LMSSetValue('cmi.core.lesson_status', 'completed');
        scormAPI.LMSCommit('');
    }
}

// Progress tracking
function setProgress(percentage) {
    if (scormAPI) {
        scormAPI.LMSSetValue('cmi.core.score.raw', percentage.toString());
        scormAPI.LMSCommit('');
    }
}

// Export functions
window.markComplete = markComplete;
window.setProgress = setProgress;`
  }

  private generatePackageJson(): string {
    return `{
  "name": "${this.courseData.folderName}",
  "version": "1.0.0",
  "description": "${this.courseData.description}",
  "main": "index.html",
  "scripts": {
    "build": "node build.js"
  },
  "keywords": ["scorm", "elearning", "course"],
  "author": "SF CoursePress",
  "license": "MIT"
}`
  }

  private generateInicioPage(): string {
    const glossaryItems = (this.courseData as any).glossary
      ? (this.courseData as any).glossary.split('\n').filter((line: string) => line.trim()).map((line: string) => {
        const parts = line.split(':')
        const term = parts[0]?.trim() || ''
        const definition = parts.slice(1).join(':').trim() || ''
        return `<div class="card_item"><p><span class="sf-text-purple fw-bold">${term}:</span> ${definition}</p><hr></div>`
      }).join('')
      : '<div class="card_item"><p><span class="sf-text-purple fw-bold">Sin contenido:</span> No se ha agregado contenido al glosario.</p><hr></div>'

    const objectiveItems = (this.courseData as any).objectives
      ? (this.courseData as any).objectives.split('\n').filter((line: string) => line.trim()).map((line: string, index: number) => {
        return `<div class="bullet ms-3"><i class="icon icon-purple fas fa-arrow-right"></i><p><strong>Unidad ${index + 1}. </strong>${line.trim()}</p></div>`
      }).join('')
      : '<div class="bullet ms-3"><i class="icon icon-purple fas fa-arrow-right"></i><p>No se han agregado objetivos.</p></div>'

    return `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guía del Usuario</title>

    <link rel="stylesheet" type="text/css" href="../../plugins/libs/bootstrap/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="../../plugins/css/sofactia.css">
    <link rel="stylesheet" type="text/css" href="../../plugins/css/inicio.css">

    <!--iconos-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <!-- Estilos del widget -->
    <link rel="stylesheet" href="../../plugins/libs/assetsWidget/css/widget.css">
</head>

<body class="sf-scroll-y-hidden sf-bg-inicio">
    <div class="container-2">
        <header>
            <h1 class="sf-txt-1xl-700 sf-text-center">
                Bienvenido/a a nuestra <span class="sf-text-purple">plataforma de aprendizaje</span>
                en línea
            </h1>
            <div class="sf-text-center sf-py--5r">
                <i class="hipt hipt-light">
                    Haz clic sobre los botones y a medida que avanzas podras presentar el curso
                    <i class="icon-inline icon-inline--end fa-solid fa-arrow-turn-down"></i>
                </i>
            </div>
            <!-- Barra de progreso -->
            <div class="sf-progress-container sf-mt-5r">
                <div class="sf-progress-bar sf-progress-bar-pink" id="progress-bar"></div>
            </div>
        </header>
        <section>
            <!-- Tabs -->
            <div class="sf-tabs sf-tabs-4 sf-my-r3">
                <button class="sf-tab" id="tab1" onclick="changeTab(1)">
                    <i class="fas fa-book-open"></i> Guía del Usuario
                    <span class="sf-icon-check" id="check1"></span>
                </button>
                <button class="sf-tab" id="tab2" onclick="changeTab(2)">
                    <i class="fas fa-user-graduate"></i> Objetivos de aprendizaje
                    <span class="sf-icon-check" id="check2"></span>
                </button>
                <button class="sf-tab" id="tab3" onclick="changeTab(3)">
                    <i class="fa fa-clipboard"></i> Glosario
                    <span class="sf-icon-check" id="check3"></span>
                </button>
                <button class="sf-tab" id="tab4" onclick="changeTab(4)">
                    <i class="fas fa-folder-tree"></i> Estructura Temática
                    <span class="sf-icon-check" id="check4"></span>
                </button>
            </div>

            <section class="scroll-box sf-content-tabs">
                <!-- guia del usuario -->
                <div class="p-4" id="content1">
                    <h1 class="sf-txt-1xl-700 sf-text-center sf-pb-1r">Guía del <span
                            class="sf-text-purple">Usuario</span>
                    </h1>
                    <div class="row">
                        <div class="col-md-12 col-lg-5">
                            <div class="title-icon">
                                <i class="icon icon-purple fas fa-desktop"></i>
                                <span>Requisitos técnicos</span>
                            </div>
                            <p class="ms-5 text-justify">Para aprovechar al máximo tu experiencia, te recomendamos
                                acceder al curso desde un navegador actualizado (como Google Chrome o Mozilla Firefox), preferiblemente desde
                                un computador o tablet. Usa una conexión estable a internet para evitar interrupciones al
                                visualizar videos o realizar actividades.</p>
                        </div>
                        <div class="col-md-12 col-lg-7">
                            <div class="title-icon">
                                <i class="icon icon-purple fas fa-globe"></i>
                                <span>Navegación del curso</span>
                            </div>
                            <ul class="ms-5 mb-0 text-justify">
                                <li>Navega utilizando los botones de avance y retroceso para recorrer el contenido.</li>
                                <li>Puedes pausar o repetir los videos y audios cuantas veces necesites.</li>
                                <li>Antes de iniciar, debes realizar la evaluación diagnóstica para validar qué conocimientos previos ya
                                    traes y te van a ayudar a comprender mejor los contenidos del curso. </li>
                                <li>Debes revisar cada lección y sus contenidos, asegúrate de completar cada una antes
                                    de pasar a la siguiente.</li>
                                <li>Recuerda marcar como completadas las lecciones que vayas terminando.</li>
                            </ul>
                        </div>
                        <div class="col-lg-12 mt-2">
                            <div class="title-icon">
                                <i class="icon icon-purple fas fa-globe"></i>
                                <span>Importante</span>
                            </div>
                            <div class="bullet ms-5">
                                <i class="icon icon-purple fas fa-arrow-right"></i>
                                <p>Para mayor facilidad de uso, todos nuestros recursos de audio cuentan con la
                                    transcripción en texto para ser leídos, y todos nuestros videos tienen
                                    subtítulos para poder acceder al contenido de forma multicanal (Visual, Oído).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- guia del participante -->
                <div class="p-4" id="content2">
                    <h1 class="sf-txt-1xl-700 sf-text-center sf-pb-1r">Objetivos de <span
                            class="sf-text-purple">aprendizaje</span>
                    </h1>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="title-icon">
                                <i class="icon icon-purple fas fa-bullseye"></i>
                                <span>Objetivo General</span>
                            </div>
                            <p class="ms-5">Aplicar protocolos de prevención vial que mejoren las conductas y actitudes
                                durante la conducción para proteger la vida
                                y reducir la siniestralidad en nuestras operaciones.</p>
                        </div>

                        <div class="col-md-12 mb-3">
                            <div class="title-icon">
                                <i class="icon icon-purple fas fa-bullseye"></i>
                                <span>Objetivos Específicos</span>
                            </div>
                        </div>

                        <div class="col-12">
                            ${objectiveItems}
                        </div>
                    </div>
                </div>

                <!--glosario-->
                <div class="p-4 w-100" id="content3">
                    <h1 class="sf-txt-1xl-700 sf-text-center sf-pb-1r">Glosario</h1>
                    <p class="text-center">Veamos las palabras claves que te ayudarán a comprender mejor la información
                        valiosa de este curso:</p>
                    <div class="row mt-3">
                        <div class="col-sm-12 col-md-12 col-lg-12 mb-3 mb-md-0">
                            <div class="item-glorasio" style="grid-template-columns: repeat(3, 1fr);">
                                ${glossaryItems}
                            </div>
                            <div class="col-sm-12 col-md-12 col-lg-12 mb-3 mb-md-0">
                                <div class="d-flex justify-content-center mt-4">
                                    <a href="./doc/glosario.pdf" download class="sf-btn sf-btn-purple">
                                        <i class="fa fa-download"></i> Descargar PDF
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--estructura tematica-->
                <div class="p-4 w-100" id="content4">
                    <div class="">
                        <h1 class="sf-txt-1xl-700 sf-text-center mb-0">Estructura <span
                                class="sf-text-purple">temática</span>
                        </h1>
                        <p class="text-center mb-2">En este curso encontrarás estas <span class="purple">tres
                                (3) lecciones</span> para identificar, prevenir y controlar los riesgos asociados al
                            manejo defensivo.</p>
                    </div>
                    <div class="sf-text-center sf-py-5r">
                        <i class="hipt hipt-light">
                            <span class="web">
                                Desliza el cursor sobre cada lección para mostrar su contenido
                                <i class="icon-inline icon-inline--end fa-solid fa-arrow-turn-down"></i>
                            </span>
                            <span class="mobile">
                                Lee atentamente el contenido de cada momento
                                <i class="icon-inline icon-inline--end fa-solid fa-arrow-turn-down"></i>
                            </span>
                        </i>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-12 col-md-4 col-lg-4 mb-3 mb-md-0">
                            <div class="card-step">
                                <img src="../../assets/img/fondos/momento1.webp" alt="Imagen 1">
                                <div class="card-info">
                                    <h3>1-Teoría del Manejo Defensivo</h3>
                                    <hr>
                                    <p>Empezaremos por recordar algunos conceptos clave del MANEJO DEFENSIVO y sus
                                        implicaciones para nuestro rol de
                                        conductores en el trabajo.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 mb-3 mb-md-0">
                            <div class="card-step">
                                <img src="../../assets/img/fondos/momento2.webp" alt="Imagen 2">
                                <div class="card-info">
                                    <h3>2-Buenos hábitos de Manejo Defensivo</h3>
                                    <hr>
                                    <p>Se abordarán las buenas prácticas en el manejo defensivo</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 mb-3 mb-md-0">
                            <div class="card-step">
                                <img src="../../assets/img/fondos/momento3.webp" alt="Imagen 3">
                                <div class="card-info">
                                    <h3>3-Factores para evitar Accidentes de Tránsito</h3>
                                    <hr>
                                    <p>Profundizaremos en los factores clave para evitar accidentes de tránsito.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
        <section class="mt-3">
            <p id="warning-msg" class="sf-msg sf-msg-warning">Por favor, revisa todas las secciones antes de comenzar el
                curso.
            </p>
            <p id="success-msg" class="sf-msg sf-msg-success hidden">¡Perfecto! Ya puedes comenzar tu curso.</p>

            <button class="sf-btn sf-btn-block sf-disabled" id="start-btn">
                <i class="fas fa-hand-pointer"></i> Comenzar el curso
            </button>
        </section>
    </div>

    <script src="script.js"></script>
    <script src="../../plugins/libs/component/slide_inicio.js"></script>
    <script src="../../plugins/libs/assetsWidget/js/widget.js"></script>
    <script src="lms.js"></script>
    <script>
        function isSCORMEnvironment() {
            return (typeof window.parent.API !== 'undefined') ||
                (typeof window.API !== 'undefined') ||
                (window !== window.top);
        }

        document.getElementById('start-btn').addEventListener('click', function () {
            window.location.href = '../leccion1/index.html';
        });

        function mostrarPaginaFinal() {
            document.body.innerHTML = \`
                <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f8f9fa; font-family: 'Montserrat', sans-serif; text-align: center; padding: 20px;">
                    <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 700px;">
                        <i class="fas fa-check-circle" style="font-size: 60px; color: #28a745; margin-bottom: 20px;"></i>
                        <h2 style="color: #333; margin-bottom: 20px; font-weight: 700;">¡Introducción Completada!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 0;">Por favor, cierre esta ventana para continuar con la lección 1.</p><br>
                        <img src="../inicio/introduccion_scorm.webp" class="mx-auto" alt="Guía">
                    </div>
                </div>
            \`;
        }

        function findAPI() {
            let api = null;
            let win = window;
            while (win && !api) {
                if (win.API) { api = win.API; break; }
                if (win.API_1484_11) { api = win.API_1484_11; break; }
                if (win.parent && win.parent !== win) { win = win.parent; } else { break; }
            }
            if (!api && window.opener) {
                win = window.opener;
                while (win && !api) {
                    if (win.API) { api = win.API; break; }
                    if (win.API_1484_11) { api = win.API_1484_11; break; }
                    if (win.parent && win.parent !== win) { win = win.parent; } else { break; }
                }
            }
            return api;
        }

        let initialized = false;
        window.addEventListener('load', function () {
            if (initialized) return;
            initialized = true;
            
            if (typeof changeTab === 'function') {
                changeTab(1);
            }
            localStorage.setItem('cursoProgreso', JSON.stringify({ currentIndex: 0, timestamp: new Date().toISOString() }));
        });
    </script>
</body>

</html>`
  }

  // Generate dynamic curso-config.js based on user input
  private generateDynamicCourseConfig(): TemplateFile {
    const lecciones: any = {}

    this.courseData.lessons.forEach((lesson, lessonIndex) => {
      const leccionKey = `leccion${lessonIndex + 1}`

      lecciones[leccionKey] = {
        nombre: lesson.name || `${lessonIndex + 1}° Lección sin nombre`,
        sliders: lesson.moments.map((moment, momentIndex) => ({
          router: `momento${lessonIndex + 1}_${momentIndex + 1}`,
          momento: lessonIndex + 1
        })),
        navegacion: {
          paginaAnterior: lessonIndex === 0 ? '../inicio/inicio.html' : `../leccion${lessonIndex}/evaluacion_leccion.html`,
          paginaSiguiente: './resumen_leccion.html',
          mostrarConfirmacion: false
        }
      }
    })

    const configContent = `// Configuración global del curso
const CURSO_CONFIG = {
  // Configuración de lecciones del curso
  lecciones: ${JSON.stringify(lecciones, null, 4)},

  // Función para obtener información de una lección específica
  getLeccion(leccionId) {
    return this.lecciones[leccionId] || null;
  },

  // Función para obtener todos los sliders de una lección
  getSliders(leccionId) {
    const leccion = this.getLeccion(leccionId);
    return leccion ? leccion.sliders : [];
  },

  // Función para obtener todos los momentos de una lección
  getMomentos(leccionId) {
    const leccion = this.getLeccion(leccionId);
    if (!leccion) return {};

    // Si la lección tiene momentos definidos, retornarlos
    if (leccion.momentos) {
      return leccion.momentos;
    }

    // Si no tiene momentos, crear uno usando el nombre de la lección
    // Obtener todos los momentos únicos de los sliders
    const momentosUnicos = [...new Set(leccion.sliders.map(slider => slider.momento))];
    const momentosGenerados = {};

    momentosUnicos.forEach(momentoId => {
      momentosGenerados[momentoId] = leccion.nombre;
    });

    return momentosGenerados;
  },

  // Función para obtener la configuración de navegación de una lección
  getNavegacion(leccionId) {
    const leccion = this.getLeccion(leccionId);
    if (leccion && leccion.navegacion) {
      return leccion.navegacion;
    }

    // Navegación por defecto si no está definida
    return {
      paginaAnterior: '../inicio/inicio.html',
      paginaSiguiente: './resumen_leccion.html',
      mostrarConfirmacion: false
    };
  },

  // Función para calcular el total de slides del curso
  getTotalSlidesCurso() {
    let total = 0;
    for (const leccionId in this.lecciones) {
      total += this.lecciones[leccionId].sliders.length;
    }
    return total;
  },

  // Función para obtener el total de slides de una lección específica
  getTotalSlidesLeccion(leccionId) {
    const leccion = this.getLeccion(leccionId);
    return leccion ? leccion.sliders.length : 0;
  },

  // Función para obtener todas las lecciones disponibles
  getAllLecciones() {
    return Object.keys(this.lecciones);
  },

  // Función para detectar la lección actual basada en la URL o contexto
  getLeccionActual() {
    // Detectar automáticamente basado en la URL
    const currentPath = window.location.pathname;

    ${this.courseData.lessons.map((_, index) =>
      `if (currentPath.includes('leccion${index + 1}')) return 'leccion${index + 1}';`
    ).join('\n    ')}

    // Por defecto, retornar leccion1
    return 'leccion1';
  }
};

// Exportar la configuración para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CURSO_CONFIG;
} else {
  window.CURSO_CONFIG = CURSO_CONFIG;
}`

    return {
      path: 'plugins/js/config/curso-config.js',
      content: configContent,
      type: "generate"
    }
  }

  // Generate lesson structure based on user configuration
  private generateLessonStructure(): TemplateFile[] {
    const files: TemplateFile[] = []

    this.courseData.lessons.forEach((lesson, lessonIndex) => {
      const leccionFolder = `leccion${lessonIndex + 1}`

      // Generate main lesson index
      files.push({
        path: `module/${leccionFolder}/index.html`,
        content: this.generateLessonIndex(lesson, lessonIndex),
        type: "generate"
      })

      // Generate moments for this lesson
      lesson.moments.forEach((moment, momentIndex) => {
        const momentFolder = `momento${lessonIndex + 1}_${momentIndex + 1}`

        files.push({
          path: `module/${leccionFolder}/${momentFolder}/index.html`,
          content: this.generateMomentHTML(lesson, moment, lessonIndex, momentIndex),
          type: "generate"
        })

        files.push({
          path: `module/${leccionFolder}/${momentFolder}/slider.css`,
          content: this.generateMomentCSS(),
          type: "generate"
        })

        files.push({
          path: `module/${leccionFolder}/${momentFolder}/slider.js`,
          content: this.generateMomentJS(),
          type: "generate"
        })
      })

      // Generate lesson summary and evaluation
      files.push({
        path: `module/${leccionFolder}/resumen_leccion.html`,
        content: this.generateLessonSummary(lesson, lessonIndex),
        type: "generate"
      })

      files.push({
        path: `module/${leccionFolder}/evaluacion_leccion.html`,
        content: this.generateLessonEvaluation(lesson, lessonIndex),
        type: "generate"
      })
    })

    return files
  }

  private generateLessonIndex(lesson: Lesson, lessonIndex: number): string {
    return `<!-- <?php
    require('../../../functions_helpers.php'); /*load helper*/
    check_session(); /*check session by employee */
    $course_code = $_GET['course_code']; /* recibir el código del curso */
    //$module_id        = __my_simple_crypt__($_GET['module'], 'd');
    $module_id = 54;
    $unique_course_id = check_permission_employee_course($course_code); /* Comprobar si el empleado tiene acceso al curso*/
    $extension_url = "?course_code=" . $course_code; /* variable url para pasar el código del curso*/
    
    
    $progress = progress_courses($course_code,$module_id);
    $firma =  image_profile($course_code);
   
?> -->
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- library bootstrap v.5.0.2 -->
    <script src="../../plugins/libs/jquery-3.3.1.js"></script>
    <link rel="stylesheet" type="text/css" href="../../plugins/libs/bootstrap/css/bootstrap.css">

    <script src="../../plugins/libs/bootstrap/js/bootstrap.bundle.js"></script>
    <script src="../../plugins/libs/bootstrap/js/custom-modal-handler.js"></script>
    <script src="../../plugins/js/touch-dnd.js"></script>
    
    <link rel="stylesheet" href="../../plugins/libs/animate/animate.min.css">
    
    <!-- library cascading style sheets -->
    <link rel="stylesheet" type="text/css" href="../../plugins/css/sofactia.css">
    <link rel="stylesheet" type="text/css" href="../../plugins/css/bg_img.css">
    <link rel="stylesheet" type="text/css" href="../../plugins/css/style.css">

    <link rel="stylesheet" type="text/css" href="../../plugins/libs/component/preloader/preloaders.css">
    <link rel="stylesheet" type="text/css" href="../../plugins/libs/component/transcripcion/transcripcion.css">

    <!--Tiporgraia Montserrat-->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">

    <!--Libreria iconos-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <!-- Estilos del widget -->
    <link rel="stylesheet" href="../../plugins/libs/assetsWidget/css/widget.css">
</head>

<body class="sf-scroll-y-hidden body-style" id="darkStyleImgSeccion">
    <input id='course_code' value="<?php echo $course_code;?>" hidden>
    <input id='module_id' value="<?php echo $module_id;?>" hidden>
    <input id='unique_course_id' value="<?php echo $unique_course_id ;?>" hidden>
    <input id='emp_unique_id' value="<?php echo $_SESSION['employee_data']['emp_unique_id'] ;?>" hidden>
    <!-- Header con el logo -->
    <header class="header">
        <div class="contentHeader bg-header-r">
            <div>
                <img src="../../assets/img/logo/logo-color.svg" alt="Orientación en prevención de riesgos"
                    class="logo logoTop">
                <div class="miga_pan">
                    <p id="breadcrumb"></p>
                </div>
                <div class="txPg">
                    <span id="textProg">1</span> / <span id="nSlider"></span>
                </div>
                <div class="txPg d-${lessonIndex === 0 ? 'lg' : 'xl'}-none" id="dropdownGripBtn">
                    <i class="fa-solid fa-grip"></i>
                </div>
            </div>

            <div class="d-${lessonIndex === 0 ? 'md' : 'lg'}-none text-center">
                <p class="mb-0" id="breadcrumb_movil"></p>
            </div>

            <div class="contCircleBar contCircleBar-nav-bar">
            </div>

            <div class="progBar progBar2">
                <div style="width: 10% !important;"></div>
            </div>
        </div>
    </header>
    <div class="dropdown-slider d-${lessonIndex === 0 ? 'md' : 'xl'}-none" id="dropdownSliderMenu">
    </div>
    <!-- content fluid -->
    <main class="container-fluid sf-container">
        <!-- content slider -->
        <div class="contentModule" id="slider-container"></div>
        <!-- end content fluid -->
    </main>
    <!-- navegación  -->
    <div class="btn-navigation-container">
        <button id="pagIndex" class="btn-navigation btn-navigation--prev" onclick="prevSlide()">
            <i class="fas fa-angle-left"></i> <span>Anterior</span>
        </button>
        <button id="next" class="btn-navigation btn-navigation--next" onclick="nextSlide()">
            <span>Siguiente</span> <i class="fas fa-angle-right"></i>
        </button>
    </div>
    <button id="btnParallaxMobile" class="btn-parallax-mobile ocultar d-block d-${lessonIndex === 0 ? 'md' : 'xl'}-none">
        <i class="fas fa-arrow-down"></i>
    </button>
    <!-- Agrega esto justo antes del cierre del body (antes de los scripts) -->
    <div id="transcripcion-global"></div>
    <footer>
        <!-- library javascript -->
        <!-- Configuración global del curso -->
        <script src="../../plugins/libs/component/transcripcion/transcripcion.js"></script>
        <script src="../../plugins/js/config/curso-config.js"></script>
        <script src="../../plugins/js/main.js"></script>
        <script src="../../plugins/js/modal-bg.js"></script>

        <script src="../../plugins/js/getProgressActivity.js"></script>
        <script src="../../plugins/js/trackingmanager_activities.js"></script>
        <script src="../../plugins/js/trackingmanagern3.js"></script>
        <script src="../../plugins/js/touch-dnd.js"></script>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <!-- Script del Widget -->
        <script src="../../plugins/libs/assetsWidget/js/widget.js"></script>

    </footer>
</body>

</html>`
  }

  private generateMomentHTML(lesson: Lesson, moment: Moment, lessonIndex: number, momentIndex: number): string {
    const templates = {
      slider: this.getSliderTemplate(lesson, moment, lessonIndex, momentIndex),
      video: this.getVideoTemplate(lesson, moment, lessonIndex, momentIndex),
      interactive: this.getInteractiveTemplate(lesson, moment, lessonIndex, momentIndex),
      quiz: this.getQuizTemplate(lesson, moment, lessonIndex, momentIndex)
    }

    return templates[moment.type] || templates.slider
  }

  private getSliderTemplate(lesson: Lesson, moment: Moment, lessonIndex: number, momentIndex: number): string {
    // Momentos regulares - vacíos inicialmente
    return `<!-- Momento vacío - usar editor visual para construir -->`
  }

  private getVideoTemplate(lesson: Lesson, moment: Moment, lessonIndex: number, momentIndex: number): string {
    return `<section class="row h-100">
  <div class="col-12">
    <h2>${moment.name || `Video ${momentIndex + 1}`}</h2>
    <div class="video-wrapper">
      <video controls>
        <source src="./video/video.mp4" type="video/mp4">
        Tu navegador no soporta el elemento video.
      </video>
    </div>
  </div>
</section>`
  }

  private getInteractiveTemplate(lesson: Lesson, moment: Moment, lessonIndex: number, momentIndex: number): string {
    const momentData = moment as any
    const hasImage = momentData.image
    const imageExtension = hasImage ? momentData.image.name.split('.').pop() : 'webp'
    const imagePath = hasImage ? `./img/img.${imageExtension}` : ''

    return `<section class="row h-100">
  <div class="col-12">
    <h2>${moment.name || `Actividad ${momentIndex + 1}`}</h2>
    <div class="interactive-content">
      <p>Actividad interactiva para: ${lesson.name}</p>
      ${hasImage ? `<div class="activity-image">
        <img src="${imagePath}" alt="Actividad" style="max-width: 100%; height: auto; border-radius: 8px;" />
      </div>` : ''}
      <div class="drag-drop-area">
        <!-- Contenido interactivo aquí -->
      </div>
    </div>
  </div>
</section>`
  }

  private getQuizTemplate(lesson: Lesson, moment: Moment, lessonIndex: number, momentIndex: number): string {
    return `<section class="row h-100">
  <div class="col-12">
    <h2>${moment.name || `Evaluación ${momentIndex + 1}`}</h2>
    <div class="quiz-content">
      <div class="question">
        <p>Pregunta de ejemplo para: ${lesson.name}</p>
      </div>
      <div class="options">
        <label><input type="radio" name="q1" value="a"> Opción A</label>
        <label><input type="radio" name="q1" value="b"> Opción B</label>
        <label><input type="radio" name="q1" value="c"> Opción C</label>
      </div>
    </div>
  </div>
</section>`
  }

  private generateMomentCSS(): string {
    return `/* Estilos para el momento */
.slider-container,
.video-container,
.interactive-container,
.quiz-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.slide-content,
.video-wrapper,
.interactive-content,
.quiz-content {
    margin-top: 20px;
}

.video-wrapper video {
    width: 100%;
    max-width: 800px;
}

.drag-drop-area {
    min-height: 200px;
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
}

.quiz-content .options {
    margin-top: 15px;
}

.quiz-content .options label {
    display: block;
    margin: 10px 0;
    cursor: pointer;
}`
  }

  private generateMomentJS(): string {
    return `export function init() {
  //--codigo dentro de la funcion init---//
  
}`
  }

  private generateLessonSummary(lesson: Lesson, lessonIndex: number): string {
    return `<!DOCTYPE html>
<html lang="es">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- library bootstrap v.5.0.2 -->
    <link rel="stylesheet" type="text/css" href="../../plugins/libs/bootstrap/css/bootstrap.css">

    <link rel="stylesheet" type="text/css" href="../../plugins/css/sofactia.css">

    <!--Montserrat-->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">

    <!--Libreria iconos-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Estilos del widget -->
    <link rel="stylesheet" href="../../plugins/libs/assetsWidget/css/widget.css">
</head>

<body class="sf-scroll-y-hidden sf-bg-dark">
    <!-- content fluid -->
    <div class="container-fluid pb-5 pb-md-0 px-0 px-md-5 py-0 text-center">
        <div class="row d-flex justify-content-center align-items-center sf-min-h-vh100 mx-5">
            <div class="col-lg-4 col-md-3 mt-5 my-md-0 px-0">
                <h1 class="sf-txt-1xl-700 sf-text-white">Resumen <span class="sf-text-purple">Lección ${lessonIndex + 1}</span></h1>
                <img class="mx-auto sf-img-40 sf-img-md-100 sf-img-sm-30"
                    src="../leccion${lessonIndex + 1}/gif/avatar_hombre_leer_cuaderno.gif" alt="avatar">
                <audio src="../leccion${lessonIndex + 1}/resumen-leccion-${lessonIndex + 1}.mp3" controls class="mt-3"></audio>
            </div>
            <div class="col-lg-8 col-md-9 mt-4 my-md-0">
                <div class="mx-md-5 mx-4 sf-lh-xs">
                    <p class="sf-text-white mb-2">¡Bien hecho! Has terminado la Lección ${lessonIndex + 1}</p>
                    <p class="sf-text-white mb-2">¡Revisemos este resumen de lo visto en esta lección!</p>
                    <embed src="../leccion${lessonIndex + 1}/doc/resumen_lecion${lessonIndex + 1}.pdf" type="application/pdf" class="pdf-viewer">
                    <a href="../leccion${lessonIndex + 1}/doc/resumen_lecion${lessonIndex + 1}.pdf" download="Resumen-Leccion-${lessonIndex + 1}.pdf"
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

    <script>
        function btnPrev() {
            const path = location.pathname.split("/").slice(0, -1).join("/");
            window.location.href = "./index.html";
        };

        function btnNext() {
            const path = location.pathname.split("/").slice(0, -1).join("/");
            window.location.href = "./evaluacion_leccion.html";
        };
    </script>
</body>

</html>`
  }

  private generateLessonEvaluation(lesson: Lesson, lessonIndex: number): string {
    const nextLesson = lessonIndex + 2
    return `<!DOCTYPE html>
<html lang="es">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- library bootstrap v.5.0.2 -->
    <link rel="stylesheet" type="text/css" href="../../plugins/libs/bootstrap/css/bootstrap.css">

    <!-- library cascading style sheets -->
    <link rel="stylesheet" type="text/css" href="../../plugins/css/sofactia.css">

    <!--Montserrat-->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">

    <!--Libreria iconos-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Estilos del widget -->
    <link rel="stylesheet" href="../../plugins/libs/assetsWidget/css/widget.css">

</head>

<body class="sf-scroll-y-hidden sf-bg-dark">
    <!-- Info usuario -->
    <input id='course_code' value="<?php echo $course_code;?>" hidden>
    <input id='module_id' value="<?php echo $module_id;?>" hidden>
    <input id='unique_course_id' value="<?php echo $unique_course_id ;?>" hidden>
    <input id='emp_unique_id' value="<?php echo $_SESSION['employee_data']['emp_unique_id'] ;?>" hidden>
    <!-- Header con el logo -->

    <!-- content fluid -->
    <div class="container-fluid pb-5 pb-md-0 px-0 px-md-5 py-0 text-center">
        <div class="row d-flex justify-content-center align-items-center sf-min-h-vh100 mx-5">
            <div class="col-lg-5 col-md-12 mt-5 my-md-0">
                <div class="ml-4">
                    <img src="../leccion${lessonIndex + 1}/gif/avatar_mujer_cuaderno.gif" alt="avatar"
                        class="mx-auto sf-img-40 sf-img-md-80 sf-img-sm-30">
                </div>
            </div>
            <div class="col-lg-7 col-md-12 mt-4 my-md-0">
                <div class="sf-mr-xl-p10 mr-md-5 mr-4 sf-lh-xs">
                    <h1 class="sf-txt-1xl-700 sf-text-white">Evaluación <span class="sf-text-purple">Lección ${lessonIndex + 1}</span>
                    </h1>
                    <div class="sf-bg-white border sf-bc-dark2 p-4 sf-br-r4 sf-m-r6">
                        <p><strong>Antes de continuar…</strong></p>
                        <p>¡Veamos qué tanto has aprendido… !
                            <br><br>
                            Te invitamos a presentar una breve evaluación, para identificar si necesitas repasar
                            algún contenido de la lección.
                            ¡Mucho éxito !
                            <br><br>
                        </p>

                        <button class="sf-btn sf-btn-purple" id="btnEvaluacion">
                            <i class="fas fa-clipboard"></i> Presentar Evaluación
                        </button>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="btn-navigation-container glass-back">
        <button id="pagIndex" class="btn-navigation btn-navigation--prev" onclick="btnPrev()">
            <i class="fas fa-angle-left"></i> <span>Anterior</span>
        </button>
    </div>

    <!--library javascript-->
    <script src="../../plugins/libs/jquery-3.3.1.js"></script>
    <!-- Script del Widget -->
    <script src="../../plugins/libs/assetsWidget/js/widget.js"></script>
    <!-- LMS SCORM Integration -->
    <script src="lms.js"></script>

    <script>
        function btnPrev() {
            const path = location.pathname.split("/").slice(0, -1).join("/");
            window.location.href = "./resumen_leccion.html";
        };

        function btnNext() {
            const path = location.pathname.split("/").slice(0, -1).join("/");
            window.location.href = "./../leccion${nextLesson}/index.html";
        };

        document.getElementById('btnEvaluacion').addEventListener('click', function () {
            window.location.href = '../leccion${nextLesson}/index.html';
        });

        function isSCORMEnvironment() {
            return (typeof window.parent.API !== 'undefined') ||
                (typeof window.API !== 'undefined') ||
                (window !== window.top);
        }

        function mostrarPaginaFinal() {
            document.body.innerHTML = \`
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #f8f9fa;
                    font-family: 'Montserrat', sans-serif;
                    text-align: center;
                    padding: 20px;
                ">
                    <div style="
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        max-width: 700px;
                    ">
                        <i class="fas fa-check-circle" style="
                            font-size: 60px;
                            color: #28a745;
                            margin-bottom: 20px;
                        "></i>
                        <h2 style="
                            color: #333;
                            margin-bottom: 20px;
                            font-weight: 700;
                        ">¡Muy bien! 🎉 <br> Has finalizado la Lección ${lessonIndex + 1}.</h2>
                        <p style="
                            color: #666;
                            font-size: 16px;
                            line-height: 1.5;
                            margin-bottom: 0;
                        ">Ahora continúa con la <strong>Evaluación Formativa</strong> para poner a prueba lo que aprendiste.
                        <br><br>
                        👉 Cierra esta ventana y sigue con el proceso.</p>
                        <br>
                        <img src="../leccion${lessonIndex + 1}/img/leccion${lessonIndex + 1}.webp" class="mx-auto " alt="Guía">
                    </div>
                </div>
            \`;
        }

        function presentarEvaluacion() {
            try {
                const api = findAPI();
                if (api) {
                    const initResult = api.LMSInitialize('');
                    console.log('Inicialización SCORM:', initResult);

                    const result1 = api.LMSSetValue('cmi.core.lesson_status', 'passed');
                    const result2 = api.LMSSetValue('cmi.core.score.raw', '100');
                    const result3 = api.LMSSetValue('cmi.core.score.min', '0');
                    const result4 = api.LMSSetValue('cmi.core.score.max', '100');

                    const commitResult = api.LMSCommit('');

                    console.log('Resultados SCORM:', { result1, result2, result3, result4, commitResult });

                    const errorCode = api.LMSGetLastError();
                    const errorString = api.LMSGetErrorString(errorCode);
                    console.log('Error SCORM:', errorCode, errorString);

                    const savedStatus = api.LMSGetValue('cmi.core.lesson_status');
                    const savedScore = api.LMSGetValue('cmi.core.score.raw');
                    console.log('Estado guardado:', savedStatus, 'Puntuación guardada:', savedScore);

                    const finishResult = api.LMSFinish('');
                    console.log('Finalización SCORM:', finishResult);

                    mostrarPaginaFinal();

                } else {
                    console.log('API SCORM no disponible - funcionando en modo standalone');
                    mostrarPaginaFinal();
                }
            } catch (error) {
                console.error('Error al comunicarse con SCORM:', error);
                mostrarPaginaFinal();
            }
        }

        function findAPI() {
            let api = null;
            let win = window;

            while (win && !api) {
                if (win.API) {
                    api = win.API;
                    break;
                }
                if (win.API_1484_11) {
                    api = win.API_1484_11;
                    break;
                }
                if (win.parent && win.parent !== win) {
                    win = win.parent;
                } else {
                    break;
                }
            }

            if (!api && window.opener) {
                win = window.opener;
                while (win && !api) {
                    if (win.API) {
                        api = win.API;
                        break;
                    }
                    if (win.API_1484_11) {
                        api = win.API_1484_11;
                        break;
                    }
                    if (win.parent && win.parent !== win) {
                        win = win.parent;
                    } else {
                        break;
                    }
                }
            }

            return api;
        }
    </script>

</body>

</html>`
  }
}

// Export function to use in API
export function generateCourseFromTemplate(courseData: CourseData): TemplateFile[] {
  const generator = new TemplateGenerator(courseData)
  return generator.generateCourseFromTemplate()
}
