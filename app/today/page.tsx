'use client'

import { useState, useEffect } from 'react'
import { getDiary, getDiaryRange, saveDiary, todayStr, type DiaryEntry } from '@/lib/store'

export default function TodayPage() {
  const [entry, setEntry] = useState<Partial<DiaryEntry>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: string; message: string } | null>(null)
  const [date, setDate] = useState(todayStr())

  // Allow opening a specific day via ?date=YYYY-MM-DD
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('date')
    if (q && q <= todayStr()) setDate(q)
  }, [])

  // Load the selected day's entry, defaulting from the previous day
  useEffect(() => {
    (async () => {
      setSaveStatus(null)
      const existing = await getDiary(date)
      if (existing) {
        setEntry(existing ?? { entry_date: date })
        return
      }
      const prevDay = new Date(date)
      prevDay.setDate(prevDay.getDate() - 1)
      const prev = await getDiary(prevDay.toISOString().split('T')[0])
      if (prev) setEntry({ ...prev, id: undefined, entry_date: date })
      else setEntry({ entry_date: date })
    })()
  }, [date])
  
  const handleChange = (field: string, value: any) => {
    setEntry(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus(null)
    try {
      const saved = await saveDiary({
        entry_date: entry.entry_date || date,
        swe_hours: entry.swe_hours ?? null,
        topics: entry.topics ?? null,
        work_done: entry.work_done ?? null,
        sleep_hours: entry.sleep_hours ?? null,
        exercised: entry.exercised ?? false,
        workout_type: entry.workout_type ?? null,
        bath: entry.bath ?? false,
        meditated: entry.meditated ?? false,
        meals: entry.meals ?? null,
        went_well: entry.went_well ?? null,
        improve: entry.improve ?? null,
        notes: entry.notes ?? null,
        id: entry.id,
      })
      setEntry(saved ?? { entry_date: date })
      setSaveStatus({ type: 'success', message: 'Entry saved successfully!' })
    } catch (error) {
      console.error('Error saving entry:', error)
      setSaveStatus({ type: 'error', message: 'Failed to save entry. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Today</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Complete your daily log in under 60 seconds
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SWE Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SWE Hours
              </label>
              <input
                type="number"
                step="0.1"
                value={entry.swe_hours || ''}
                onChange={(e) => handleChange('swe_hours', parseFloat(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            {/* Sleep Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sleep Hours
              </label>
              <input
                type="number"
                step="0.1"
                value={entry.sleep_hours || ''}
                onChange={(e) => handleChange('sleep_hours', parseFloat(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            {/* Exercised */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={entry.exercised || false}
                  onChange={(e) => handleChange('exercised', e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-12 h-6 rounded-full transition-colors ${entry.exercised ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${entry.exercised ? 'transform translate-x-6' : ''}`}></span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Exercised today</span>
              </label>
            </div>
            
            {/* Bath */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={entry.bath || false}
                  onChange={(e) => handleChange('bath', e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-12 h-6 rounded-full transition-colors ${entry.bath ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${entry.bath ? 'transform translate-x-6' : ''}`}></span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Took a bath</span>
              </label>
            </div>
            
            {/* Meditated */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={entry.meditated || false}
                  onChange={(e) => handleChange('meditated', e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-12 h-6 rounded-full transition-colors ${entry.meditated ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${entry.meditated ? 'transform translate-x-6' : ''}`}></span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Meditated</span>
              </label>
            </div>
            
            {/* Workouts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Workout Type
              </label>
              <input
                type="text"
                value={entry.workout_type || ''}
                onChange={(e) => handleChange('workout_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g. Running, Yoga, Weight lifting"
              />
            </div>
            
            {/* Meals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meals
              </label>
              <input
                type="text"
                value={entry.meals || ''}
                onChange={(e) => handleChange('meals', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g. 3 meals, healthy"
              />
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Topics Learned */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topics Learned
              </label>
              <textarea
                value={entry.topics || ''}
                onChange={(e) => handleChange('topics', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={2}
                placeholder="What did you learn today?"
              />
            </div>
            
            {/* Work Done */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Work Done
              </label>
              <textarea
                value={entry.work_done || ''}
                onChange={(e) => handleChange('work_done', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={2}
                placeholder="What did you complete?"
              />
            </div>
            
            {/* Went Well */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Went Well
              </label>
              <textarea
                value={entry.went_well || ''}
                onChange={(e) => handleChange('went_well', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={2}
                placeholder="What went well today?"
              />
            </div>
            
            {/* Improve */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Improve
              </label>
              <textarea
                value={entry.improve || ''}
                onChange={(e) => handleChange('improve', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={2}
                placeholder="What can you improve?"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={entry.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Additional thoughts..."
            />
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}