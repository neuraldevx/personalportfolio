"use client"

import { useHighlight } from "@/lib/highlight-text"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function AboutPage() {
  const highlightRef = useHighlight()

  return (
    <div className="container mx-auto py-8" ref={highlightRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">About Me</h1>
        <Card className="bg-black/50 border-white/10">
          <CardHeader>
            <CardTitle>Hey there! I'm Jacob Christensen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              I'm a passionate developer with expertise in AI, data engineering, and software development. 
              I recently graduated from the University of Wisconsin-Madison, where I earned a Bachelor of 
              Science in Data Science and a Certificate in Computer Science.
            </p>
            
            <h2 className="text-xl font-semibold mt-6">My Journey</h2>
            <p>
              During my time at UW-Madison, I honed my skills in problem-solving, building scalable systems, 
              and creating impactful projects. Whether optimizing data pipelines at Publix or exploring 
              cutting-edge AI technologies, I strive to deliver innovative solutions.
            </p>

            <h2 className="text-xl font-semibold mt-6">Fun Facts</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>I enjoy solving complex puzzles and exploring their connection to engineering challenges.</li>
              <li>I'm an avid fan of machine learning and neural networks.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

