'use client'

import { useState, useEffect } from 'react'
import { getDiaryRange, getFeelingsRange, getOverthoughts } from '@/lib/store'
import { generateGenuineReview, type AIReview } from '@/lib/ai'

export default function AiReviewPage() {
  const [reviews, setReviews] = useState<AIReview[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleGenerateReview = async () => {
    setGenerating(true)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weekStart = oneWeekAgo.toISOString().split('T')[0]
    try {
      const review = await generateGenuineReview(
        weekStart,
        await getDiaryRange(weekStart),
        await getFeelingsRange(weekStart),
        await getOverthoughts()
      )
      setReviews((prev) => [review, ...prev])
    } finally {
      setGenerating(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Review</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Weekly insights from your data
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Weekly Insights</h2>
            <button
              onClick={handleGenerateReview}
              disabled={generating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {generating ? 'Analyzing…' : 'Generate New Review'}
            </button>
          </div>
          
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No reviews generated yet.</p>
              <button
                onClick={handleGenerateReview}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate First Review
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Week of {new Date(review.week_start).toLocaleDateString()}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      AI Generated
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Strengths */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {review.strengths.map((strength: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                            <span className="mr-2">•</span> {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Weaknesses */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Weaknesses</h4>
                      <ul className="space-y-1">
                        {review.weaknesses.map((weakness: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                            <span className="mr-2">•</span> {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Patterns */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Patterns</h4>
                      <ul className="space-y-1">
                        {review.patterns.map((pattern: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                            <span className="mr-2">•</span> {pattern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Action */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Action</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{review.action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}