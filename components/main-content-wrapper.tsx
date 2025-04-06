'use client'

import { useHighlight } from "@/lib/highlight-text"
import React from "react"

interface MainContentWrapperProps {
  children: React.ReactNode
}

export function MainContentWrapper({ children }: MainContentWrapperProps) {
  const highlightRef = useHighlight()

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8" ref={highlightRef}>
      {children}
    </main>
  )
} 