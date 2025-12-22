"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface ComponentEditorProps {
  component: any
  onUpdate: (updatedComponent: any) => void
  onClose: () => void
  projectId?: string
  momentId?: string
}

export function ComponentEditor({ component, onUpdate, onClose, projectId, momentId }: ComponentEditorProps) {
  const [formData, setFormData] = useState({
    text: component.text || '',
    subtitle: component.subtitle || '',
    highlight: component.highlight || '',
    src: component.src || '',
    imageFile: null as File | null,
    audioFile: null as File | null,
    transcription: component.transcription || '[]',
    theme: component.theme || 'dark',
    activityType: component.activityType || '',
    activityData: component.activityData || { text: '', selects: [], globalOptions: [] },
    accordionItems: component.accordionItems || [{ title: '', content: '' }],
    galleryImages: component.galleryImages || []
  })

  const [newOption, setNewOption] = useState('')
  const [avatarImages, setAvatarImages] = useState<Array<{ name: string }>>([])
  const [loadingAvatars, setLoadingAvatars] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [imagePickerTab, setImagePickerTab] = useState<string>('local')
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [selectedItemAvatars, setSelectedItemAvatars] = useState<Record<number, string>>({})

  const loadAvatars = async () => {
    if (!projectId) return
    setLoadingAvatars(true)
    setAvatarError(null)
    try {
      const res = await fetch('/api/avatars/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      })
      if (!res.ok) throw new Error('No se pudo cargar Mis imágenes')
      const data = await res.json()
      setAvatarImages(data.images || [])
    } catch (e) {
      setAvatarError('Error cargando Mis imágenes')
    } finally {
      setLoadingAvatars(false)
    }
  }

  useEffect(() => {
    loadAvatars()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = () => {
    if (component.type === 'image' && formData.imageFile) {
      onUpdate({ ...component, src: formData.src, imageFile: formData.imageFile })
    } else if (component.type === 'audio' && formData.audioFile) {
      onUpdate({ ...component, src: formData.src, audioFile: formData.audioFile, transcription: formData.transcription })
    } else {
      onUpdate({ ...component, ...formData })
    }
    onClose()
  }

  const renderFields = () => {
    switch (component.type) {
      case 'titulo':
        return (
          <>
            <div>
              <Label>Título Principal</Label>
              <Input
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Bienvenidos al módulo"
              />
            </div>
            <div>
              <Label>Subtítulo (morado)</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Trabajo Seguro en Alturas"
              />
            </div>
          </>
        )
      case 'texto':
        return (
          <>
            <div>
              <Label>Tema de Color</Label>
              <select
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dark">Dark (Texto Blanco)</option>
                <option value="light">Light (Texto Negro)</option>
              </select>
            </div>
            <div>
              <Label>Texto Resaltado (negrita)</Label>
              <Input
                value={formData.highlight}
                onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                placeholder="¡Bienvenidas y bienvenidos!"
              />
            </div>
            <div>
              <Label>Texto Principal</Label>
              <Textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Este curso está diseñado para..."
                rows={4}
              />
            </div>
          </>
        )
      case 'instruccion':
        return (
          <div>
            <Label>Texto de Instrucción</Label>
            <Input
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Haz clic para escuchar el audio"
            />
          </div>
        )
      case 'image':
        return (
          <div>
            <Tabs value={imagePickerTab} onValueChange={setImagePickerTab} className="mt-3">
              <TabsList className="w-full grid grid-cols-2 gap-2 bg-white border border-slate-200 rounded-full mb-4">
                <TabsTrigger value="local" className="px-3 py-1 rounded-full text-slate-700 transition hover:bg-slate-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md">Imagen local</TabsTrigger>
                <TabsTrigger value="mis" className="px-3 py-1 rounded-full text-slate-700 transition hover:bg-slate-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md">Mis imágenes</TabsTrigger>
              </TabsList>
              <TabsContent value="local" className="mt-3">
                <Label>Importar Imagen</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setFormData({ ...formData, imageFile: file, src: file.name })
                    }
                  }}
                  className="cursor-pointer"
                />
                {formData.src && (
                  <p className="text-xs text-gray-500 mt-2">Archivo: {formData.src}</p>
                )}
              </TabsContent>
              <TabsContent value="mis" className="mt-3">
                {avatarError && <p className="text-xs text-red-600">{avatarError}</p>}
                <div className="grid grid-cols-3 gap-4 max-h-80 min-h-48 overflow-y-auto border p-3 rounded bg-slate-50">
                  {loadingAvatars ? (
                    <p className="text-xs text-gray-500">Cargando...</p>
                  ) : (
                    avatarImages.map((img) => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => setSelectedAvatar(img.name)}
                        className={`border rounded p-2 flex flex-col items-center gap-2 ${selectedAvatar === img.name ? 'ring-2 ring-blue-600' : ''}`}
                      >
                        <img src={`/api/avatars/get?projectId=${projectId}&name=${encodeURIComponent(img.name)}`} alt={img.name} className="w-24 h-24 object-cover rounded" />
                        <div className="text-[10px] text-gray-600">{img.name}</div>
                      </button>
                    ))
                  )}
                </div>
                <div className="mt-3">
                  <Button
                    type="button"
                    disabled={!selectedAvatar}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      if (!selectedAvatar) return
                      setFormData({ ...formData, src: `../../assets/img/avatars/${selectedAvatar}`, imageFile: null })
                    }}
                  >Aceptar</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )
      case 'audio':
        return (
          <>
            <div>
              <Label>Importar Audio</Label>
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setFormData({ ...formData, audioFile: file, src: file.name })
                  }
                }}
                className="cursor-pointer"
              />
              {formData.src && (
                <p className="text-xs text-gray-500 mt-2">Archivo: {formData.src}</p>
              )}
            </div>
            <div>
              <Label>Transcripción (JSON)</Label>
              <Textarea
                value={formData.transcription}
                onChange={(e) => setFormData({ ...formData, transcription: e.target.value })}
                placeholder='[{"end":2.16,"start":0,"text":"Texto aquí"}]'
                rows={6}
                className="font-mono text-xs"
              />
              <p className="text-xs text-gray-500 mt-1">Pega el array JSON con la transcripción</p>
            </div>
          </>
        )
      case 'accordion':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">💡 Acordeón Interactivo</p>
              <p className="text-gray-700">Crea secciones expandibles con títulos y contenido. Perfecto para mostrar información organizada.</p>
            </div>
            
            <div>
              <Label>Items del Acordeón</Label>
              <div className="space-y-3">
                {formData.accordionItems.map((item: any, index: number) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-sm">Item {index + 1}</h4>
                      {formData.accordionItems.length > 1 && (
                        <button
                          onClick={() => {
                            const newItems = formData.accordionItems.filter((_: any, i: number) => i !== index)
                            setFormData({ ...formData, accordionItems: newItems })
                          }}
                          className="text-red-600 hover:text-red-800 font-bold px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        value={item.title || ''}
                        onChange={(e) => {
                          const newItems = [...formData.accordionItems]
                          newItems[index] = { ...newItems[index], title: e.target.value }
                          setFormData({ ...formData, accordionItems: newItems })
                        }}
                        placeholder="Título del acordeón"
                        className="font-medium"
                      />
                      <Textarea
                        value={item.content || ''}
                        onChange={(e) => {
                          const newItems = [...formData.accordionItems]
                          newItems[index] = { ...newItems[index], content: e.target.value }
                          setFormData({ ...formData, accordionItems: newItems })
                        }}
                        placeholder="Contenido del acordeón"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => {
                    const newItems = [...formData.accordionItems, { title: '', content: '' }]
                    setFormData({ ...formData, accordionItems: newItems })
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  + Agregar Item
                </Button>
              </div>
            </div>
          </div>
        )
      case 'gallery':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">🖼️ Galería de Imágenes</p>
              <p className="text-gray-700">Crea una galería animada con hasta 7 imágenes. Las imágenes se mostrarán con animaciones automáticas.</p>
            </div>
            
            <div>
              <Label>Imágenes de la Galería (máximo 7)</Label>
              <div className="space-y-3">
                {formData.galleryImages.map((img: any, index: number) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-sm">Imagen {index + 1}</h4>
                      {formData.galleryImages.length > 1 && (
                        <button
                          onClick={() => {
                            const newImages = formData.galleryImages.filter((_: any, i: number) => i !== index)
                            setFormData({ ...formData, galleryImages: newImages })
                          }}
                          className="text-red-600 hover:text-red-800 font-bold px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <Tabs className="mt-1">
                      <TabsList className="w-full grid grid-cols-2 gap-2 bg-white border border-slate-200 rounded-full mb-3">
                        <TabsTrigger value="local" className="px-3 py-1 rounded-full text-slate-700 transition hover:bg-slate-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md">Imagen local</TabsTrigger>
                        <TabsTrigger value="mis" className="px-3 py-1 rounded-full text-slate-700 transition hover:bg-slate-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md">Mis imágenes</TabsTrigger>
                      </TabsList>
                      <TabsContent value="local" className="mt-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const newImages = [...formData.galleryImages]
                              newImages[index] = { imageFile: file, src: file.name }
                              setFormData({ ...formData, galleryImages: newImages })
                            }
                          }}
                          className="cursor-pointer"
                        />
                        {img.src && (
                          <p className="text-xs text-gray-500 mt-1">Archivo: {img.src}</p>
                        )}
                      </TabsContent>
                      <TabsContent value="mis" className="mt-2">
                        <div className="grid grid-cols-3 gap-3 max-h-64 min-h-40 overflow-y-auto border p-2 rounded bg-slate-50">
                          {avatarImages.map((avatarImg) => (
                            <button
                              key={avatarImg.name}
                              className={`border rounded p-2 ${selectedItemAvatars[index] === avatarImg.name ? 'ring-2 ring-blue-600' : ''}` }
                              onClick={() => {
                                setSelectedItemAvatars({ ...selectedItemAvatars, [index]: avatarImg.name })
                              }}
                            >
                              <img src={`/api/avatars/get?projectId=${projectId}&name=${encodeURIComponent(avatarImg.name)}`} alt={avatarImg.name} className="w-20 h-20 object-cover rounded" />
                              <div className="text-[10px] text-gray-600">{avatarImg.name}</div>
                            </button>
                          ))}
                        </div>
                        <div className="mt-2">
                          <Button
                            type="button"
                            size="sm"
                            disabled={!selectedItemAvatars[index]}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                            onClick={() => {
                              const name = selectedItemAvatars[index]
                              if (!name) return
                              const newImages = [...formData.galleryImages]
                              newImages[index] = { src: `../../assets/img/avatars/${name}`, imageFile: null }
                              setFormData({ ...formData, galleryImages: newImages })
                            }}
                          >Aceptar</Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                ))}
                {formData.galleryImages.length < 7 && (
                  <Button
                    type="button"
                    onClick={() => {
                      const newImages = [...formData.galleryImages, { src: '', imageFile: null }]
                      setFormData({ ...formData, galleryImages: newImages })
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    + Agregar Imagen
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      case 'button':
        return (
          <div>
            <Label>Texto del Botón</Label>
            <Input
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Actividad"
            />
          </div>
        )
      case 'activity':
        if (!formData.activityType) {
          return (
            <div>
              <Label className="mb-3">Selecciona el tipo de actividad</Label>
              <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {[
                  { id: 'select-text', name: 'Select Texto', icon: '📝' },
                  { id: 'ordenar-pasos', name: 'Ordenar Pasos', icon: '🔢' },
                  { id: 'verdadero-falso', name: 'Verdadero o Falso', icon: '✓✗' },
                  { id: 'quiz', name: 'Quiz Interactivo', icon: '❓' },
                  { id: 'drag-clasificar', name: 'Arrastrar y Clasificar', icon: '🎯' },
                  { id: 'select-imagen', name: 'Selección con Imágenes', icon: '🖼️' },
                  { id: 'hotspot', name: 'Puntos Calientes', icon: '📍' },
                  { id: 'memory', name: 'Memoria', icon: '🧠' },
                ].map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => {
                      const initialData = activity.id === 'drag-clasificar'
                        ? { categorias: ['Categoría 1', 'Categoría 2'], items: [] }
                        : activity.id === 'select-imagen'
                          ? { opciones: ['Opción 1', 'Opción 2', 'Opción 3'], items: [] }
                          : { text: '', selects: [] }
                      setFormData({ ...formData, activityType: activity.id, activityData: initialData })
                    }}
                    className="p-4 border-2 rounded-lg transition-all hover:border-blue-500 hover:bg-blue-50 border-gray-200"
                  >
                    <div className="text-3xl mb-2">{activity.icon}</div>
                    <div className="text-sm font-medium text-gray-700">{activity.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )
        }

        if (formData.activityType === 'select-text') {
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Configurar Select Texto</h3>
                <button
                  onClick={() => setFormData({ ...formData, activityType: '', activityData: { text: '', selects: [] } })}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Cambiar actividad
                </button>
              </div>

              <div>
                <Label>Tema de Color del Texto</Label>
                <select
                  value={formData.activityData?.theme || 'light'}
                  onChange={(e) => setFormData({ ...formData, activityData: { ...formData.activityData, theme: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dark">Dark (Texto Blanco)</option>
                  <option value="light">Light (Texto Negro)</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">💡 Cómo usar:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Agrega las opciones globales abajo</li>
                  <li>Escribe tu texto con <code className="bg-white px-1 rounded">{'{{}}'}</code> donde van los selects</li>
                  <li>Para cada SELECT, elige cuál es la respuesta correcta</li>
                </ol>
              </div>

              <div>
                <Label>Opciones Globales (para todos los selects)</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (newOption.trim()) {
                          const newGlobalOptions = [...(formData.activityData?.globalOptions || []), newOption.trim()]
                          setFormData({
                            ...formData,
                            activityData: { ...formData.activityData, globalOptions: newGlobalOptions }
                          })
                          setNewOption('')
                        }
                      }
                    }}
                    placeholder="Escribe una opción y presiona Enter"
                    className="text-sm"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newOption.trim()) {
                        const newGlobalOptions = [...(formData.activityData?.globalOptions || []), newOption.trim()]
                        setFormData({
                          ...formData,
                          activityData: { ...formData.activityData, globalOptions: newGlobalOptions }
                        })
                        setNewOption('')
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Agregar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.activityData?.globalOptions || []).map((opt: string, i: number) => (
                    <div key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <span>{opt}</span>
                      <button
                        onClick={() => {
                          const newGlobalOptions = formData.activityData.globalOptions.filter((_: any, idx: number) => idx !== i)
                          setFormData({
                            ...formData,
                            activityData: { ...formData.activityData, globalOptions: newGlobalOptions }
                          })
                        }}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Texto de la actividad</Label>
                <Textarea
                  value={formData.activityData?.text || ''}
                  onChange={(e) => {
                    const text = e.target.value
                    const selectCount = (text.match(/\{\{\}\}/g) || []).length
                    const currentSelects = formData.activityData?.selects || []
                    const newSelects = Array(selectCount).fill(null).map((_, i) =>
                      currentSelects[i] || { correct: 0 }
                    )
                    setFormData({
                      ...formData,
                      activityData: { ...formData.activityData, text, selects: newSelects }
                    })
                  }}
                  placeholder="Ejemplo: Un entorno laboral {{}} no solo protege a las personas trabajadoras."
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  SELECTs detectados: {(formData.activityData?.text?.match(/\{\{\}\}/g) || []).length}
                </p>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {formData.activityData?.selects?.map((select: any, index: number) => {
                  // Obtener opciones ya seleccionadas en otros selects
                  const selectedInOthers = formData.activityData.selects
                    .map((s: any, i: number) => i !== index ? s.correct : null)
                    .filter((v: any) => v !== null)

                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h4 className="font-semibold mb-3">SELECT #{index + 1}</h4>
                      <div>
                        <Label className="text-sm">Respuesta correcta</Label>
                        <select
                          value={select.correct !== undefined && select.correct !== null ? select.correct : ''}
                          onChange={(e) => {
                            const newSelects = [...formData.activityData.selects]
                            newSelects[index] = { correct: e.target.value === '' ? 0 : parseInt(e.target.value) }
                            setFormData({
                              ...formData,
                              activityData: { ...formData.activityData, selects: newSelects }
                            })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">Seleccione...</option>
                          {(formData.activityData?.globalOptions || []).map((opt: string, i: number) => {
                            const isSelected = selectedInOthers.includes(i)
                            return (
                              <option key={i} value={i} disabled={isSelected} style={{ color: isSelected ? '#ccc' : 'inherit' }}>
                                {opt} {isSelected ? '(ya seleccionada)' : ''}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

        if (formData.activityType === 'select-imagen') {
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Configurar Selección con Imágenes</h3>
                <button
                  onClick={() => setFormData({ ...formData, activityType: '', activityData: { items: [], opciones: [] } })}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Cambiar actividad
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">💡 Cómo usar:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Define las opciones disponibles</li>
                  <li>Agrega items con imagen, descripción y respuesta correcta</li>
                  <li>El usuario selecciona la opción correcta para cada item</li>
                </ol>
              </div>

              <div>
                <Label>Opciones Disponibles</Label>
                <div className="space-y-2 mb-4">
                  {(formData.activityData?.opciones || []).map((opc: string, index: number) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={opc}
                        onChange={(e) => {
                          const newOpciones = [...(formData.activityData?.opciones || [])]
                          newOpciones[index] = e.target.value
                          setFormData({
                            ...formData,
                            activityData: { ...formData.activityData, opciones: newOpciones }
                          })
                        }}
                        placeholder={`Opción ${index + 1}`}
                        className="flex-1"
                      />
                      {(formData.activityData?.opciones?.length || 0) > 2 && (
                        <button
                          onClick={() => {
                            const newOpciones = formData.activityData.opciones.filter((_: any, i: number) => i !== index)
                            setFormData({
                              ...formData,
                              activityData: { ...formData.activityData, opciones: newOpciones }
                            })
                          }}
                          className="text-red-600 hover:text-red-800 font-bold px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      const newOpciones = [...(formData.activityData?.opciones || []), '']
                      setFormData({
                        ...formData,
                        activityData: { ...formData.activityData, opciones: newOpciones }
                      })
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    + Agregar Opción
                  </Button>
                </div>
              </div>

              <div>
                <Label>Items con Imágenes</Label>
                <div className="space-y-3">
                  {(formData.activityData?.items || []).map((item: any, index: number) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-sm">Item {index + 1}</h4>
                        <button
                          onClick={() => {
                            const newItems = formData.activityData.items.filter((_: any, i: number) => i !== index)
                            setFormData({
                              ...formData,
                              activityData: { ...formData.activityData, items: newItems }
                            })
                          }}
                          className="text-red-600 hover:text-red-800 font-bold px-2"
                        >
                          ×
                        </button>
                      </div>
                      <div className="mb-2">
                        <Label className="text-xs">Imagen</Label>
                        <Tabs className="mt-1">
                          <TabsList className="w-full grid grid-cols-2 gap-2 bg-white border border-slate-200 rounded-full mb-3">
                            <TabsTrigger value="local" className="px-3 py-1 rounded-full text-slate-700 transition hover:bg-slate-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md">Imagen local</TabsTrigger>
                            <TabsTrigger value="mis" className="px-3 py-1 rounded-full text-slate-700 transition hover:bg-slate-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md">Mis imágenes</TabsTrigger>
                          </TabsList>
                          <TabsContent value="local" className="mt-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newItems = [...(formData.activityData?.items || [])]
                                  newItems[index] = { ...newItems[index], imageFile: file, imagen: file.name }
                                  setFormData({
                                    ...formData,
                                    activityData: { ...formData.activityData, items: newItems }
                                  })
                                }
                              }}
                              className="cursor-pointer"
                            />
                            {item.imagen && (
                              <p className="text-xs text-gray-500 mt-1">Archivo: {item.imagen}</p>
                            )}
                          </TabsContent>
                          <TabsContent value="mis" className="mt-2">
                            <div className="grid grid-cols-3 gap-3 max-h-64 min-h-40 overflow-y-auto border p-2 rounded bg-slate-50">
                              {avatarImages.map((img) => (
                                <button
                                  key={img.name}
                                  className={`border rounded p-2 ${selectedItemAvatars[index] === img.name ? 'ring-2 ring-blue-600' : ''}`}
                                  onClick={() => {
                                    setSelectedItemAvatars({ ...selectedItemAvatars, [index]: img.name })
                                  }}
                                >
                                  <img src={`/api/avatars/get?projectId=${projectId}&name=${encodeURIComponent(img.name)}`} alt={img.name} className="w-20 h-20 object-cover rounded" />
                                  <div className="text-[10px] text-gray-600">{img.name}</div>
                                </button>
                              ))}
                            </div>
                            <div className="mt-2">
                              <Button
                                type="button"
                                size="sm"
                                disabled={!selectedItemAvatars[index]}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                                onClick={() => {
                                  const name = selectedItemAvatars[index]
                                  if (!name) return
                                  const newItems = [...(formData.activityData?.items || [])]
                                  newItems[index] = { ...newItems[index], imagen: `../../assets/img/avatars/${name}`, imageFile: null }
                                  setFormData({
                                    ...formData,
                                    activityData: { ...formData.activityData, items: newItems }
                                  })
                                }}
                              >Aceptar</Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                      <Textarea
                        value={item.descripcion || ''}
                        onChange={(e) => {
                          const newItems = [...(formData.activityData?.items || [])]
                          newItems[index] = { ...newItems[index], descripcion: e.target.value }
                          setFormData({
                            ...formData,
                            activityData: { ...formData.activityData, items: newItems }
                          })
                        }}
                        placeholder="Descripción del item"
                        className="mb-2"
                        rows={2}
                      />
                      <div className="flex gap-2 items-center">
                        <Label className="text-xs">Respuesta correcta:</Label>
                        <select
                          value={item.correcta !== undefined ? item.correcta : ''}
                          onChange={(e) => {
                            const newItems = [...(formData.activityData?.items || [])]
                            newItems[index] = { ...newItems[index], correcta: parseInt(e.target.value) }
                            setFormData({
                              ...formData,
                              activityData: { ...formData.activityData, items: newItems }
                            })
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">Seleccione...</option>
                          {(formData.activityData?.opciones || []).map((opc: string, i: number) => (
                            <option key={i} value={i}>{opc}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      const newItems = [...(formData.activityData?.items || []), { imagen: '', descripcion: '', correcta: 0, imageFile: null }]
                      setFormData({
                        ...formData,
                        activityData: { ...formData.activityData, items: newItems }
                      })
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    + Agregar Item
                  </Button>
                </div>
              </div>
            </div>
          )
        }

        if (formData.activityType === 'drag-clasificar') {
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Configurar Arrastrar y Clasificar</h3>
                <button
                  onClick={() => setFormData({ ...formData, activityType: '', activityData: { categorias: [], items: [] } })}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Cambiar actividad
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">💡 Cómo usar:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Define las categorías (ej: Colaboradores, Patrón)</li>
                  <li>Agrega items y asigna a qué categoría pertenecen</li>
                  <li>El usuario arrastra cada item a la categoría correcta</li>
                </ol>
              </div>

              <div>
                <Label>Categorías</Label>
                <div className="space-y-2 mb-4">
                  {(formData.activityData?.categorias || []).map((cat: string, index: number) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={cat}
                        onChange={(e) => {
                          const newCategorias = [...(formData.activityData?.categorias || [])]
                          newCategorias[index] = e.target.value
                          setFormData({
                            ...formData,
                            activityData: { ...formData.activityData, categorias: newCategorias }
                          })
                        }}
                        placeholder={`Categoría ${index + 1}`}
                        className="flex-1"
                      />
                      {(formData.activityData?.categorias?.length || 0) > 2 && (
                        <button
                          onClick={() => {
                            const newCategorias = formData.activityData.categorias.filter((_: any, i: number) => i !== index)
                            setFormData({
                              ...formData,
                              activityData: { ...formData.activityData, categorias: newCategorias }
                            })
                          }}
                          className="text-red-600 hover:text-red-800 font-bold px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      const newCategorias = [...(formData.activityData?.categorias || []), '']
                      setFormData({
                        ...formData,
                        activityData: { ...formData.activityData, categorias: newCategorias }
                      })
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    + Agregar Categoría
                  </Button>
                </div>
              </div>

              <div>
                <Label>Items para Clasificar</Label>
                <div className="space-y-3">
                  {(formData.activityData?.items || []).map((item: any, index: number) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-sm">Item {index + 1}</h4>
                        <button
                          onClick={() => {
                            const newItems = formData.activityData.items.filter((_: any, i: number) => i !== index)
                            setFormData({
                              ...formData,
                              activityData: { ...formData.activityData, items: newItems }
                            })
                          }}
                          className="text-red-600 hover:text-red-800 font-bold px-2"
                        >
                          ×
                        </button>
                      </div>
                      <Textarea
                        value={item.texto || ''}
                        onChange={(e) => {
                          const newItems = [...(formData.activityData?.items || [])]
                          newItems[index] = { ...newItems[index], texto: e.target.value }
                          setFormData({
                            ...formData,
                            activityData: { ...formData.activityData, items: newItems }
                          })
                        }}
                        placeholder="Texto del item"
                        className="mb-2"
                        rows={2}
                      />
                      <div className="flex gap-2 items-center">
                        <Label className="text-xs">Categoría correcta:</Label>
                        <select
                          value={item.categoria || ''}
                          onChange={(e) => {
                            const newItems = [...(formData.activityData?.items || [])]
                            newItems[index] = { ...newItems[index], categoria: e.target.value }
                            setFormData({
                              ...formData,
                              activityData: { ...formData.activityData, items: newItems }
                            })
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">Seleccione...</option>
                          {(formData.activityData?.categorias || []).map((cat: string, i: number) => (
                            <option key={i} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      const newItems = [...(formData.activityData?.items || []), { texto: '', categoria: '' }]
                      setFormData({
                        ...formData,
                        activityData: { ...formData.activityData, items: newItems }
                      })
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    + Agregar Item
                  </Button>
                </div>
              </div>
            </div>
          )
        }

        if (formData.activityType === 'verdadero-falso') {
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Configurar Verdadero o Falso</h3>
                <button
                  onClick={() => setFormData({ ...formData, activityType: '', activityData: { preguntas: [] } })}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Cambiar actividad
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">💡 Cómo usar:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Agrega afirmaciones</li>
                  <li>Marca si cada una es Verdadera o Falsa</li>
                  <li>El usuario debe responder Verdadero o Falso para cada una</li>
                </ol>
              </div>

              <div>
                <Label>Preguntas Verdadero o Falso</Label>
                <div className="space-y-4">
                  {(formData.activityData?.preguntas || []).map((pregunta: any, index: number) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Pregunta {index + 1}</h4>
                        <button
                          onClick={() => {
                            const newPreguntas = formData.activityData.preguntas.filter((_: any, i: number) => i !== index)
                            setFormData({
                              ...formData,
                              activityData: { ...formData.activityData, preguntas: newPreguntas }
                            })
                          }}
                          className="text-red-600 hover:text-red-800 font-bold px-2"
                        >
                          ×
                        </button>
                      </div>
                      <Textarea
                        value={pregunta.texto || ''}
                        onChange={(e) => {
                          const newPreguntas = [...(formData.activityData?.preguntas || [])]
                          newPreguntas[index] = { ...newPreguntas[index], texto: e.target.value }
                          setFormData({
                            ...formData,
                            activityData: { ...formData.activityData, preguntas: newPreguntas }
                          })
                        }}
                        placeholder="Escribe la afirmación"
                        className="mb-2"
                        rows={2}
                      />
                      <div className="flex gap-4 items-center">
                        <Label className="text-sm">Respuesta correcta:</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`correcta-vf-${index}`}
                              checked={pregunta.correcta === true}
                              onChange={() => {
                                const newPreguntas = [...(formData.activityData?.preguntas || [])]
                                newPreguntas[index] = { ...newPreguntas[index], correcta: true }
                                setFormData({
                                  ...formData,
                                  activityData: { ...formData.activityData, preguntas: newPreguntas }
                                })
                              }}
                            />
                            <span className="text-green-600 font-semibold">✓ Verdadero</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`correcta-vf-${index}`}
                              checked={pregunta.correcta === false}
                              onChange={() => {
                                const newPreguntas = [...(formData.activityData?.preguntas || [])]
                                newPreguntas[index] = { ...newPreguntas[index], correcta: false }
                                setFormData({
                                  ...formData,
                                  activityData: { ...formData.activityData, preguntas: newPreguntas }
                                })
                              }}
                            />
                            <span className="text-red-600 font-semibold">✗ Falso</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      const newPreguntas = [...(formData.activityData?.preguntas || []), { texto: '', correcta: true }]
                      setFormData({
                        ...formData,
                        activityData: { ...formData.activityData, preguntas: newPreguntas }
                      })
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    + Agregar Pregunta
                  </Button>
                </div>
              </div>
            </div>
          )
        }

        if (formData.activityType === 'quiz') {
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Configurar Quiz</h3>
                <button
                  onClick={() => setFormData({ ...formData, activityType: '', activityData: { preguntas: [] } })}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Cambiar actividad
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">💡 Cómo usar:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Agrega preguntas con sus opciones</li>
                  <li>Marca la respuesta correcta para cada pregunta</li>
                  <li>El usuario verá las preguntas secuencialmente</li>
                </ol>
              </div>

              <div>
                <Label>Preguntas del Quiz</Label>
                <div className="space-y-4">
                  {(formData.activityData?.preguntas || []).map((pregunta: any, index: number) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Pregunta {index + 1}</h4>
                        <button
                          onClick={() => {
                            const newPreguntas = formData.activityData.preguntas.filter((_: any, i: number) => i !== index)
                            setFormData({
                              ...formData,
                              activityData: { ...formData.activityData, preguntas: newPreguntas }
                            })
                          }}
                          className="text-red-600 hover:text-red-800 font-bold px-2"
                        >
                          ×
                        </button>
                      </div>
                      <Input
                        value={pregunta.texto || ''}
                        onChange={(e) => {
                          const newPreguntas = [...(formData.activityData?.preguntas || [])]
                          newPreguntas[index] = { ...newPreguntas[index], texto: e.target.value }
                          setFormData({
                            ...formData,
                            activityData: { ...formData.activityData, preguntas: newPreguntas }
                          })
                        }}
                        placeholder="Escribe la pregunta"
                        className="mb-2"
                      />
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-xs">Opciones (mínimo 2)</Label>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            const newPreguntas = [...(formData.activityData?.preguntas || [])]
                            const opciones = newPreguntas[index].opciones || []
                            opciones.push('')
                            newPreguntas[index] = { ...newPreguntas[index], opciones }
                            setFormData({
                              ...formData,
                              activityData: { ...formData.activityData, preguntas: newPreguntas }
                            })
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs h-6"
                        >
                          + Opción
                        </Button>
                      </div>
                      {(pregunta.opciones || []).map((opcion: string, optIndex: number) => (
                        <div key={optIndex} className="flex gap-2 items-center mt-1">
                          <input
                            type="radio"
                            name={`correcta-${index}`}
                            checked={pregunta.correcta === optIndex}
                            onChange={() => {
                              const newPreguntas = [...(formData.activityData?.preguntas || [])]
                              newPreguntas[index] = { ...newPreguntas[index], correcta: optIndex }
                              setFormData({
                                ...formData,
                                activityData: { ...formData.activityData, preguntas: newPreguntas }
                              })
                            }}
                            title="Marcar como correcta"
                          />
                          <Input
                            value={opcion}
                            onChange={(e) => {
                              const newPreguntas = [...(formData.activityData?.preguntas || [])]
                              const opciones = [...(newPreguntas[index].opciones || [])]
                              opciones[optIndex] = e.target.value
                              newPreguntas[index] = { ...newPreguntas[index], opciones }
                              setFormData({
                                ...formData,
                                activityData: { ...formData.activityData, preguntas: newPreguntas }
                              })
                            }}
                            placeholder={`Opción ${String.fromCharCode(65 + optIndex)}`}
                            className="flex-1"
                          />
                          {(pregunta.opciones?.length || 0) > 2 && (
                            <button
                              onClick={() => {
                                const newPreguntas = [...(formData.activityData?.preguntas || [])]
                                const opciones = newPreguntas[index].opciones.filter((_: any, i: number) => i !== optIndex)
                                let nuevaCorrecta = newPreguntas[index].correcta
                                if (nuevaCorrecta === optIndex) {
                                  nuevaCorrecta = 0
                                } else if (nuevaCorrecta > optIndex) {
                                  nuevaCorrecta--
                                }
                                newPreguntas[index] = { ...newPreguntas[index], opciones, correcta: nuevaCorrecta }
                                setFormData({
                                  ...formData,
                                  activityData: { ...formData.activityData, preguntas: newPreguntas }
                                })
                              }}
                              className="text-red-600 hover:text-red-800 font-bold px-2"
                              title="Eliminar opción"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      const newPreguntas = [...(formData.activityData?.preguntas || []), { texto: '', opciones: ['', ''], correcta: 0 }]
                      setFormData({
                        ...formData,
                        activityData: { ...formData.activityData, preguntas: newPreguntas }
                      })
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    + Agregar Pregunta
                  </Button>
                </div>
              </div>
            </div>
          )
        }

        if (formData.activityType === 'ordenar-pasos') {
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Configurar Ordenar Pasos</h3>
                <button
                  onClick={() => setFormData({ ...formData, activityType: '', activityData: { pasos: [] } })}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Cambiar actividad
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">💡 Cómo usar:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Agrega los pasos en el orden correcto</li>
                  <li>Los pasos se mostrarán desordenados al usuario</li>
                  <li>El usuario debe arrastrar (web) o seleccionar (móvil) para ordenarlos</li>
                </ol>
              </div>

              <div>
                <Label>Pasos (en orden correcto)</Label>
                <div className="space-y-2">
                  {(formData.activityData?.pasos || []).map((paso: string, index: number) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="text-sm font-semibold text-gray-600 w-8">{index + 1}.</span>
                      <Input
                        value={paso}
                        onChange={(e) => {
                          const newPasos = [...(formData.activityData?.pasos || [])]
                          newPasos[index] = e.target.value
                          setFormData({
                            ...formData,
                            activityData: { ...formData.activityData, pasos: newPasos }
                          })
                        }}
                        placeholder={`Paso ${index + 1}`}
                        className="flex-1"
                      />
                      <button
                        onClick={() => {
                          const newPasos = formData.activityData.pasos.filter((_: any, i: number) => i !== index)
                          setFormData({
                            ...formData,
                            activityData: { ...formData.activityData, pasos: newPasos }
                          })
                        }}
                        className="text-red-600 hover:text-red-800 font-bold px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      const newPasos = [...(formData.activityData?.pasos || []), '']
                      setFormData({
                        ...formData,
                        activityData: { ...formData.activityData, pasos: newPasos }
                      })
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    + Agregar Paso
                  </Button>
                </div>
              </div>
            </div>
          )
        }

        return <div>Configuración para {formData.activityType} próximamente...</div>
      default:
        return (
          <div>
            <Label>Contenido</Label>
            <Textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Contenido del componente"
            />
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Editar {component.name}</h3>

          <div className="space-y-4">
            {renderFields()}
          </div>
        </div>

        <div className="border-t border-slate-200 p-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="border-slate-300 text-slate-600 hover:bg-slate-50">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
            Guardar
          </Button>
        </div>
      </div>
    </div>
  )
}
