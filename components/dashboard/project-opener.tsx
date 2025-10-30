"use client"

import { useState } from "react"
import { FolderOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProjectManager } from "@/lib/project-manager"

interface ProjectOpenerProps {
  onProjectAdded: () => void
}

export function ProjectOpener({ onProjectAdded }: ProjectOpenerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [projectPath, setProjectPath] = useState("")
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")

  const handlePathChange = (path: string) => {
    setProjectPath(path)
    const folderName = path.split('\\').pop() || path.split('/').pop() || ''
    if (folderName && !projectName) {
      setProjectName(folderName)
    }
  }

  const handleAddProject = () => {
    if (!projectPath || !projectName) return

    ProjectManager.addProject({
      name: projectName,
      path: projectPath,
      description: projectDescription,
      lessons: 0
    }, true) // true indica que es un proyecto existente

    setIsOpen(false)
    setProjectPath("")
    setProjectName("")
    setProjectDescription("")
    onProjectAdded()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <FolderOpen className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Abrir Proyecto Existente</span>
          <span className="sm:hidden">Abrir Proyecto</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Abrir Proyecto de Curso</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Ruta Completa del Proyecto</Label>
            <Input
              value={projectPath}
              onChange={(e) => handlePathChange(e.target.value)}
              placeholder="C:\\Users\\USUARIO\\Downloads\\trabajo-pruebas"
              className="mt-1 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ingresa la ruta completa donde descomprimiste el curso
            </p>
          </div>
          
          <div>
            <Label>Nombre del Proyecto</Label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Nombre para mostrar en el dashboard"
            />
          </div>
          
          <div>
            <Label>Descripción (opcional)</Label>
            <Input
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Descripción del curso"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddProject} disabled={!projectPath || !projectName}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Proyecto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}