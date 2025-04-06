"use client"
import { cn } from "@/lib/utils"
import React, { useEffect, useRef, useState } from "react"
import { createNoise3D } from "simplex-noise"
import { useTheme } from "next-themes"

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  lightModeColors,
  waveWidth,
  backgroundFill,
  lightBackgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any
  className?: string
  containerClassName?: string
  colors?: string[]
  lightModeColors?: string[]
  waveWidth?: number
  backgroundFill?: string
  lightBackgroundFill?: string
  blur?: number
  speed?: "slow" | "fast"
  waveOpacity?: number
  [key: string]: any
}) => {
  const { theme, resolvedTheme } = useTheme()
  const noise = createNoise3D()
  let w: number, h: number, nt: number, i: number, x: number, ctx: any, canvas: any
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001
      case "fast":
        return 0.002
      default:
        return 0.001
    }
  }

  const init = () => {
    canvas = canvasRef.current
    if (!canvas) return
    
    ctx = canvas.getContext("2d")
    w = ctx.canvas.width = window.innerWidth
    h = ctx.canvas.height = window.innerHeight
    ctx.filter = `blur(${blur}px)`
    nt = 0
    window.onresize = () => {
      w = ctx.canvas.width = window.innerWidth
      h = ctx.canvas.height = window.innerHeight
      ctx.filter = `blur(${blur}px)`
    }
    render()
  }

  const defaultColors = ["#1a1a1a", "#2a2a2a", "#3a3a3a", "#4a4a4a", "#5a5a5a"]
  const defaultLightColors = ["#e1e1e1", "#d1d1d1", "#c1c1c1", "#b1b1b1", "#a1a1a1"]
  const draculaColors = ["#6272a4", "#bd93f9", "#8be9fd", "#50fa7b", "#ff79c6"]

  const currentTheme = resolvedTheme || theme || 'light'
  
  const waveColors = currentTheme === "dark" 
    ? colors ?? draculaColors
    : lightModeColors ?? defaultLightColors

  const drawWave = (n: number) => {
    nt += getSpeed()
    for (i = 0; i < n; i++) {
      ctx.beginPath()
      ctx.lineWidth = waveWidth || 50
      ctx.strokeStyle = waveColors[i % waveColors.length]
      for (x = 0; x < w; x += 5) {
        var y = noise(x / 800, 0.3 * i, nt) * 100
        ctx.lineTo(x, y + h * 0.5)
      }
      ctx.stroke()
      ctx.closePath()
    }
  }

  let animationId: number | undefined
  const render = () => {
    if (!ctx) return
    
    const currentTheme = resolvedTheme || theme || 'light'
    const currentBackgroundFill = currentTheme === "dark" 
      ? backgroundFill || "#191a21" 
      : lightBackgroundFill || "white"
    
    ctx.fillStyle = currentBackgroundFill
    ctx.globalAlpha = waveOpacity || 0.5
    ctx.fillRect(0, 0, w, h)
    drawWave(5)
    animationId = requestAnimationFrame(render)
  }

  useEffect(() => {
    if (canvasRef.current) {
      init()
    }
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme, theme, colors, lightModeColors, backgroundFill, lightBackgroundFill, waveOpacity])

  const [isSafari, setIsSafari] = useState(false)
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome"),
    )
  }, [])

  return (
    <div className={cn("h-full min-h-screen flex flex-col items-center justify-center", containerClassName)}>
      <canvas
        className="fixed inset-0 w-full h-full z-[-1]" 
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative w-full", className)} {...props}>
        {children}
      </div>
    </div>
  )
}


