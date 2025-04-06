"use client"

// Removed useHighlight as it might conflict with card motion
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

const posts = [
  {
    title: "Why I Love AI and Machine Learning",
    description: "A deep dive into the potential and excitement surrounding AI/ML. Coming soon!",
    link: "#",
    date: "Future Post"
  },
  {
    title: "Improving Data Pipelines with Azure Databricks",
    description: "Lessons learned and techniques for optimizing data workflows. Coming soon!",
    link: "#",
    date: "Future Post"
  },
  {
    title: "Navigating the AI/ML Job Market",
    description: "Insights and advice for landing a role in the AI/ML space. Coming soon!",
    link: "#",
    date: "Future Post"
  }
]

export default function BlogPage() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1, // Stagger animation
        duration: 0.4
      }
    })
  }

  return (
    <div className="container max-w-5xl mx-auto py-12 md:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10 md:mb-12 text-center">Blog</h1>
        <p className="text-xl text-muted-foreground mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          Thoughts on software development, AI, and technology trends. More coming soon!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.title}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }} // Enhanced hover effect
              className="w-full"
            >
              <Card className="glass-card overflow-hidden h-full flex flex-col group transition-all duration-300 ease-in-out shadow-md hover:shadow-xl dark:shadow-purple-500/5 dark:hover:shadow-purple-500/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold group-hover:text-accent transition-colors duration-300">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="pt-1 text-xs">
                    {post.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {post.description}
                  </p>
                </CardContent>
                <CardFooter className="border-t border-border/10 pt-4 mt-4">
                  <Button variant="link" className="px-0 text-sm text-muted-foreground h-auto py-0" disabled>
                    <span>Coming Soon</span>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

