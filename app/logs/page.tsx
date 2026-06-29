'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getDiaryRange, getFeelingsRange, type DiaryEntry } from '@/lib/store'

type Row = DiaryEntry & { mood?: number }

export default function LogsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const diary = await getDiaryRange('2000-01-01')
      const feelings = await getFeelingsRange('2000-01-01')
      const moodByDate = new Map(feelings.map((f) => [f.date, f.mood]))
      const merged = diary
        .map((d) => ({ ...d, mood: moodByDate.get(d.entry_date) }))
        .sort((a, b) => b.entry_date.localeCompare(a.entry_date))
      setRows(merged)
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-6xl mx-auto"><p>Loading...</p></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Logs</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">All entries date-wise — compare your whole history at a glance.</p>
        </div>

        {rows.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">
            No daily logs yet. <Link href="/today" className="text-indigo-600 hover:text-indigo-700">Add one →</Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Date</th>
                  <th className="px-3 py-2 text-right font-medium">SWE</th>
                  <th className="px-3 py-2 text-right font-medium">Sleep</th>
                  <th className="px-3 py-2 text-center font-medium">Mood</th>
                  <th className="px-3 py-2 text-center font-medium">Exer.</th>
                  <th className="px-3 py-2 text-left font-medium">Workout</th>
                  <th className="px-3 py-2 text-center font-medium">Bath</th>
                  <th className="px-3 py-2 text-center font-medium">Med.</th>
                  <th className="px-3 py-2 text-left font-medium">Topics Learned</th>
                  <th className="px-3 py-2 text-left font-medium">Work Done</th>
                  <th className="px-3 py-2 text-left font-medium">Meals</th>
                  <th className="px-3 py-2 text-left font-medium">What Went Well</th>
                  <th className="px-3 py-2 text-left font-medium">Improve</th>
                  <th className="px-3 py-2 text-left font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 align-top">
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <Link href={`/today?date=${r.entry_date}`} className="hover:text-indigo-600">
                        {new Date(r.entry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-right">{r.swe_hours ?? '—'}</td>
                    <td className="px-3 py-2 text-right">{r.sleep_hours ?? '—'}</td>
                    <td className="px-3 py-2 text-center">{r.mood ?? '—'}</td>
                    <td className="px-3 py-2 text-center">{r.exercised ? '✓' : '—'}</td>
                    <td className="px-3 py-2 max-w-[8rem] truncate" title={r.workout_type ?? ''}>{r.workout_type || '—'}</td>
                    <td className="px-3 py-2 text-center">{r.bath ? '✓' : '—'}</td>
                    <td className="px-3 py-2 text-center">{r.meditated ? '✓' : '—'}</td>
                    <td className="px-3 py-2 max-w-xs truncate" title={r.topics ?? ''}>{r.topics || '—'}</td>
                    <td className="px-3 py-2 max-w-xs truncate" title={r.work_done ?? ''}>{r.work_done || '—'}</td>
                    <td className="px-3 py-2 max-w-xs truncate" title={r.meals ?? ''}>{r.meals || '—'}</td>
                    <td className="px-3 py-2 max-w-xs truncate" title={r.went_well ?? ''}>{r.went_well || '—'}</td>
                    <td className="px-3 py-2 max-w-xs truncate" title={r.improve ?? ''}>{r.improve || '—'}</td>
                    <td className="px-3 py-2 max-w-xs truncate" title={r.notes ?? ''}>{r.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
