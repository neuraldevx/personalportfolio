"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Database, Brain, Server, Laptop, Award, Sparkles } from "lucide-react"

const skills = [
  {
    category: "Programming Languages",
    icon: Code,
    items: [
      { name: "Python", level: 90, color: "from-yellow-500/80 to-amber-600/80" },
      { name: "JavaScript", level: 85, color: "from-amber-500/80 to-yellow-400/80" },
      { name: "TypeScript", level: 80, color: "from-blue-500/80 to-indigo-600/80" },
      { name: "SQL", level: 75, color: "from-orange-500/80 to-red-600/80" },
      { name: "R", level: 70, color: "from-blue-600/80 to-indigo-500/80" },
    ]
  },
  {
    category: "Data & AI",
    icon: Brain,
    items: [
      { name: "Machine Learning", level: 85, color: "from-purple-500/80 to-violet-600/80" },
      { name: "Deep Learning", level: 80, color: "from-violet-500/80 to-purple-600/80" },
      { name: "NLP", level: 75, color: "from-indigo-500/80 to-blue-600/80" },
      { name: "Data Visualization", level: 80, color: "from-emerald-500/80 to-green-600/80" },
    ]
  },
  {
    category: "Web Development",
    icon: Laptop,
    items: [
      { name: "React", level: 85, color: "from-cyan-500/80 to-blue-600/80" },
      { name: "Next.js", level: 80, color: "from-gray-500/80 to-slate-600/80" },
      { name: "Tailwind CSS", level: 85, color: "from-cyan-500/80 to-teal-600/80" },
      { name: "HTML/CSS", level: 90, color: "from-orange-500/80 to-red-500/80" },
    ]
  },
  {
    category: "Data Engineering",
    icon: Database,
    items: [
      { name: "ETL Pipelines", level: 80, color: "from-teal-500/80 to-cyan-600/80" },
      { name: "Data Warehousing", level: 75, color: "from-blue-500/80 to-sky-600/80" },
      { name: "Azure Databricks", level: 85, color: "from-blue-500/80 to-indigo-600/80" },
      { name: "Data Modeling", level: 75, color: "from-indigo-500/80 to-purple-600/80" },
    ]
  },
  {
    category: "DevOps & Cloud",
    icon: Server,
    items: [
      { name: "Azure", level: 80, color: "from-blue-500/80 to-indigo-500/80" },
      { name: "Git", level: 90, color: "from-orange-500/80 to-red-500/80" },
      { name: "CI/CD", level: 70, color: "from-emerald-500/80 to-green-600/80" },
      { name: "Vercel", level: 85, color: "from-gray-500/80 to-slate-600/80" },
    ]
  }
]

const certifications = [
  {
    title: "Fundamentals of the Databricks Lakehouse Platform",
    issuer: "Databricks",
    date: "April 2024",
    skills: ["Azure Databricks", "Data Lake", "Software Development"],
    icon: Database,
    color: "bg-blue-500/10 border-blue-500/20"
  },
  {
    title: "Generative AI Fundamentals Accreditation",
    issuer: "Databricks",
    date: "April 2024",
    skills: ["Generative AI", "Large Language Models (LLM)"],
    icon: Sparkles,
    color: "bg-purple-500/10 border-purple-500/20"
  },
  {
    title: "Machine Learning Certification",
    issuer: "Kaggle",
    date: "April 2024",
    skills: ["Machine Learning", "Data Science", "Python"],
    icon: Brain,
    color: "bg-teal-500/10 border-teal-500/20"
  }
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

export default function SkillsPage() {
  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl font-bold text-gradient">Skills</h1>
          <p className="mt-2 text-muted-foreground">My expertise and technical capabilities</p>
          <Separator className="mx-auto mt-6 w-24 bg-accent/20" />
        </motion.div>
        
        <Tabs defaultValue="skills" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="grid grid-cols-2 bg-background/20 backdrop-blur-sm">
              <TabsTrigger 
                value="skills"
                className="data-[state=active]:bg-accent/90 data-[state=active]:text-white"
              >
                Technical Skills
              </TabsTrigger>
              <TabsTrigger 
                value="certifications"
                className="data-[state=active]:bg-accent/90 data-[state=active]:text-white"
              >
                Certifications
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="skills" className="mt-6">
            <motion.div 
              className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {skills.map((skillGroup, index) => (
                <motion.div
                  key={skillGroup.category}
                  variants={itemVariants}
                  className="h-full"
                >
                  <Card className="h-full bg-card/60 border-border overflow-hidden shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5">
                          <skillGroup.icon className="h-5 w-5 text-accent/80" />
                        </div>
                        <CardTitle>{skillGroup.category}</CardTitle>
                      </div>
                      <Separator className="bg-border" />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-5">
                        {skillGroup.items.map((skill) => (
                          <div key={skill.name} className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="text-xs text-muted-foreground">{skill.level}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full overflow-hidden bg-foreground/5">
                              <div 
                                className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="certifications" className="mt-6">
            <motion.div 
              className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.title}
                  variants={itemVariants}
                  className="h-full"
                >
                  <Card className="h-full bg-card/60 border-border overflow-hidden shadow-sm">
                    <div className="absolute top-0 inset-x-0 h-1 bg-accent/60" />
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5">
                          <cert.icon className="h-5 w-5 text-accent/80" />
                        </div>
                        <CardTitle className="text-lg line-clamp-1" title={cert.title}>
                          {cert.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{cert.issuer}</span>
                        <Badge variant="outline" className="bg-background/40 dark:bg-black/40">
                          {cert.date}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="outline"
                            className={`${cert.color} text-xs`}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Award className="h-4 w-4 mr-1 text-accent/70" />
                      <span className="text-xs text-muted-foreground">Accredited Certification</span>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

