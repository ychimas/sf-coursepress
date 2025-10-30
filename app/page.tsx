'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Index() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: "⚡",
      title: "Estructura Automática",
      description: "Genera automáticamente toda la estructura de archivos y carpetas SCORM necesaria para tu curso."
    },
    {
      icon: "💻",
      title: "Configuración Flexible",
      description: "Personaliza cada aspecto de tu curso: lecciones, momentos, tipos de contenido y evaluaciones."
    },
    {
      icon: "📘",
      title: "Código Reutilizable",
      description: "Plantillas profesionales listas para usar con integración SCORM 1.2 completa y tracking automático."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Configurar",
      description: "Ingresa la información básica de tu curso: nombre, descripción y categoría."
    },
    {
      number: "02",
      title: "Personalizar",
      description: "Define la estructura: lecciones, momentos y tipos de contenido (Actividades, Videos, Audios, Evaluaciones)."
    },
    {
      number: "03",
      title: "Generar",
      description: "Obtén automáticamente todos los archivos SCORM listos para subir a tu LMS."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo-color.svg" alt="SF CoursePress" className="h-10" />
              <span className="text-2xl font-bold text-gray-900">SF CoursePress</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#caracteristicas" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">Características</a>
              <a href="#como-funciona" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">Cómo Funciona</a>
              <a href="#arquitectura" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">Arquitectura</a>
              <Link href="/dashboard">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap">
                  Ir al Dashboard
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Crea Cursos
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent"> E-Learning</span>
                <br />Profesionales en Minutos
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                La plataforma definitiva para generar cursos SCORM completos sin conocimientos técnicos. Estructura automática, configuración flexible y código listo para usar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/dashboard">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 whitespace-nowrap">
                    Comenzar Ahora
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/hero-main.png"
                  alt="SF CoursePress Dashboard"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-blue-100 rounded-full"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-1/2"></div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/hero-preview.png"
                  alt="Curso SCORM Preview"
                  className="w-32 h-20 object-cover rounded"
                />
                <p className="text-xs text-gray-600 mt-2 font-medium">Curso Generado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-mono text-gray-500 mb-4 uppercase tracking-wider">[VE TU CURSO EN ACCIÓN]</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              De la configuración
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                al código listo
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              SF CoursePress genera automáticamente toda la estructura SCORM con código profesional y optimizado.
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Contenedor principal con bordes y sombras */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 p-8">
              {/* Aquí va tu imagen */}
              <div className="bg-gray-800 rounded-xl border-2 border-gray-700 overflow-hidden">
                <img
                  src="/img-code.png"
                  alt="Código SCORM generado"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Elementos decorativos flotantes */}
            <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold animate-pulse">
              Generación instantánea
            </div>
            <div className="absolute -bottom-4 -left-4 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold">
              Listo para LMS
            </div>
          </div>

          {/* Características rápidas */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Código limpio y optimizado</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">&lt;2min</div>
              <div className="text-gray-600">Tiempo de generación</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-gray-600">Conocimientos técnicos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Características Destacadas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todo lo que necesitas para crear cursos e-learning profesionales
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden">
            <img
              src="/hero-dashboard.png"
              alt="Dashboard SF CoursePress"
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Workspace Completo</h3>
              <p className="text-gray-600 text-lg">
                Ambiente de trabajo diseñado para maximizar tu productividad en la creación de cursos profesionales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cómo Funciona</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tres simples pasos para crear tu curso profesional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/proceso-creacion.png"
                alt="Proceso de Creación"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Creación Simplificada</h3>
              <p className="text-lg text-gray-600 mb-6">
                Sistema intuitivo que te guía paso a paso en la creación de tu curso SCORM, desde la configuración inicial hasta la descarga del paquete completo.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  Interfaz visual intuitiva
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  Plantillas predefinidas
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  Exportación instantánea
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="arquitectura" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Arquitectura SCORM Completa</h2>
              <p className="text-lg text-gray-600 mb-8">
                Genera paquetes SCORM 1.2 completamente compatibles con todos los LMS del mercado.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">Estructura de archivos optimizada</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">Manifiestos XML automáticos</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">API de comunicación integrada</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">Seguimiento de progreso avanzado</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">Responsive design incluido</span>
                </div>
              </div>

              <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap">
                Ver Documentación Técnica
              </button>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 ml-4 text-sm">Estructura SCORM</span>
              </div>

              <div className="font-mono text-sm space-y-2">
                <div className="flex items-center text-yellow-400">
                  <span>📁 mi-curso/</span>
                </div>
                <div className="flex items-center text-blue-400 ml-4">
                  <span>📄 imsmanifest.xml</span>
                </div>
                <div className="flex items-center text-green-400 ml-4">
                  <span>📄 curso-config.js</span>
                </div>
                <div className="flex items-center text-yellow-400 ml-4">
                  <span>📁 css/</span>
                </div>
                <div className="flex items-center text-green-400 ml-8">
                  <span>📄 main.css</span>
                </div>
                <div className="flex items-center text-yellow-400 ml-4">
                  <span>📁 js/</span>
                </div>
                <div className="flex items-center text-purple-400 ml-8">
                  <span>📄 navegacion.js</span>
                </div>
                <div className="flex items-center text-purple-400 ml-8">
                  <span>📄 scorm-api.js</span>
                </div>
                <div className="flex items-center text-yellow-400 ml-4">
                  <span>📁 lecciones/</span>
                </div>
                <div className="flex items-center text-green-400 ml-8">
                  <span>📄 leccion-1-momento-1.html</span>
                </div>
                <div className="flex items-center text-green-400 ml-8">
                  <span>📄 leccion-1-momento-2.html</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
                <p className="text-blue-300 text-xs">
                  ✨ Estructura generada automáticamente por SF CoursePress
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Examples */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ejemplos de Cursos Generados</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mira cómo se ven los cursos creados con SF CoursePress en diferentes dispositivos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src="/curso-desktop.png"
                alt="Curso en Desktop"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Versión Desktop</h3>
                <p className="text-gray-600">Experiencia completa con todas las funcionalidades</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src="/curso-tablet.png"
                alt="Curso en Tablet"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Versión Tablet</h3>
                <p className="text-gray-600">Optimizado para dispositivos táctiles</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src="/curso-movil.png"
                alt="Curso en Móvil"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Versión Móvil</h3>
                <p className="text-gray-600">Aprendizaje sobre la marcha</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Comienza a Crear Hoy</h2>
          <p className="text-xl mb-8 opacity-90">
            Genera tu primer curso SCORM profesional en minutos
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap">
                Comenzar Gratis
              </button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">SCORM 1.2</div>
              <div className="opacity-80">Compatible</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">3 Tipos</div>
              <div className="opacity-80">De Momentos</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="opacity-80">Personalizable</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/accions-sofactia-blanco.png" alt="SF CoursePress" className="h-8" />
              </div>
              <p className="text-gray-400">
                Plataforma profesional para crear cursos SCORM sin conocimientos técnicos.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navegación</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#caracteristicas" className="hover:text-white transition-colors cursor-pointer">Características</a></li>
                <li><a href="#como-funciona" className="hover:text-white transition-colors cursor-pointer">Cómo Funciona</a></li>
                <li><a href="#arquitectura" className="hover:text-white transition-colors cursor-pointer">Arquitectura</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentación</li>
                <li>Tutoriales</li>
                <li>Estado del Sistema</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>(+1) 407 789 6767</li>
                <li>(+56) 232 367155</li>
                <li><a href="https://www.sofactia.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">www.sofactia.com</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 SF CoursePress. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
