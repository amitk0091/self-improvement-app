'use client'

import { useState, useEffect } from 'react'
import { getGoals, addGoal, deleteGoal, toggleMilestone, goalProgress, type Goal } from '@/lib/store'

const CATEGORIES: Goal['category'][] = ['swe', 'fitness', 'business', 'finance', 'ssc', 'content']

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Goal['category']>('swe')
  const [milestones, setMilestones] = useState('')
  const [filter, setFilter] = useState<'all' | Goal['category']>('all')

  const refresh = async () => setGoals(await getGoals())

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const ms = milestones.split('\n').map((s) => s.trim()).filter(Boolean)
    await addGoal(name.trim(), category, ms)
    setName('')
    setMilestones('')
    await refresh()
  }

  const handleToggle = async (goalId: string, mId: string) => {
    await toggleMilestone(goalId, mId)
    await refresh()
  }

  const handleDelete = async (id: string) => {
    await deleteGoal(id)
    await refresh()
  }

  const overall = goals.length
    ? Math.round(goals.reduce((s, g) => s + goalProgress(g), 0) / goals.length)
    : 0

  const visibleGoals = filter === 'all' ? goals : goals.filter((g) => g.category === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto"><p>Loading...</p></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goals</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track goals and check off milestones to grow your progress.
          </p>
        </div>

        {goals.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Overall progress</span>
              <span className="text-gray-900 dark:text-white">{overall}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div className="bg-indigo-600 h-3 rounded-full transition-all" style={{ width: `${overall}%` }} />
            </div>
          </div>
        )}

        <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">New Goal</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Goal name"
              className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Goal['category'])}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <textarea
            value={milestones}
            onChange={(e) => setMilestones(e.target.value)}
            placeholder="One milestone per line"
            rows={3}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white"
          />
          <button type="submit" className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 text-sm font-medium">
            Add Goal
          </button>
        </form>

        <div className="space-y-4">
          {goals.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No goals yet. Add one above.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {(['all', ...CATEGORIES] as const).map((c) => {
                  const count = c === 'all' ? goals.length : goals.filter((g) => g.category === c).length
                  return (
                    <button
                      key={c}
                      onClick={() => setFilter(c)}
                      className={`px-3 py-1 rounded-full text-xs font-medium uppercase transition-colors ${
                        filter === c
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {c} ({count})
                    </button>
                  )
                })}
              </div>
              {visibleGoals.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No goals in this category.</p>
              ) : (
                visibleGoals.map((g) => {
                  const pct = goalProgress(g)
                  return (
                    <div key={g.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{g.name}</h3>
                          <span className="text-xs uppercase text-indigo-600 dark:text-indigo-400">{g.category}</span>
                        </div>
                        <button onClick={() => handleDelete(g.id)} className="text-sm text-red-500 hover:text-red-600">Delete</button>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{pct}%</span>
                      </div>
                      <ul className="space-y-2">
                        {g.milestones.map((m) => (
                          <li key={m.id} className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                            <input
                              type="checkbox"
                              checked={m.done}
                              onChange={() => handleToggle(g.id, m.id)}
                              className="mr-2 h-4 w-4 rounded"
                            />
                            <span className={m.done ? 'line-through text-gray-400' : ''}>{m.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
