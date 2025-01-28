"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WavyBackground } from "@/components/ui/wavy-background"
import { Github, ExternalLink, Terminal, Brain, Cpu } from "lucide-react"
import { motion } from "framer-motion"

const technologies = ["AI", "Data Engineering", "Python", "React", "Next.js", "TypeScript"]

const currentFocus = [
  {
    title: "AI Research",
    description: "Exploring large language models and their applications in software development",
    icon: Brain,
    link: "https://github.com/neuraldevx",
  },
  {
    title: "Open Source",
    description: "Contributing to and building developer tools for the AI community",
    icon: Terminal,
    link: "https://github.com/neuraldevx",
  },
  {
    title: "Edge Computing",
    description: "Optimizing AI model deployment for edge devices",
    icon: Cpu,
    link: "https://github.com/neuraldevx",
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <WavyBackground
        className="max-w-5xl mx-auto"
        containerClassName="min-h-[calc(100vh-4rem)] relative z-10"
        colors={["#38bdf8", "#818cf8", "#c084fc"]}
        waveWidth={100}
        backgroundFill="rgba(0, 0, 0, 0.8)"
        blur={5}
        speed="slow"
        waveOpacity={0.3}
      >
        <section className="flex flex-col items-start justify-center px-6 py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col gap-12">
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                {/* Avatar with floating animation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                    className="relative w-40 h-40 md:w-48 md:h-48"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-300 to-purple-400 opacity-20 blur-xl" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10">
                      <img
                        src="/headshot.JPG"
                        alt="Jacob Christensen"
                        className="object-cover object-center w-full h-full"
                      />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                  className="flex flex-col gap-6 md:flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-4 text-center md:text-left">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white">
                      Hi, I'm{" "}
                      <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">
                        Jacob Christensen
                      </span>
                    </h1>
                    <p className="text-xl text-white/90">
                      A passionate developer specializing in AI and data engineering
                    </p>
                  </div>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <p className="max-w-2xl text-white/80 text-center md:text-left">
                    Recently graduated from the University of Wisconsin-Madison with a BS in Data Science. I'm
                    passionate about building scalable systems and exploring cutting-edge AI technologies.
                  </p>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8" asChild>
                      <a href="/projects">View Projects</a>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 px-8"
                      asChild
                    >
                      <a href="/contact">Get in Touch</a>
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Scroll Indicator */}
              <motion.div
                className="mx-auto flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span className="text-sm text-white/60">Scroll to explore</span>
                <motion.div
                  className="h-6 w-px bg-white/20"
                  animate={{ scaleY: [1, 0.5, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </section>
      </WavyBackground>

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
            <p className="mt-2 text-muted-foreground">Current projects and areas of focus</p>
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
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="block p-6 flex-grow">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-white/10 group-hover:scale-110">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
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
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <a href="https://github.com/neuraldevx" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

