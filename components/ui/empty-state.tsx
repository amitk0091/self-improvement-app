'use client'

import { motion } from 'framer-motion'
import { Button } from './button'

interface EmptyStateProps {
  title: string
  description: string
  ctaText?: string
  onCTAClick?: () => void
  icon?: React.ReactNode
}

export function EmptyState({ 
  title, 
  description, 
  ctaText,
  onCTAClick,
  icon 
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white"
        >
          {icon}
        </motion.div>
      )}
      
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-bold text-gray-900 dark:text-white mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 dark:text-gray-400 max-w-md mb-6"
      >
        {description}
      </motion.p>
      
      {ctaText && onCTAClick && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button onClick={onCTAClick}>
            {ctaText}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}