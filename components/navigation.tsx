'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Close menu when navigating
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])
  
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">Personal OS</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
              href="/today"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === '/today'
                  ? 'border-indigo-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Today
            </Link>
            <Link
              href="/checklists"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === '/checklists'
                  ? 'border-indigo-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Checklists
            </Link>
            <Link
              href="/feelings"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === '/feelings'
                  ? 'border-indigo-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Feelings
            </Link>
            <Link
              href="/overthinking"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === '/overthinking'
                  ? 'border-indigo-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Overthinking
            </Link>
            <Link
              href="/goals"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === '/goals'
                  ? 'border-indigo-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Goals
            </Link>
            <Link
              href="/logs"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === '/logs'
                  ? 'border-indigo-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Logs
            </Link>
            <Link
              href="/analytics"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === '/analytics'
                  ? 'border-indigo-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Analytics
            </Link>
            <Link
              href="/ai-review"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === '/ai-review'
                  ? 'border-indigo-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              AI Review
            </Link>
            <Link
              href="/settings"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === '/settings'
                  ? 'border-indigo-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Settings
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/today"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/today'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:text-indigo-500'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Today
            </Link>
            <Link
              href="/checklists"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/checklists'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:text-indigo-500'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Checklists
            </Link>
            <Link
              href="/feelings"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/feelings'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:text-indigo-500'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Feelings
            </Link>
            <Link
              href="/overthinking"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/overthinking'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:text-indigo-500'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Overthinking
            </Link>
            <Link
              href="/goals"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/goals'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:text-indigo-500'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Goals
            </Link>
            <Link
              href="/logs"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/logs'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:text-indigo-500'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Logs
            </Link>
            <Link
              href="/analytics"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/analytics'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:text-indigo-500'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Analytics
            </Link>
            <Link
              href="/ai-review"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/ai-review'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:text-indigo-500'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              AI Review
            </Link>
            <Link
              href="/settings"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/settings'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:text-indigo-500'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}