"use client"

import { useState, useEffect } from "react"
import { GitBranch, FolderGit2, GitPullRequest, Upload, X, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GitHubModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  courseName: string
}

export function GitHubModal({ isOpen, onClose, courseId, courseName }: GitHubModalProps) {
  const [repository, setRepository] = useState("")
  const [branch, setBranch] = useState("main")
  const [isPushing, setIsPushing] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [githubUser, setGithubUser] = useState("")

  useEffect(() => {
    if (isOpen) {
      checkGitHubConnection()
    }
    
    // Check if returning from GitHub auth
    if (sessionStorage.getItem('github_auth_return')) {
      sessionStorage.removeItem('github_auth_return')
      setTimeout(() => {
        checkGitHubConnection()
      }, 1000)
    }
  }, [isOpen])

  const checkGitHubConnection = async () => {
    try {
      const response = await fetch('/api/github/status')
      const data = await response.json()
      if (data.connected) {
        setIsConnected(true)
        setGithubUser(data.username)
        setRepository(data.repository || "")
        setBranch(data.branch || "main")
      }
    } catch (error) {
      console.error('Error checking GitHub connection:', error)
    }
  }

  const handleConnectGitHub = async () => {
    setIsConnecting(true)
    // Store current state to return after auth
    sessionStorage.setItem('github_auth_return', 'true')
    window.location.href = '/api/github/auth'
  }

  if (!isOpen) return null

  const handlePush = async () => {
    setIsPushing(true)
    try {
      const response = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, repository, branch })
      })
      const data = await response.json()
      if (data.success) {
        alert("Push exitoso!")
      } else {
        alert("Error: " + data.error)
      }
    } catch (error) {
      alert("Error al hacer push")
    } finally {
      setIsPushing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <FolderGit2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Git Integration</h3>
              <p className="text-xs text-slate-500">{courseName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!isConnected ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Github className="w-8 h-8 text-slate-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Conectar con GitHub</h4>
              <p className="text-sm text-slate-600 mb-6">Autoriza la aplicación para acceder a tu cuenta de GitHub</p>
              <Button
                onClick={handleConnectGitHub}
                disabled={isConnecting}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Github className="w-4 h-4 mr-2" />
                {isConnecting ? "Conectando..." : "Conectar con GitHub"}
              </Button>
            </div>
          ) : (
            <>
              {/* User Info */}
              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-slate-600 mb-1">Conectado como</p>
                <p className="text-sm font-semibold text-slate-900">{githubUser}</p>
              </div>

              {/* Repository */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <FolderGit2 className="w-4 h-4" />
                  Repository
                </label>
                <input
                  type="text"
                  placeholder="ychimas/IDE-SOFACTIA"
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                  readOnly
                />
              </div>

              {/* Branch */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <GitBranch className="w-4 h-4" />
                  Active Branch
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-slate-400 cursor-not-allowed"
                  disabled
                >
                  <GitPullRequest className="w-4 h-4 mr-2" />
                  Pull Changes
                </Button>
                <Button
                  className="w-full justify-start bg-slate-900 hover:bg-slate-800 text-white"
                  onClick={handlePush}
                  disabled={!repository || isPushing}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isPushing ? "Pushing..." : "Push Changes"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

