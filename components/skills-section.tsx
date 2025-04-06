"use client"

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Code, Database, Brain, Server, Laptop, BarChart } from "lucide-react"

const skills = [
  {
    category: "Programming Languages",
    icon: Code,
    items: [
      { name: "Python", level: 95, color: "from-yellow-500 to-amber-600" },
      { name: "JavaScript", level: 90, color: "from-amber-500 to-yellow-400" },
      { name: "TypeScript", level: 85, color: "from-blue-500 to-indigo-600" },
      { name: "SQL", level: 80, color: "from-orange-500 to-red-600" },
    ],
  },
  {
    category: "Data & AI",
    icon: Brain,
    items: [
      { name: "Machine Learning", level: 90, color: "from-purple-500 to-violet-600" },
      { name: "Deep Learning", level: 85, color: "from-violet-500 to-purple-600" },
      { name: "NLP", level: 80, color: "from-indigo-500 to-blue-600" },
      { name: "Data Visualization", level: 85, color: "from-emerald-500 to-green-600" },
    ],
  },
  {
    category: "Web Development",
    icon: Laptop,
    items: [
      { name: "React", level: 90, color: "from-cyan-500 to-blue-600" },
      { name: "Next.js", level: 85, color: "from-gray-500 to-slate-600" },
      { name: "Tailwind CSS", level: 90, color: "from-cyan-500 to-teal-600" },
      { name: "Node.js", level: 80, color: "from-green-500 to-emerald-600" },
    ],
  },
  {
    category: "Data Engineering",
    icon: Database,
    items: [
      { name: "ETL Pipelines", level: 85, color: "from-teal-500 to-cyan-600" },
      { name: "Data Warehousing", level: 80, color: "from-blue-500 to-sky-600" },
      { name: "Spark", level: 75, color: "from-orange-500 to-amber-600" },
      { name: "Kafka", level: 70, color: "from-red-500 to-rose-600" },
    ],
  },
  {
    category: "DevOps & Cloud",
    icon: Server,
    items: [
      { name: "AWS", level: 80, color: "from-amber-500 to-yellow-600" },
      { name: "Docker", level: 85, color: "from-blue-500 to-cyan-600" },
      { name: "CI/CD", level: 75, color: "from-emerald-500 to-green-600" },
      { name: "Kubernetes", level: 70, color: "from-blue-500 to-indigo-600" },
    ],
  },
  {
    category: "Analytics",
    icon: BarChart,
    items: [
      { name: "Pandas", level: 95, color: "from-blue-500 to-indigo-600" },
      { name: "NumPy", level: 90, color: "from-teal-500 to-cyan-600" },
      { name: "Tableau", level: 80, color: "from-blue-500 to-sky-600" },
      { name: "Power BI", level: 75, color: "from-yellow-500 to-amber-600" },
    ],
  },
]

export function SkillsSection() {
  return (
    <section id="skills" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30 pointer-events-none" />
      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-gradient">Skills</h2>
          <p className="mt-2 text-muted-foreground">My expertise and technical capabilities</p>
          <Separator className="mx-auto mt-6 w-24 bg-accent/30" />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skillGroup, groupIndex) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <div className="glass-card rounded-lg border border-white/5 h-full">
                <Card className="h-full bg-transparent border-0 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                        <skillGroup.icon className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="text-lg font-medium">{skillGroup.category}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {skillGroup.items.map((skill) => (
                        <div key={skill.name} className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{skill.name}</span>
                            <span className="text-xs text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full overflow-hidden bg-white/5 p-0">
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

