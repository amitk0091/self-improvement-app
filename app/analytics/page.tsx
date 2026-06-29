'use client'

import { useState, useEffect } from 'react'
import { getDiaryRange, getFeelingsRange } from '@/lib/store'

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>({
    sweHours: [],
    sleepHours: [],
    mood: [],
    exercise: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const lastWeek = new Date()
      lastWeek.setDate(lastWeek.getDate() - 7)
      const from = lastWeek.toISOString().split('T')[0]
      const rows = await getDiaryRange(from)
      const feelings = await getFeelingsRange(from)
      const moodByDate = new Map(feelings.map((f) => [f.date, f.mood]))
      setAnalytics({
        sweHours: rows.map((e) => ({ date: e.entry_date, hours: e.swe_hours || 0 })),
        sleepHours: rows.map((e) => ({ date: e.entry_date, hours: e.sleep_hours || 0 })),
        mood: rows.map((e) => ({ date: e.entry_date, mood: moodByDate.get(e.entry_date) ?? 5 })),
        exercise: rows.map((e) => ({ date: e.entry_date, exercised: e.exercised })),
      })
      setLoading(false)
    })()
  }, [])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track your progress over time
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* SWE Hours Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">SWE Hours (Last 7 Days)</h2>
            <div className="h-64 flex items-end space-x-2">
              {analytics.sweHours.map((entry: any, index: number) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-indigo-600 rounded-t"
                    style={{ height: `${Math.min(100, (entry.hours / 8) * 100)}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sleep Hours Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sleep Hours (Last 7 Days)</h2>
            <div className="h-64 flex items-end space-x-2">
              {analytics.sleepHours.map((entry: any, index: number) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-green-600 rounded-t"
                    style={{ height: `${Math.min(100, (entry.hours / 8) * 100)}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mood Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Mood (Last 7 Days)</h2>
            <div className="h-64 flex items-end space-x-2">
              {analytics.mood.map((entry: any, index: number) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-yellow-500 rounded-t"
                    style={{ height: `${(entry.mood / 10) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Exercise Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Exercise (Last 7 Days)</h2>
            <div className="h-64 flex items-end space-x-2">
              {analytics.exercise.map((entry: any, index: number) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full rounded-t ${entry.exercised ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    style={{ height: '100%' }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Insights</h2>
          
          {/* Overall statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg SWE Hours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.sweHours.reduce((sum: number, entry: any) => sum + (entry.hours || 0), 0) / analytics.sweHours.length || 0}
              </p>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Sleep</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.sleepHours.reduce((sum: number, entry: any) => sum + (entry.hours || 0), 0) / analytics.sleepHours.length || 0}
              </p>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Exercise Days</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.exercise.filter((entry: any) => entry.exercised).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}