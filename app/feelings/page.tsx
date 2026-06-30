'use client'

import { useState, useEffect } from 'react'
import { getFeeling, getFeelings, saveFeeling, todayStr, type Feeling } from '@/lib/store'

export default function FeelingsPage() {
  const [feeling, setFeeling] = useState<{
    id?: string
    date?: string
    mood: number
    motivation: number
    stress: number
    gratitude: string
    note: string
  }>({
    mood: 5,
    motivation: 5,
    stress: 5,
    gratitude: '',
    note: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: string; message: string } | null>(null)
  const [date, setDate] = useState(todayStr())
  const [history, setHistory] = useState<Feeling[]>([])

  const refreshHistory = async () => setHistory(await getFeelings())

  useEffect(() => {
    refreshHistory()
  }, [])

  useEffect(() => {
    (async () => {
      setSaveStatus(null)
      const existing = await getFeeling(date)
      if (existing) setFeeling(existing)
      else setFeeling({ mood: 5, motivation: 5, stress: 5, gratitude: '', note: '' })
    })()
  }, [date])
  
  const handleChange = (field: string, value: number | string) => {
    setFeeling(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus(null)
    try {
      const saved = await saveFeeling({
        id: feeling.id,
        date: date,
        mood: feeling.mood,
        motivation: feeling.motivation,
        stress: feeling.stress,
        gratitude: feeling.gratitude,
        note: feeling.note,
      })
      setFeeling(saved)
      setSaveStatus({ type: 'success', message: 'Feeling entry saved successfully!' })
      await refreshHistory()
    } catch (error) {
      console.error('Error saving feeling:', error)
      setSaveStatus({ type: 'error', message: 'Failed to save feeling. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feelings Journal</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Quick mood, motivation, stress assessment
          </p>
          <div className="mt-4 flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input
              type="date"
              value={date}
              max={todayStr()}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {date !== todayStr() && (
              <button onClick={() => setDate(todayStr())} className="text-sm text-indigo-600 hover:text-indigo-700">Today</button>
            )}
          </div>
        </div>
        
        {saveStatus && (
          <div className={`rounded-md p-4 mb-6 ${
            saveStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {saveStatus.message}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Mood */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mood (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={feeling.mood || 5}
                onChange={(e) => handleChange('mood', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-1">
                <span>1</span>
                <span className="font-medium">{feeling.mood}</span>
                <span>10</span>
              </div>
            </div>
            
            {/* Motivation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Motivation (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={feeling.motivation || 5}
                onChange={(e) => handleChange('motivation', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-1">
                <span>1</span>
                <span className="font-medium">{feeling.motivation}</span>
                <span>10</span>
              </div>
            </div>
            
            {/* Stress */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stress (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={feeling.stress || 5}
                onChange={(e) => handleChange('stress', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-1">
                <span>1</span>
                <span className="font-medium">{feeling.stress}</span>
                <span>10</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gratitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gratitude
              </label>
              <textarea
                value={feeling.gratitude || ''}
                onChange={(e) => handleChange('gratitude', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="What are you grateful for today?"
              />
            </div>
            
            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Note
              </label>
              <textarea
                value={feeling.note || ''}
                onChange={(e) => handleChange('note', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Additional thoughts about today..."
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Feeling'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">History</h2>
          {history.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">No entries yet. Save your first feeling above.</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {history.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => setDate(f.date)}
                    className={`w-full text-left py-3 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${f.date === date ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(f.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <span title="Mood">😊 {f.mood}</span>
                        <span title="Motivation">⚡ {f.motivation}</span>
                        <span title="Stress">😰 {f.stress}</span>
                      </span>
                    </div>
                    {(f.gratitude || f.note) && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                        {f.gratitude || f.note}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}