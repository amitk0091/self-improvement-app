'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  animate?: boolean
}

export function Card({ 
  children, 
  className = '',
  hover = false,
  glass = false,
  animate = false
}: CardProps) {
  const baseClasses = "rounded-xl overflow-hidden transition-all duration-300"
  const glassClasses = glass 
    ? "card-glass" 
    : "bg-card text-card-foreground border border-border"
  const hoverClasses = hover ? "hover:shadow-lg hover:-translate-y-1" : ""
  const animateClass = animate ? "fade-in-up" : ""
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseClasses} ${glassClasses} ${hoverClasses} ${animateClass} ${className}`}
    >
      {children}
    </motion.div>
  )
}