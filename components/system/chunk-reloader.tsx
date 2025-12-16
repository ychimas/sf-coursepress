"use client"
import { useEffect } from "react"

export default function ChunkReloader() {
    useEffect(() => {
        const reloadOnChunkError = (err: any) => {
            const msg = String(err?.message || err)
            if (msg.includes("ChunkLoadError") || msg.includes("Loading chunk")) {
                try { location.reload() } catch { }
            }
        }
        const onUnhandled = (e: PromiseRejectionEvent) => reloadOnChunkError(e.reason)
        const onError = (e: ErrorEvent) => reloadOnChunkError(e.error || e.message)
        window.addEventListener("unhandledrejection", onUnhandled)
        window.addEventListener("error", onError)
        return () => {
            window.removeEventListener("unhandledrejection", onUnhandled)
            window.removeEventListener("error", onError)
        }
    }, [])
    return null
}

