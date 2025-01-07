"use client"

import { useHighlight } from "@/lib/highlight-text"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const posts = [
  {
    title: "Why I Love AI and Machine Learning",
    description: "AI is transforming industries, and here's why I'm excited to be part of this evolution.",
    link: "https://medium.com/jacobrchristensen",
    date: "April 2024"
  },
  {
    title: "Improving Data Pipelines with Azure Databricks",
    description: "Key takeaways from my internship at Publix.",
    link: "https://medium.com/jacobrchristensen",
    date: "March 2024"
  },
  {
    title: "Navigating the AI/ML Job Market",
    description: "Tips for aspiring developers in a competitive field.",
    link: "https://medium.com/jacobrchristensen",
    date: "February 2024"
  }
]

export default function BlogPage() {
  const highlightRef = useHighlight()

  return (
    <div className="container mx-auto py-8" ref={highlightRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.title} className="bg-black/50 border-white/10">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.date}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{post.description}</p>
                <Button asChild variant="outline">
                  <a href={post.link} target="_blank" rel="noopener noreferrer">
                    Read More
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

