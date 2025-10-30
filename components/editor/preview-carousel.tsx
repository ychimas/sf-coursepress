"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PreviewCarouselProps {
  moments: any[]
  currentIndex: number
  onIndexChange: (index: number) => void
  onClose: () => void
  loadMomentHtml: (momentId: string) => Promise<string>
}

export function PreviewCarousel({ moments, currentIndex, onIndexChange, onClose, loadMomentHtml }: PreviewCarouselProps) {
  const [htmlContent, setHtmlContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadContent = async () => {
      if (moments.length === 0) return
      setIsLoading(true)
      const html = await loadMomentHtml(moments[currentIndex].id)
      setHtmlContent(html)
      setIsLoading(false)
    }
    loadContent()
  }, [currentIndex, moments, loadMomentHtml])

  const handlePrev = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < moments.length - 1) {
      onIndexChange(currentIndex + 1)
    }
  }

  if (moments.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-slate-600 mb-4">No hay momentos guardados para previsualizar</p>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
            Cerrar
          </Button>
        </div>
      </div>
    )
  }

  const currentMoment = moments[currentIndex]

  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 z-10">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-semibold text-white">
              {currentMoment.lessonName} - {currentMoment.name}
            </h3>
            <span className="text-xs text-slate-400">
              {currentIndex + 1} / {moments.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-slate-800 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {currentIndex < moments.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Content */}
      <div className="w-full h-full pt-12 pb-4 px-4">
        <div className="w-full h-full bg-white overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando momento...</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
              <style>{`
                .container-fluid { padding: 0; height: 100%; }
                .row { height: 100%; margin: 0; }
                .row > div { min-height: 100%; }
                .sf-bg-dark { background: #0F172A; }
                .sf-cl-row { color: white; padding: 2rem; min-height: 100%; }
                .sf-cr-row { background: #f8fafc; padding: 2rem; min-height: 100%; }
                .sf-cb-row { background: white; padding: 2rem; min-height: 100%; }
                .sf-text-white { color: white !important; }
                .sf-text-purple { color: #7c3aed !important; }
                .sf-txt-800 { font-weight: 800; }
                .sf-btn { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
                .sf-btn-purple { background: #7c3aed; color: white; }
                .sf-img-80 { width: 80px; height: 80px; border-radius: 50%; }
                .responsive-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
                .responsive-table th, .responsive-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .responsive-table th { background-color: #f2f2f2; }
                .activity-container-img { background: #f8f9fa; padding: 2rem; border-radius: 12px; }
                .animate__animated { animation-duration: 1s; }
                .animate__fadeInLeftBig { animation-name: fadeInLeft; }
                .animate__fadeInRightBig { animation-name: fadeInRight; }
                @keyframes fadeInLeft { from { opacity: 0; transform: translate3d(-100%, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
                @keyframes fadeInRight { from { opacity: 0; transform: translate3d(100%, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
              `}</style>
              <div className="container-fluid">
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
