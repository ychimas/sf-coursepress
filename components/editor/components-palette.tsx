"use client"

import { useState } from "react"
import { Type, Image, MousePointer, Table, Video, Puzzle, Music, ChevronDown, ChevronRight, List, Images } from "lucide-react"

interface Category {
  id: string
  name: string
  components: Component[]
}

interface Component {
  id: string
  name: string
  icon: React.ReactNode
  type: string
}

export function ComponentsPalette() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["content"])

  const categories: Category[] = [
    {
      id: "content",
      name: "Contenido",
      components: [
        { id: "titulo", name: "Título", icon: <Type className="w-5 h-5" />, type: "titulo" },
        { id: "texto", name: "Texto", icon: <Type className="w-5 h-5" />, type: "texto" },
        { id: "instruccion", name: "Instrucción", icon: <Type className="w-5 h-5" />, type: "instruccion" },
      ]
    },
    {
      id: "media",
      name: "Multimedia",
      components: [
        { id: "image", name: "Imagen", icon: <Image className="w-5 h-5" />, type: "image" },
        { id: "video", name: "Video", icon: <Video className="w-5 h-5" />, type: "video" },
        { id: "audio", name: "Audio", icon: <Music className="w-5 h-5" />, type: "audio" },
        { id: "gallery", name: "Galería", icon: <Images className="w-5 h-5" />, type: "gallery" },
      ]
    },
    {
      id: "interactive",
      name: "Interactivos",
      components: [
        { id: "button", name: "Botón", icon: <MousePointer className="w-5 h-5" />, type: "button" },
        { id: "table", name: "Tabla", icon: <Table className="w-5 h-5" />, type: "table" },
        { id: "activity", name: "Actividad", icon: <Puzzle className="w-5 h-5" />, type: "activity" },
        { id: "accordion", name: "Acordeón", icon: <List className="w-5 h-5" />, type: "accordion" },
      ]
    }
  ]

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <div key={category.id} className="border-b border-gray-100 last:border-0">
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700">{category.name}</span>
            {expandedCategories.includes(category.id) ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {expandedCategories.includes(category.id) && (
            <div className="pb-2">
              {category.components.map((comp) => (
                <div
                  key={comp.id}
                  className="flex items-center gap-3 px-4 py-3 mx-2 mb-1 bg-white rounded-lg border border-gray-200 cursor-move hover:bg-gray-50 transition-colors"
                  draggable
                  onDragStart={(e) => {
                    const cleanComp = {
                      id: comp.id,
                      name: comp.name,
                      type: comp.type
                    }
                    e.dataTransfer.setData('component', JSON.stringify(cleanComp))
                  }}
                >
                  <div className="text-gray-600">{comp.icon}</div>
                  <span className="text-sm font-light text-gray-700">{comp.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
