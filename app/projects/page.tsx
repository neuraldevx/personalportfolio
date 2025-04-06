"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, ExternalLink, ArrowUpRight, Code, Rocket, Zap } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const projects = [
  {
    title: "AI-Powered Caption Generator",
    description: "Developed a web app that generates witty Instagram captions using AI.",
    technologies: ["Python", "Next.js", "Tailwind CSS", "OpenAI API"],
    outcome: "Enhanced user engagement with creative AI-generated content.",
    demo: "https://demo-link",
    code: "https://github.com/neuraldevx/caption-generator",
    category: "ai",
    icon: Zap,
    color: "from-blue-600 to-cyan-500"
  },
  {
    title: "Data Pipeline Optimization",
    description: "Improved data storage and processing for product recalls.",
    technologies: ["Azure Databricks", "Python", "SQL"],
    outcome: "Reduced processing time by 40%.",
    demo: "https://github.com/neuraldevx/publix-project",
    code: "https://github.com/neuraldevx/publix-project",
    category: "data",
    icon: Rocket,
    color: "from-teal-600 to-cyan-500"
  },
  {
    title: "Mystery Box Madness",
    description: "Interactive app where users unlock virtual mystery boxes.",
    technologies: ["React", "Firebase", "Tailwind CSS"],
    outcome: "Increased user retention by 25%.",
    demo: "https://demo-link",
    code: "https://github.com/neuraldevx/mystery-box",
    category: "web",
    icon: Code,
    color: "from-blue-500 to-sky-400"
  },
  {
    title: "Advanced NLP Research",
    description: "Research project focusing on text classification and semantic analysis.",
    technologies: ["PyTorch", "HuggingFace", "Python", "Jupyter"],
    outcome: "Published paper in AI conference with 90% accuracy model.",
    demo: "https://github.com/neuraldevx/nlp-research",
    code: "https://github.com/neuraldevx/nlp-research",
    category: "ai",
    icon: Zap,
    color: "from-blue-600 to-cyan-500"
  },
  {
    title: "Real-time Analytics Dashboard",
    description: "Built a real-time analytics dashboard for monitoring system metrics.",
    technologies: ["React", "D3.js", "WebSockets", "Node.js"],
    outcome: "Improved incident response time by 60%.",
    demo: "https://demo-link",
    code: "https://github.com/neuraldevx/analytics-dashboard",
    category: "data",
    icon: Rocket,
    color: "from-teal-600 to-cyan-500"
  },
  {
    title: "E-commerce Platform",
    description: "Full-stack e-commerce platform with payment integration and inventory management.",
    technologies: ["Next.js", "MongoDB", "Stripe", "Tailwind CSS"],
    outcome: "Successfully processed 10,000+ orders in the first month.",
    demo: "https://demo-link",
    code: "https://github.com/neuraldevx/ecommerce-platform",
    category: "web",
    icon: Code,
    color: "from-blue-500 to-sky-400"
  }
]

const categories = [
  { id: "all", label: "All Projects" },
  { id: "ai", label: "AI & ML" },
  { id: "data", label: "Data Engineering" },
  { id: "web", label: "Web Development" }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
}

const getTechnologyColor = (tech: string) => {
  const techColors: Record<string, string> = {
    "Python": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30",
    "Next.js": "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300 border-slate-200 dark:border-slate-800/30",
    "React": "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200 dark:border-sky-800/30",
    "Tailwind CSS": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/30",
    "OpenAI API": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30",
    "Firebase": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30",
    "Azure Databricks": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/30",
    "SQL": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30",
    "MongoDB": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/30",
    "Stripe": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/30",
    "D3.js": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800/30",
    "WebSockets": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800/30",
    "Node.js": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30",
    "PyTorch": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800/30",
    "HuggingFace": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30",
    "Jupyter": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30"
  }
  
  return techColors[tech] || "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300 border-slate-200 dark:border-slate-800/30"
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  
  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === activeCategory)

  return (
    <div className="min-h-screen pb-24 pt-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl font-bold text-gradient-blue">Projects</h1>
          <p className="mt-2 text-muted-foreground">Showcasing my work and experience</p>
          <Separator className="mx-auto mt-6 w-24 bg-accent/20" />
        </motion.div>
        
        <div className="mb-12 flex justify-center">
          <Tabs 
            defaultValue="all" 
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="grid grid-cols-1 md:grid-cols-4 bg-background/20 backdrop-blur-sm">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-accent data-[state=active]:text-white font-medium"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeCategory} className="mt-12">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredProjects.map((project, index) => (
                  <motion.div 
                    key={project.title}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -8, 
                      transition: { duration: 0.2 } 
                    }}
                    className="h-full"
                  >
                    <Card className="h-full group bg-card/60 dark:bg-card/30 backdrop-blur-sm border-border/50 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-foreground/5 dark:hover:shadow-accent/10">
                      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${project.color}`} />
                      
                      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-background to-background/0 opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500" />
                      
                      <CardHeader className="pb-3 px-5 pt-5 relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3.5">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${project.color} text-white shadow-md group-hover:shadow-lg transition-shadow relative`}>
                              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-30 transition-opacity" />
                              <project.icon className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-xl font-bold leading-tight">{project.title}</CardTitle>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a 
                                  href={project.demo} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="h-10 w-10 flex items-center justify-center rounded-full bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors"
                                >
                                  <ArrowUpRight className="h-5 w-5" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>View Project</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <CardDescription className="mt-4 leading-relaxed text-sm text-muted-foreground">{project.description}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-4 pb-8 px-5 space-y-6 relative">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <Badge
                                key={tech}
                                variant="outline" 
                                className={`${getTechnologyColor(tech)} text-xs font-medium py-1.5 px-3 rounded-full transition-colors`}
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Outcome</h4>
                          <p className="text-sm leading-relaxed">{project.outcome}</p>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-3 pb-5 px-5 border-t border-border/30">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs text-muted-foreground">
                            View project details
                          </span>
                          <Button variant="outline" size="sm" className="border-border/50 bg-background/20 hover:bg-background/50 transition-colors px-4" asChild>
                            <a href={project.code} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3.5 w-3.5 mr-2.5" /> GitHub
                            </a>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

