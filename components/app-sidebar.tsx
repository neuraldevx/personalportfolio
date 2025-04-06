"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Github, Home, Mail, User, Code, Brain, FileText, PanelLeftClose, PanelLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { XIcon } from "./icons/x-icon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Define navigation items
type NavItem = {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  external?: boolean
}

type NavGroup = {
  title: string
  items: NavItem[]
}

const navigation: NavGroup[] = [
  {
    title: "Navigation",
    items: [
      { title: "Home", href: "/", icon: Home },
      { title: "About", href: "/about", icon: User },
      { title: "Projects", href: "/projects", icon: Code },
      { title: "Skills", href: "/skills", icon: Brain },
      { title: "Blog", href: "/blog", icon: FileText },
      { title: "Contact", href: "/contact", icon: Mail },
    ],
  },
  {
    title: "Social",
    items: [
      {
        title: "GitHub",
        href: "https://github.com/neuraldevx",
        icon: Github,
        external: true,
      },
      {
        title: "X (Twitter)",
        href: "https://x.com/realjakechris",
        icon: XIcon,
        external: true,
      },
    ],
  },
]

// This custom hook will sync the sidebar state with the document body
// to properly adjust the layout
function useSidebarState() {
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Update the sidebar state
  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    
    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(newState))
      
      // Apply class to document body for layout adjustment
      if (newState) {
        document.body.classList.add("sidebar-collapsed")
      } else {
        document.body.classList.remove("sidebar-collapsed")
      }
    }
  }

  useEffect(() => {
    setMounted(true)
    
    // Check if there's a saved sidebar state in localStorage
    const savedState = localStorage.getItem("sidebar-collapsed")
    const initialState = savedState === "true"
    setCollapsed(initialState)
    
    // Apply initial class based on saved state
    if (initialState) {
      document.body.classList.add("sidebar-collapsed")
    } else {
      document.body.classList.remove("sidebar-collapsed")
    }

    return () => {
      document.body.classList.remove("sidebar-collapsed")
    }
  }, [])

  return { mounted, collapsed, toggleSidebar }
}

export function AppSidebar() {
  const pathname = usePathname()
  const { mounted, collapsed, toggleSidebar } = useSidebarState()

  if (!mounted) return null

  return (
    <>
      <aside 
        className="h-screen fixed bg-background border-r border-border/10 transition-all duration-300 ease-in-out z-50 dark:shadow-lg dark:shadow-purple-500/5"
        style={{
          width: collapsed 
            ? 'var(--sidebar-width-collapsed)' 
            : 'var(--sidebar-width-expanded)'
        }}
        id="app-sidebar"
      >
        <div className="flex flex-col h-full justify-between">
          {/* Header */}
          <div className="p-4 flex items-center border-b border-border/10">
            <Link href="/" className="flex items-center group">
              <div className="h-8 w-8 rounded-md flex items-center justify-center text-sm font-semibold shadow-sm group-hover:shadow-md transition-all bg-secondary text-secondary-foreground dark:bg-sidebar-primary dark:text-sidebar-primary-foreground">
                JC
              </div>
              <div className={cn(
                "ml-3 transition-all duration-300 ease-in-out overflow-hidden", 
                collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}>
                <span className="text-sm font-medium whitespace-nowrap group-hover:text-gradient-blue transition-all">Jacob Christensen</span>
                <p className="text-xs text-muted-foreground whitespace-nowrap group-hover:text-accent/80 transition-all">Developer & Engineer</p>
              </div>
            </Link>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto py-4">
            {navigation.map((group) => (
              <div key={group.title} className="mb-6 px-3">
                <h3 className={cn(
                  "text-xs uppercase tracking-wider text-muted-foreground mb-2 px-2 transition-opacity duration-300",
                  collapsed ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100"
                )}>
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        title={collapsed ? item.title : undefined}
                        className={cn(
                          "flex items-center gap-3 py-2 rounded-md text-sm transition-all",
                          collapsed ? "justify-center px-0" : "px-3",
                          pathname === item.href
                            ? collapsed 
                              ? "text-accent"
                              : "bg-accent/10 dark:bg-accent/20 text-foreground dark:text-foreground shadow-sm relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3/5 before:w-[3px] before:bg-accent before:rounded-r-md"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:text-foreground/70 dark:hover:text-foreground dark:hover:bg-muted/20",
                          "relative group"
                        )}
                      >
                        <item.icon className={cn(
                          "h-4 w-4 min-w-4 transition-colors",
                          pathname === item.href ? "text-accent" : "text-muted-foreground group-hover:text-foreground dark:text-foreground/70 dark:group-hover:text-foreground"
                        )} />
                        <span className={cn(
                          "transition-all duration-300", 
                          collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
                        )}>
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className={cn(
            "p-4 border-t border-border/10 text-xs text-muted-foreground transition-all duration-300",
            collapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"
          )}>
            © 2025 Jacob Christensen
          </div>
        </div>

        {/* Sidebar Toggle Button - Integrated into the sidebar */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute rounded-md transition-all duration-300 ease-in-out group",
            "flex items-center justify-center h-7 w-7",
            "bg-background border border-border/10 shadow-md hover:shadow-lg",
            "hover:bg-accent/5 hover:border-accent/20",
            "top-5 -right-5 z-10"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 text-foreground/70 group-hover:text-accent" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-foreground/70 group-hover:text-accent" />
          )}
        </button>
      </aside>
    </>
  )
} 