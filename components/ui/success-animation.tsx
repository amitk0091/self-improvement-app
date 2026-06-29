'use client'

import { motion } from 'framer-motion'

export function SuccessAnimation() {
  return (
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        delay: 0.1
      }}
      className="flex flex-col items-center justify-center py-8"
    >
      <motion.div
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-24 h-24 mb-4"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-green-500">
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 100" }}
            animate={{ strokeDasharray: ["0 100", "60 100"] }}
            transition={{ 
              duration: 1.5,
              ease: "easeOut",
              delay: 0.2
            }}
          />
          <motion.path
            d="M25 50 L45 70 L75 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut",
              delay: 1
            }}
          />
        </svg>
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-xl font-bold text-gray-900 dark:text-white mb-2"
      >
        Success!
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-gray-500 dark:text-gray-400"
      >
        Your action was completed successfully
      </motion.p>
    </motion.div>
  )
}