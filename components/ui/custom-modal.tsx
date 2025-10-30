"use client"

import { Button } from "./button"

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: string
  type?: 'alert' | 'confirm'
}

export function CustomModal({ isOpen, onClose, onConfirm, title, message, type = 'alert' }: CustomModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
          <p className="text-slate-600 leading-relaxed">{message}</p>
        </div>
        <div className="border-t border-slate-200 p-4 flex gap-3 justify-end">
          {type === 'confirm' && (
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </Button>
          )}
          <Button
            onClick={() => {
              if (onConfirm) onConfirm()
              onClose()
            }}
            className={type === 'confirm' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
          >
            {type === 'confirm' ? 'Confirmar' : 'Aceptar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
