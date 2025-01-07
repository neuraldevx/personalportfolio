"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Github, Home, Mail, User, Code, Brain, FileText } from 'lucide-react'
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
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const navigation = [
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
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
      <SidebarContent>
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
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-muted-foreground">
          © 2024 Jacob Christensen
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}

