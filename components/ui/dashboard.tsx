'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card } from './card'
import { Button } from './button'
import {
  getProfile,
  getFeeling,
  getInstances,
  getDiaryRange,
  seedDefaults,
  todayStr,
} from '@/lib/store'

const moodEmoji = (m: number) => (m >= 8 ? '😄' : m >= 6 ? '🙂' : m >= 4 ? '😐' : '😟')

export function Dashboard() {
  const [name, setName] = useState('there')
  const [progress, setProgress] = useState(0)
  const [mood, setMood] = useState<number | null>(null)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    (async () => {
      await seedDefaults()
      setName((await getProfile()).display_name || 'there')
      const today = await getFeeling(todayStr())
      setMood(today ? today.mood : null)
      const instances = await getInstances(todayStr())
      if (instances.length) {
        setProgress(Math.round(instances.reduce((s, i) => s + i.completion_pct, 0) / instances.length))
      }
      // streak: consecutive days with a diary entry ending today
      const entries = (await getDiaryRange('2000-01-01')).map((e) => e.entry_date)
      const set = new Set(entries)
      let count = 0
      const d = new Date()
      while (set.has(d.toISOString().split('T')[0])) {
        count++
        d.setDate(d.getDate() - 1)
      }
      setStreak(count)
    })()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">Welcome back, {name}!</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Continue your journey of self-improvement. Today is a new opportunity to grow and learn something new.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card glass={true} hover={true} animate={true}>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Today's Progress</h3>
              <p className="text-3xl font-bold gradient-text mb-2">{progress}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{progress >= 100 ? 'All done!' : 'Keep going!'}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glass={true} hover={true} animate={true}>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Mood</h3>
              <p className="text-3xl font-bold text-green-500 mb-2">{mood ? moodEmoji(mood) : '—'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{mood ? `${mood}/10 today` : 'Not logged yet'}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card glass={true} hover={true} animate={true}>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Streak</h3>
              <p className="text-3xl font-bold text-yellow-500 mb-2">{streak} days</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{streak > 0 ? 'Keep it up!' : 'Log today to start'}</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Daily Reflection', href: '/today' },
            { label: 'Checklist', href: '/checklists' },
            { label: 'Feelings Journal', href: '/feelings' },
            { label: 'AI Review', href: '/ai-review' },
          ].map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card glass={true} hover={true} className="h-full">
                <div className="p-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{action.label}</h3>
                  <Link href={action.href}>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      Start
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}