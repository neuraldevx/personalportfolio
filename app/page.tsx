"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Github, ExternalLink, Terminal, Brain, Cpu } from 'lucide-react'
import { motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const technologies = [
  "AI", "Data Engineering", "Python", "React", "Next.js", "TypeScript"
]

const currentFocus = [
  {
    title: "AI Research",
    description: "Exploring large language models and their applications in software development",
    icon: Brain,
    link: "https://github.com/neuraldevx"
  },
  {
    title: "Open Source",
    description: "Contributing to and building developer tools for the AI community",
    icon: Terminal,
    link: "https://github.com/neuraldevx"
  },
  {
    title: "Edge Computing",
    description: "Optimizing AI model deployment for edge devices",
    icon: Cpu,
    link: "https://github.com/neuraldevx"
  }
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex min-h-[calc(100vh-4rem)] flex-col items-start justify-center px-6 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-8">
            {/* Profile Section */}
            <div className="flex items-start gap-8">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative hidden aspect-square w-32 shrink-0 overflow-hidden rounded-full sm:block"
              >
                <div className="relative">
                  <Avatar className="h-full w-full">
                    <AvatarImage 
                      src="/headshot.JPG" 
                      alt="Jacob Christensen"
                      className="object-cover object-center"
                    />
                    <AvatarFallback>JC</AvatarFallback>
                  </Avatar>
                  <span className="absolute -end-1 -top-1">
                    <span className="sr-only">Verified</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        className="fill-background"
                        d="M3.046 8.277A4.402 4.402 0 0 1 8.303 3.03a4.4 4.4 0 0 1 7.411 0 4.397 4.397 0 0 1 5.19 3.068c.207.713.23 1.466.067 2.19a4.4 4.4 0 0 1 0 7.415 4.403 4.403 0 0 1-3.06 5.187 4.398 4.398 0 0 1-2.186.072 4.398 4.398 0 0 1-7.422 0 4.398 4.398 0 0 1-5.257-5.248 4.4 4.4 0 0 1 0-7.437Z"
                      />
                      <path
                        className="fill-primary"
                        d="M4.674 8.954a3.602 3.602 0 0 1 4.301-4.293 3.6 3.6 0 0 1 6.064 0 3.598 3.598 0 0 1 4.3 4.302 3.6 3.6 0 0 1 0 6.067 3.6 3.6 0 0 1-4.29 4.302 3.6 3.6 0 0 1-6.074 0 3.598 3.598 0 0 1-4.3-4.293 3.6 3.6 0 0 1 0-6.085Z"
                      />
                      <path
                        className="fill-background"
                        d="M15.707 9.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 12.586l3.293-3.293a1 1 0 0 1 1.414 0Z"
                      />
                    </svg>
                  </span>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div
                className="flex flex-col gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    Hi, I'm{" "}
                    <span className="text-gradient">Jacob Christensen</span>
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    A passionate developer specializing in AI and data engineering
                  </p>
                </div>

                {/* Technology Tags */}
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-white/5 px-3 py-1 text-sm text-white/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="max-w-2xl text-muted-foreground">
                  Recently graduated from the University of Wisconsin-Madison with a BS in Data Science.
                  I'm passionate about building scalable systems and exploring cutting-edge AI technologies.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90"
                    asChild
                  >
                    <a href="/projects">View Projects</a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/10 bg-transparent hover:bg-white/5"
                    asChild
                  >
                    <a href="/contact">Get in Touch</a>
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              className="mx-auto mt-12 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <span className="text-sm text-muted-foreground">Scroll to explore</span>
              <motion.div
                className="h-6 w-px bg-white/20"
                animate={{ scaleY: [1, 0.5, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Current Focus Section */}
      <section className="w-full bg-black/50 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold">What I'm Working On</h2>
            <p className="mt-2 text-muted-foreground">
              Current projects and areas of focus
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 auto-rows-fr">
            {currentFocus.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group relative overflow-hidden border-white/10 bg-black/20 transition-all hover:bg-black/30 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 flex-grow"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-white/10 group-hover:scale-110">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <ExternalLink className="absolute right-4 top-4 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-white/10 bg-black/50 py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2025 Jacob Christensen.</span>
            <span>Built with Next.js and Tailwind.</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              asChild
            >
              <a
                href="https://github.com/neuraldevx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

