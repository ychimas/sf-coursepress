// Test script para probar el generador de plantillas
const { generateCourseFromTemplate } = require('./lib/template-generator.ts')

// Datos de ejemplo del curso
const courseData = {
  name: "Trabajo Seguro en Alturas",
  folderName: "trabajo-seguro-alturas",
  description: "Curso completo sobre seguridad en trabajos de altura",
  category: "Seguridad Industrial",
  lessons: [
    {
      id: 1,
      name: "Introducción al trabajo seguro en Alturas",
      moments: [
        { id: 1, type: "slider", name: "Conceptos básicos" },
        { id: 2, type: "video", name: "Video introductorio" },
        { id: 3, type: "slider", name: "Normativas aplicables" },
        { id: 4, type: "quiz", name: "Evaluación inicial" }
      ]
    },
    {
      id: 2,
      name: "Evaluación de riesgos y planificación",
      moments: [
        { id: 5, type: "slider", name: "Identificación de riesgos" },
        { id: 6, type: "interactive", name: "Actividad de evaluación" },
        { id: 7, type: "slider", name: "Planificación del trabajo" }
      ]
    }
  ]
}

// Generar archivos
try {
  const files = generateCourseFromTemplate(courseData)
  
  console.log('=== ARCHIVOS GENERADOS ===')
  files.forEach(file => {
    console.log(`\n📁 ${file.path}`)
    console.log(`Tipo: ${file.type}`)
    if (file.path.includes('curso-config.js')) {
      console.log('--- CONTENIDO ---')
      console.log(file.content.substring(0, 500) + '...')
    }
  })
  
  console.log(`\n✅ Total de archivos generados: ${files.length}`)
  
} catch (error) {
  console.error('❌ Error:', error)
}