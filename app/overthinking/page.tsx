'use client'

import { useState, useEffect } from 'react'
import { getOverthoughts, addOverthought, resolveOverthought } from '@/lib/store'

export default function OverthinkingPage() {
  const [thoughts, setThoughts] = useState<any[]>([])
  const [newThought, setNewThought] = useState({
    category: 'work',
    intensity: 5,
    content: ''
  })
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    (async () => {
      setThoughts(await getOverthoughts())
      setLoading(false)
    })()
  }, [])

  const handleAddThought = async () => {
    if (!newThought.content.trim()) return
    await addOverthought({
      category: newThought.category as any,
      intensity: newThought.intensity,
      content: newThought.content,
    })
    setThoughts(await getOverthoughts())
    setNewThought({ category: 'work', intensity: 5, content: '' })
    setIsAdding(false)
  }

  const handleResolveThought = async (id: string) => {
    await resolveOverthought(id)
    setThoughts(await getOverthoughts())
  }
  
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Overthinking Journal</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Capture and park your thoughts to reflect on later
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Thought
          </button>
          
          {isAdding && (
            <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Capture Your Thought</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newThought.category}
                    onChange={(e) => setNewThought({...newThought, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="work">Work</option>
                    <option value="future">Future</option>
                    <option value="health">Health</option>
                    <option value="money">Money</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Intensity (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newThought.intensity}
                    onChange={(e) => setNewThought({...newThought, intensity: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <span>1</span>
                    <span className="font-medium">{newThought.intensity}</span>
                    <span>10</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your thought
                </label>
                <textarea
                  value={newThought.content}
                  onChange={(e) => setNewThought({...newThought, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="What's been on your mind..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleAddThought}
                  disabled={!newThought.content.trim()}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Save Thought
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Thoughts</h2>
            
            {thoughts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No thoughts captured yet.</p>
            ) : (
              <div className="space-y-4">
                {thoughts.map((thought) => (
                  <div key={thought.id} className={`p-4 rounded-lg border ${thought.resolved ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          thought.category === 'work' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          thought.category === 'future' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                          thought.category === 'health' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {thought.category}
                        </span>
                        
                        <div className="mt-2">
                          <p className="text-gray-900 dark:text-white">{thought.content}</p>
                          
                          <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>Intensity: {thought.intensity}/10</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(thought.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {!thought.resolved && (
                        <button
                          onClick={() => handleResolveThought(thought.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Park
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}