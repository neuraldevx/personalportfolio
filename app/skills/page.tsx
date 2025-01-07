"use client"

import { useHighlight } from "@/lib/highlight-text"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const skills = {
  languages: ["Python", "R", "JavaScript", "TypeScript"],
  frameworks: ["React", "Next.js", "TensorFlow"],
  tools: ["Git", "Tailwind CSS", "Vercel"],
  certifications: [
    {
      title: "Fundamentals of the Databricks Lakehouse Platform Accreditation",
      issuer: "Databricks",
      date: "April 2024",
      skills: ["Azure Databricks", "Data Lake Fundamentals", "Software Development"]
    },
    {
      title: "Generative AI Fundamentals Accreditation",
      issuer: "Databricks",
      date: "April 2024",
      skills: ["Generative AI", "Large Language Models (LLM)"]
    },
    {
      title: "Intro to Machine Learning",
      issuer: "Kaggle",
      date: "April 2024",
      skills: ["Machine Learning"]
    }
  ]
}

export default function SkillsPage() {
  const highlightRef = useHighlight()

  return (
    <div className="container mx-auto py-8" ref={highlightRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="text-4xl font-bold">Skills</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-black/50 border-white/10">
            <CardHeader>
              <CardTitle>Programming Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-white/10">
            <CardHeader>
              <CardTitle>Frameworks & Libraries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.frameworks.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-white/10">
            <CardHeader>
              <CardTitle>Tools & Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mt-12">Certifications</h2>
        <div className="grid grid-cols-1 gap-6">
          {skills.certifications.map((cert) => (
            <Card key={cert.title} className="bg-black/50 border-white/10">
              <CardHeader>
                <CardTitle>{cert.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{cert.issuer}</span>
                  <span>{cert.date}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

