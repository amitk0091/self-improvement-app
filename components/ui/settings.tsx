'use client'

import { motion } from 'framer-motion'
import { Card } from './card'
import { Button } from './button'
import { Skeleton } from './skeleton'

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your Personal OS experience
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Account Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card glass={true} hover={true}>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input 
                      type="text" 
                      defaultValue="Alex Johnson"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input 
                      type="email" 
                      defaultValue="alex.johnson@example.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <Button variant="primary" className="mt-4">Save Changes</Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card glass={true} hover={true}>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { id: 'daily', label: 'Daily Summary' },
                    { id: 'checklists', label: 'Checklist Reminders' },
                    { id: 'progress', label: 'Progress Updates' },
                    { id: 'analytics', label: 'Analytics Reports' }
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{notification.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card glass={true} hover={true}>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
                <div className="space-y-3">
                  {[
                    { id: 'light', label: 'Light Mode' },
                    { id: 'dark', label: 'Dark Mode' },
                    { id: 'system', label: 'System Default' }
                  ].map((theme) => (
                    <div key={theme.id} className="flex items-center">
                      <input 
                        type="radio" 
                        id={theme.id} 
                        name="theme"
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        defaultChecked={theme.id === 'dark'}
                      />
                      <label htmlFor={theme.id} className="ml-2 text-gray-700 dark:text-gray-300">{theme.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card glass={true} hover={true}>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Import/Export</h2>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full">Export Data</Button>
                  <Button variant="outline" size="sm" className="w-full">Import Data</Button>
                  <Button variant="outline" size="sm" className="w-full">Reset Progress</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}