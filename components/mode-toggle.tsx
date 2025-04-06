"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-9 w-9 rounded-full transition-all duration-300",
            "hover:bg-white/10 hover:shadow-sm",
            "dark:hover:bg-accent/15 dark:hover:shadow-[0_0_12px_-3px_rgba(191,97,106,0.3)]"
          )}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-amber-500/90 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all text-accent/90 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-background/90 backdrop-blur-md border-border/50 rounded-lg shadow-lg dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.45)]"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className={cn(
            "cursor-pointer transition-colors",
            "hover:bg-secondary/70",
            theme === "light" && "bg-secondary/50"
          )}
        >
          <Sun className="mr-2 h-4 w-4 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={cn(
            "cursor-pointer transition-colors",
            "hover:bg-secondary/70",
            theme === "dark" && "bg-secondary/50"
          )}
        >
          <Moon className="mr-2 h-4 w-4 text-accent" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className={cn(
            "cursor-pointer transition-colors",
            "hover:bg-secondary/70",
            theme === "system" && "bg-secondary/50"
          )}
        >
          <Monitor className="mr-2 h-4 w-4 text-cyan-400" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 