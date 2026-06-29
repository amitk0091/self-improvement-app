'use client'

import { useState, useEffect } from 'react'
import { getTodos, addTodo, toggleTodo, deleteTodo, todayStr, type Todo } from '@/lib/store'

function deadlineMeta(deadline: string | null, done: boolean) {
  if (done || !deadline) return { label: deadline ? '' : 'No deadline', cls: 'text-gray-400 dark:text-gray-500' }
  const days = Math.round((new Date(deadline).getTime() - new Date(todayStr()).getTime()) / 86400000)
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, cls: 'text-red-600 dark:text-red-400 font-medium' }
  if (days === 0) return { label: 'Today', cls: 'text-orange-600 dark:text-orange-400 font-medium' }
  if (days === 1) return { label: 'Tomorrow', cls: 'text-amber-600 dark:text-amber-400' }
  if (days <= 7) return { label: `${days}d left`, cls: 'text-yellow-600 dark:text-yellow-400' }
  return { label: `${days}d left`, cls: 'text-gray-500 dark:text-gray-400' }
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(true)

  const refresh = async () => setTodos(await getTodos())

  useEffect(() => {
    refresh().then(() => setLoading(false))
  }, [])

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    await addTodo(title.trim(), deadline || null)
    setTitle('')
    setDeadline('')
    await refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Todos</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Sorted by deadline — nearest first.</p>
        </div>

        <form onSubmit={onAdd} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
          />
          <button type="submit" className="rounded-md bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-white font-medium">Add</button>
        </form>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : todos.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">No todos yet.</div>
        ) : (
          <ul className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
            {todos.map((t) => {
              const m = deadlineMeta(t.deadline, t.done)
              return (
                <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id).then(refresh)} className="h-5 w-5 rounded" />
                  <span className={`flex-1 ${t.done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>{t.title}</span>
                  {t.deadline && <span className="text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{new Date(t.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                  <span className={`text-sm whitespace-nowrap ${m.cls}`}>{m.label}</span>
                  <button onClick={() => deleteTodo(t.id).then(refresh)} className="text-gray-400 hover:text-red-500 px-1" title="Delete">✕</button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
