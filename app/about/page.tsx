"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Timeline } from "@/components/ui/timeline"
import { useHighlight } from "@/lib/highlight-text"
import { Briefcase, GraduationCap, CheckCircle } from "lucide-react"

export default function AboutPage() {
  const highlightRef = useHighlight()

  // Updated timeline data based on resume
  const timelineData = [
    {
      title: "May 2023 - Aug 2023",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-accent" />
            <h4 className="text-lg font-semibold text-foreground">Software Engineer Intern</h4>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Publix Super Markets - Lakeland, FL
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Focused on data-driven process improvements, automation, and mentoring analysts to optimize supply chain operations.
          </p>
        </div>
      ),
    },
    {
      title: "Jan 2024 - May 2024",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-accent" />
            <h4 className="text-lg font-semibold text-foreground">Software Development Intern</h4>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Plaid - Remote
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Specialized in scalable ETL pipelines, compliance analytics, and technical documentation for financial data integrity.
          </p>
        </div>
      ),
    },
    {
      title: "Graduated Dec 2024",
      content: (
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-5 w-5 text-accent" />
            <h4 className="text-lg font-semibold text-foreground">B.S. Data Science & Computer Science</h4>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            University of Wisconsin-Madison - Madison, WI
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Relevant Coursework: Database Design, Distributed Systems, Threat Analysis. <br />
            Leadership: Led workshops for the Data Science Club.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="container max-w-6xl py-12 md:py-16 lg:py-20" ref={highlightRef}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Timeline data={timelineData} />
      </motion.div>
    </div>
  )
}

