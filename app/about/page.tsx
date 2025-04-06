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
          <ul className="space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground">
             <li className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 mt-1 text-green-500 flex-shrink-0" />
              <span>Developed Excel models to forecast inventory demand for 500+ stores, reducing overstock costs by $200k annually.</span>
            </li>
             <li className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 mt-1 text-green-500 flex-shrink-0" />
              <span>Scripted Python workflows to validate supplier data, decreasing errors by 40%.</span>
            </li>
             <li className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 mt-1 text-green-500 flex-shrink-0" />
              <span>Created Tableau visualizations to track shipment delays, cutting delays by 20%.</span>
            </li>
             <li className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 mt-1 text-green-500 flex-shrink-0" />
              <span>Mentored 5 analysts on SQL optimization, improving query efficiency by 30%.</span>
            </li>
          </ul>
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
          <ul className="space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 mt-1 text-green-500 flex-shrink-0" />
              <span>Built SQL-based ETL pipelines for 1M+ financial transactions into AWS Redshift, reducing processing time by 25%.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 mt-1 text-green-500 flex-shrink-0" />
              <span>Automated QA checks using Python, resolving 15% of flagged anomalies and improving data integrity for compliance.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 mt-1 text-green-500 flex-shrink-0" />
              <span>Partnered with compliance teams to design Tableau dashboards tracking SOC 2 metrics.</span>
            </li>
             <li className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 mt-1 text-green-500 flex-shrink-0" />
              <span>Authored technical specifications for ETL workflows, ensuring scalability and alignment with requirements.</span>
            </li>
          </ul>
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

