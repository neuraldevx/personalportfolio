"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Code, ExternalLink } from "lucide-react" 

type Project = {
  title: string
  description: string
  technologies: string[]
  link: string
  github?: string
  featured?: boolean
}

const projects: Project[] = [
  {
    title: "AI Research Tool",
    description: "A tool for querying and analyzing research papers using LLMs",
    technologies: ["Python", "PyTorch", "React", "Next.js"],
    link: "/projects/ai-research-tool",
    github: "https://github.com/neuraldevx/ai-research-tool",
    featured: true,
  },
  {
    title: "Data Visualization Platform",
    description: "Interactive data visualization platform for complex datasets",
    technologies: ["TypeScript", "D3.js", "Firebase", "React"],
    link: "/projects/data-viz",
    github: "https://github.com/neuraldevx/data-viz",
  },
  {
    title: "Edge ML Framework",
    description: "Lightweight ML framework for edge deployment of models",
    technologies: ["C++", "TensorFlow Lite", "Python"],
    link: "/projects/edge-ml",
    github: "https://github.com/neuraldevx/edge-ml",
    featured: true,
  },
]

export function ProjectsSection() {
  const [filter, setFilter] = useState<"all" | "featured">("all")
  
  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(project => project.featured)

  return (
    <section id="projects" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30 pointer-events-none" />
      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-gradient">Projects</h2>
          <p className="mt-2 text-muted-foreground">Recent work and experiments</p>
          <Separator className="mx-auto mt-6 w-24 bg-accent/30" />
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-black/20 backdrop-blur-sm p-1 rounded-lg">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className={cn(
                "rounded-md text-sm",
                filter === "all" ? "bg-accent text-white" : "hover:bg-white/10"
              )}
            >
              All Projects
            </Button>
            <Button
              variant={filter === "featured" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("featured")}
              className={cn(
                "rounded-md text-sm",
                filter === "featured" ? "bg-accent text-white" : "hover:bg-white/10"
              )}
            >
              Featured
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <div className="animated-border rounded-lg h-full">
                <Card className="h-full bg-black/20 border-white/10 overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      {project.featured && (
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <Badge 
                          key={tech} 
                          variant="outline" 
                          className="bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm" className="gap-1 text-accent hover:text-accent/80" asChild>
                      <a href={project.link}>
                        View Project <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
                      </a>
                    </Button>
                    {project.github && (
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-white/10" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Code className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

