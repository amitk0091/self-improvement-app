import { motion } from 'framer-motion'

export function Skeleton({ 
  className = "",
  height = "h-4",
  width = "w-full"
}: {
  className?: string
  height?: string
  width?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`${height} ${width} rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 ${className}`}
    />
  )
}