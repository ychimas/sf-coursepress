import type React from "react"
import { Inter } from "next/font/google"
import { Pacifico } from "next/font/google"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata = {
  title: "SF CoursePress - Generador de Cursos E-Learning",
  description: "Plataforma profesional para crear cursos SCORM sin conocimientos técnicos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${pacifico.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
