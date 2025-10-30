"use client"

import { Type, Image, MousePointer, Table, Video, Puzzle, Music } from "lucide-react"

export function ComponentsPalette() {
  const components = [
    { id: "titulo", name: "Título", icon: <Type className="w-4 h-4" />, type: "titulo" },
    { id: "texto", name: "Texto (p)", icon: <Type className="w-4 h-4" />, type: "texto" },
    { id: "instruccion", name: "Instrucción", icon: <Type className="w-4 h-4" />, type: "instruccion" },
    { id: "image", name: "Imagen", icon: <Image className="w-4 h-4" />, type: "image" },
    { id: "audio", name: "Audio", icon: <Music className="w-4 h-4" />, type: "audio" },
    { id: "button", name: "Botón", icon: <MousePointer className="w-4 h-4" />, type: "button" },
    { id: "table", name: "Tabla", icon: <Table className="w-4 h-4" />, type: "table" },
    { id: "video", name: "Video", icon: <Video className="w-4 h-4" />, type: "video" },
    { id: "activity", name: "Actividad", icon: <Puzzle className="w-4 h-4" />, type: "activity" }
  ]

  return (
    <div className="space-y-2">
      {components.map((comp) => (
        <div
          key={comp.id}
          className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg cursor-move hover:bg-blue-50 hover:border-blue-300 border border-slate-200 transition-colors"
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
          <div className="text-blue-600">{comp.icon}</div>
          <span className="text-sm font-medium text-slate-700">{comp.name}</span>
        </div>
      ))}
    </div>
  )
}
