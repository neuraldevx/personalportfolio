"use client"

import React, { useEffect, useRef } from 'react'

export function useHighlight() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let activeHighlight: HTMLElement | null = null
    let isSelecting = false

    const createHighlight = (range: Range) => {
      // Remove any existing highlight
      if (activeHighlight) {
        activeHighlight.replaceWith(...activeHighlight.childNodes)
      }

      // Create new highlight
      const highlight = document.createElement('span')
      highlight.className = 'live-highlight'
      
      try {
        // Only highlight if the range is within our container
        if (container.contains(range.commonAncestorContainer)) {
          range.surroundContents(highlight)
          activeHighlight = highlight
        }
      } catch (e) {
        // If surroundContents fails, the selection might span multiple elements
        // In this case, we don't highlight to prevent DOM corruption
        console.debug('Complex selection detected')
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      isSelecting = true
      // Clear any existing highlight
      if (activeHighlight) {
        activeHighlight.replaceWith(...activeHighlight.childNodes)
        activeHighlight = null
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      isSelecting = false
    }

    const handleSelectionChange = () => {
      if (!isSelecting) return

      const selection = window.getSelection()
      if (!selection || selection.isCollapsed) {
        if (activeHighlight) {
          activeHighlight.replaceWith(...activeHighlight.childNodes)
          activeHighlight = null
        }
        return
      }

      const range = selection.getRangeAt(0)
      createHighlight(range)
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('selectionchange', handleSelectionChange)
      
      // Clean up any remaining highlights
      if (activeHighlight) {
        activeHighlight.replaceWith(...activeHighlight.childNodes)
      }
    }
  }, [])

  return containerRef
}

