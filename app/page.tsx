"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightIcon, CodeIcon, ExternalLinkIcon, GithubIcon } from "lucide-react"
import { TypeAnimation } from "react-type-animation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { SplashCursor } from "@/components/ui/splash-cursor"

export default function Home() {
  const technologies = [
    { name: "React", url: "https://reactjs.org", color: "dark:bg-blue-600/20 dark:text-blue-200 bg-blue-500/10 text-blue-500" },
    { name: "Next.js", url: "https://nextjs.org", color: "dark:bg-neutral-800/50 dark:text-neutral-200 bg-neutral-500/10 text-neutral-500" },
    { name: "TailwindCSS", url: "https://tailwindcss.com", color: "dark:bg-cyan-600/20 dark:text-cyan-200 bg-cyan-500/10 text-cyan-500" },
    { name: "TypeScript", url: "https://typescriptlang.org", color: "dark:bg-blue-600/20 dark:text-blue-200 bg-blue-500/10 text-blue-500" },
    { name: "Node.js", url: "https://nodejs.org", color: "dark:bg-green-600/20 dark:text-green-200 bg-green-500/10 text-green-500" },
    { name: "Python", url: "https://python.org", color: "dark:bg-yellow-600/20 dark:text-yellow-200 bg-yellow-500/10 text-yellow-500" },
    { name: "AI/ML", url: "#", color: "dark:bg-purple-600/20 dark:text-purple-200 bg-purple-500/10 text-purple-500" },
    { name: "GPT/LLMs", url: "#", color: "dark:bg-teal-600/20 dark:text-teal-200 bg-teal-500/10 text-teal-500" },
  ]
  
  return (
    <div className="container max-w-5xl pb-12 md:pb-16 lg:pb-20 space-y-16 md:space-y-20 lg:space-y-24">
      <SplashCursor />
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-12 lg:gap-16">
        {/* Text Content */}
        <div className="flex-1 space-y-6 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight h-20 md:h-24">
              Hello, I&apos;m{" "}
              <TypeAnimation
                sequence={[
                  '',
                  500, // Initial delay
                  'Jacob Christensen',
                  1000, // Pause after typing
                ]}
                speed={50}
                className="text-gradient inline-block"
                wrapper="span"
                repeat={0}
                cursor={true}
              />
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Software developer specializing in full-stack web development, AI applications, and engineering solutions.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-3 mt-6"
          >
            {technologies.map((tech, i) => (
              <Link 
                href={tech.url} 
                key={tech.name}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Badge 
                  variant="outline" 
                  className={`${tech.color} hover:bg-opacity-20 transition-colors rounded-full px-4 py-1.5 text-sm font-medium border-transparent dark:border`}
                >
                  {tech.name}
                </Badge>
              </Link>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Button asChild size="lg" className="group shadow-md hover:shadow-lg transition-shadow">
              <Link href="/contact">
                Contact Me
                <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild className="shadow-sm hover:shadow-md transition-shadow">
              <Link href="/projects">
                View Projects
                <CodeIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
        
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative group"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br dark:from-purple-500/20 dark:via-blue-500/20 dark:to-cyan-500/20 from-blue-500/10 via-cyan-500/10 to-sky-500/10 blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          <Avatar className="h-36 w-36 md:h-44 md:w-44 border-4 border-background shadow-lg relative z-10">
            <AvatarImage 
              src="/headshot.JPG" 
              alt="Jacob Christensen" 
              className="object-cover"
            />
            <AvatarFallback className="text-4xl bg-primary/10">JC</AvatarFallback>
          </Avatar>
        </motion.div>
      </section>
      
      {/* Current Focus Section */}
      <section className="py-4 md:py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-semibold mb-6 text-center">Current Focus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-0">
            {/* Card 1 */}
            <Card className="glass-card overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-blue-400/30 dark:hover:shadow-purple-400/30 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold">AI & Machine Learning</CardTitle>
                <CardDescription className="pt-1">
                  Working with transformers and large language models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Building applications leveraging LLMs like GPT-4 and creating AI-enhanced tools for developers.
                </p>
              </CardContent>
              <CardFooter className="border-t border-border/10 pt-4 mt-4">
                <Button variant="link" className="px-0 text-accent hover:text-accent/80" asChild>
                  <Link href="/projects?filter=ai">
                    <span>See AI projects</span>
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Card 2 */}
            <Card className="glass-card overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-blue-400/30 dark:hover:shadow-purple-400/30 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold">Web Development</CardTitle>
                <CardDescription className="pt-1">
                  Modern, responsive web applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Creating polished UI/UX with Next.js 14, React, and TailwindCSS using the latest features and best practices.
                </p>
              </CardContent>
              <CardFooter className="border-t border-border/10 pt-4 mt-4">
                <Button variant="link" className="px-0 text-accent hover:text-accent/80" asChild>
                  <Link href="/projects?filter=web">
                    <span>See web projects</span>
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      </section>
      
      {/* Featured Project */}
      <section className="py-4 md:py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-semibold mb-6 text-center">Featured Project</h2>
          <Card className="animated-border overflow-hidden shadow-lg hover:shadow-xl hover:shadow-blue-400/30 dark:hover:shadow-purple-400/30 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.01]">
            <div className="p-px rounded-lg overflow-hidden">
              <div className="bg-background rounded-lg overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-xl font-semibold">AI Code Assistant</CardTitle>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" asChild className="text-muted-foreground hover:text-foreground transition-colors">
                        <Link href="https://github.com/yourusername/ai-code-assistant" target="_blank" rel="noopener noreferrer">
                          <GithubIcon className="h-4 w-4" />
                          <span className="sr-only">GitHub</span>
                        </Link>
                      </Button>
                      <Button size="icon" variant="ghost" asChild className="text-muted-foreground hover:text-foreground transition-colors">
                        <Link href="https://ai-code-assistant-demo.vercel.app" target="_blank" rel="noopener noreferrer">
                          <ExternalLinkIcon className="h-4 w-4" />
                          <span className="sr-only">Live Demo</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="pt-1">
                    An AI-powered programming assistant that helps developers write better code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    Built with Next.js, TypeScript, and OpenAI's API, this tool analyses code, suggests improvements, and helps with debugging. It features real-time suggestions and supports multiple programming languages.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="border-transparent">Next.js</Badge>
                    <Badge variant="secondary" className="border-transparent">OpenAI</Badge>
                    <Badge variant="secondary" className="border-transparent">AI</Badge>
                    <Badge variant="secondary" className="border-transparent">API</Badge>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/10 pt-4 mt-4">
                  <Button asChild className="group shadow-sm hover:shadow-md transition-shadow">
                    <Link href="/projects/ai-code-assistant">
                      <span>View Project Details</span>
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}