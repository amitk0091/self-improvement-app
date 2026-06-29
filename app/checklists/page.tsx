'use client'

import { useState, useEffect } from 'react'
import {
  getTemplates,
  getInstances,
  addTemplate,
  deleteTemplate,
  startInstance,
  toggleInstanceItem,
  seedDefaults,
  todayStr,
  type ChecklistTemplate,
  type ChecklistInstance,
} from '@/lib/store'

export default function ChecklistsPage() {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([])
  const [instances, setInstances] = useState<ChecklistInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'templates' | 'instances'>('templates')
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [itemsText, setItemsText] = useState('')

  const refresh = async () => {
    setTemplates(await getTemplates())
    setInstances(await getInstances(todayStr()))
  }

  useEffect(() => {
    (async () => {
      await seedDefaults()
      await refresh()
      setLoading(false)
    })()
  }, [])

  const handleCreate = async () => {
    const labels = itemsText.split('\n').map((l) => l.trim()).filter(Boolean)
    if (!name.trim() || labels.length === 0) return
    await addTemplate(name.trim(), labels)
    setName('')
    setItemsText('')
    setCreating(false)
    await refresh()
  }

  const handleStart = async (templateId: string) => {
    await startInstance(templateId, todayStr())
    setActiveTab('instances')
    await refresh()
  }

  const handleToggle = async (instanceId: string, itemId: string) => {
    setInstances(await toggleInstanceItem(instanceId, itemId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Checklists</h1>
          <p className="text-muted-foreground mt-1">Manage your daily checklists</p>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border shadow-sm overflow-hidden">
          <div className="border-b px-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'templates'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Templates
              </button>
              <button
                onClick={() => setActiveTab('instances')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'instances'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Today's Instances
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'templates' ? (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Checklist Templates</h2>

                {templates.length === 0 ? (
                  <p className="text-muted-foreground">No templates yet. Create one to get started.</p>
                ) : (
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <div key={template.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-foreground">{template.name}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStart(template.id)}
                              className="px-3 py-1 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90"
                            >
                              Start today
                            </button>
                            <button
                              onClick={() => { deleteTemplate(template.id); refresh() }}
                              className="px-3 py-1 text-xs font-medium rounded-md border text-muted-foreground hover:bg-accent"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {template.items?.map((item) => (
                            <li key={item.id} className="text-sm text-muted-foreground flex items-start">
                              <span className="mr-2">•</span> {item.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {creating ? (
                  <div className="mt-6 border rounded-lg p-4 space-y-3">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Template name"
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    />
                    <textarea
                      value={itemsText}
                      onChange={(e) => setItemsText(e.target.value)}
                      placeholder="One item per line"
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleCreate}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90"
                      >
                        Save Template
                      </button>
                      <button
                        onClick={() => setCreating(false)}
                        className="px-4 py-2 text-sm font-medium rounded-md border hover:bg-accent"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setCreating(true)}
                    className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90"
                  >
                    Create New Template
                  </button>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Today's Checklist Instances</h2>

                {instances.length === 0 ? (
                  <p className="text-muted-foreground">No instances created for today. Start one from Templates.</p>
                ) : (
                  <div className="space-y-4">
                    {instances.map((instance) => (
                      <div key={instance.id} className="border rounded-lg p-4">
                        <h3 className="font-medium text-foreground">
                          {templates.find((t) => t.id === instance.template_id)?.name || 'Checklist'}
                        </h3>
                        <div className="mt-3 space-y-2">
                          {instance.items.map((item) => (
                            <label key={item.id} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                              <input
                                type="checkbox"
                                checked={item.done}
                                onChange={() => handleToggle(instance.id, item.id)}
                                className="h-4 w-4 rounded border-input"
                              />
                              <span className={item.done ? 'line-through text-muted-foreground' : ''}>{item.label}</span>
                            </label>
                          ))}
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground">Completion: {instance.completion_pct}%</p>
                          <div className="w-full bg-muted rounded-full h-2.5 mt-1">
                            <div
                              className="bg-primary h-2.5 rounded-full transition-all"
                              style={{ width: `${instance.completion_pct}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}