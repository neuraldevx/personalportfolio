"use client"

import { useHighlight } from "@/lib/highlight-text"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "AI-Powered Caption Generator",
    description: "Developed a web app that generates witty Instagram captions using AI.",
    technologies: ["Python", "Next.js", "Tailwind CSS", "OpenAI API"],
    outcome: "Enhanced user engagement with creative AI-generated content.",
    demo: "https://demo-link",
    code: "https://github.com/neuraldevx/caption-generator"
  },
  {
    title: "Data Pipeline Optimization at Publix",
    description: "Improved data storage and processing for product recalls.",
    technologies: ["Azure Databricks", "Python", "SQL"],
    outcome: "Reduced processing time by 40%.",
    demo: "https://github.com/neuraldevx/publix-project",
    code: "https://github.com/neuraldevx/publix-project"
  },
  {
    title: "Mystery Box Madness",
    description: "Interactive app where users unlock virtual mystery boxes.",
    technologies: ["React", "Firebase", "Tailwind CSS"],
    outcome: "Increased user retention by 25%.",
    demo: "https://demo-link",
    code: "https://github.com/neuraldevx/mystery-box"
  }
]

export default function ProjectsPage() {
  const highlightRef = useHighlight()

  return (
    <div className="container mx-auto py-8" ref={highlightRef}>
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.title} className="bg-black/50 border-white/10">
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-white/5 rounded-md text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Outcome</h4>
                  <p className="text-sm text-muted-foreground">{project.outcome}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  View Demo
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={project.code} target="_blank" rel="noopener noreferrer">
                  Source Code
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

