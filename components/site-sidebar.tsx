"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Github, Home, Mail, User, Code, Brain, FileText, TypeIcon as type, LucideIcon } from 'lucide-react'
import { XIcon } from "./icons/x-icon"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Define a type for navigation items
type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon | (({ className }: { className?: string }) => JSX.Element);
  external?: boolean;
}

type NavGroup = {
  title: string;
  items: NavItem[];
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
        external: true 
      },
      {
        title: "X (Twitter)",
        href: "https://x.com/realjakechris",
        icon: XIcon,
        external: true
      },
    ],
  },
]

export function SiteSidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  if (!mounted) return null

  return (
    <Sidebar 
      collapsible="icon"
      className="bg-black"
    >
      <SidebarHeader className="bg-black">
        <form className="flex space-x-2 group-data-[collapsible=icon]:hidden">
          <Input
            type="search"
            placeholder="Search..."
            className="h-8 w-full bg-background shadow-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <Button type="submit" size="sm" className="h-8 px-2">
            Search
          </Button>
        </form>
      </SidebarHeader>
      <SidebarContent className="bg-black">
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link 
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        onClick={handleLinkClick}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden bg-black">
        <p className="text-xs text-muted-foreground">
          © 2025 Jacob Christensen
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}

