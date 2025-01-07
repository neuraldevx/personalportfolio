import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "Project 1",
    description: "A brief description of Project 1",
    image: "/placeholder.svg",
    demoLink: "#",
    codeLink: "#",
  },
  {
    title: "Project 2",
    description: "A brief description of Project 2",
    image: "/placeholder.svg",
    demoLink: "#",
    codeLink: "#",
  },
  {
    title: "Project 3",
    description: "A brief description of Project 3",
    image: "/placeholder.svg",
    demoLink: "#",
    codeLink: "#",
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="w-full max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.title} className="bg-black/50 border-white/10">
            <CardHeader>
              <Image src={project.image} alt={project.title} width={300} height={200} className="rounded-t-lg" />
            </CardHeader>
            <CardContent>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <a href={project.demoLink} target="_blank" rel="noopener noreferrer">Demo</a>
              </Button>
              <Button variant="outline" asChild>
                <a href={project.codeLink} target="_blank" rel="noopener noreferrer">Code</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

