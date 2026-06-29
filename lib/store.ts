'use client'

// Cloud-first data store for Personal OS.
// Syncs to Supabase (Postgres) so data follows you across phone, tablet and desktop.
// Single shared account (no login): all rows use a fixed USER_ID.
// If Supabase env vars are missing, falls back to localStorage so the app still runs.

import { supabase, isSupabaseConfigured } from './supabase'

export const USER_ID = '00000000-0000-0000-0000-000000000001'

export type DiaryEntry = {
  id: string
  entry_date: string
  swe_hours: number | null
  topics: string | null
  work_done: string | null
  sleep_hours: number | null
  exercised: boolean
  workout_type: string | null
  bath: boolean
  meditated: boolean
  meals: string | null
  went_well: string | null
  improve: string | null
  notes: string | null
}

export type Feeling = {
  id: string
  date: string
  mood: number
  motivation: number
  stress: number
  gratitude: string
  note: string
}

export type Overthought = {
  id: string
  category: 'work' | 'future' | 'health' | 'money'
  intensity: number
  content: string
  resolved: boolean
  created_at: string
}

export type ChecklistItem = { id: string; label: string; done: boolean }

export type ChecklistTemplate = {
  id: string
  name: string
  items: ChecklistItem[]
  created_at: string
}

export type ChecklistInstance = {
  id: string
  template_id: string
  date: string
  items: ChecklistItem[]
  completion_pct: number
}

export type Profile = {
  display_name: string
  reminder_time: string
  theme: 'light' | 'dark'
  timezone: string
  swe_target: number
  workout_target: number
}

export type Milestone = { id: string; label: string; done: boolean }

export type Todo = {
  id: string
  title: string
  deadline: string | null
  done: boolean
  created_at: string
}
export type Goal = {
  id: string
  name: string
  category: 'swe' | 'fitness' | 'business' | 'finance' | 'ssc' | 'content'
  milestones: Milestone[]
  active: boolean
  created_at: string
}

const KEYS = {
  diary: 'pos.diary',
  feelings: 'pos.feelings',
  overthoughts: 'pos.overthoughts',
  templates: 'pos.templates',
  instances: 'pos.instances',
  profile: 'pos.profile',
  goals: 'pos.goals',
  todos: 'pos.todos',
} as const

export const todayStr = () => new Date().toISOString().split('T')[0]
const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function write<T>(key: string, value: T): T {
  if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value))
  return value
}

const cloud = isSupabaseConfigured

// ---- Diary ----
export async function getDiary(date: string): Promise<DiaryEntry | null> {
  if (!cloud) return read<DiaryEntry[]>(KEYS.diary, []).find((e) => e.entry_date === date) || null
  const { data } = await supabase.from('diary_entries').select('*').eq('user_id', USER_ID).eq('entry_date', date).maybeSingle()
  return (data as DiaryEntry) || null
}
export async function getDiaryRange(fromDate: string): Promise<DiaryEntry[]> {
  if (!cloud) return read<DiaryEntry[]>(KEYS.diary, []).filter((e) => e.entry_date >= fromDate).sort((a, b) => a.entry_date.localeCompare(b.entry_date))
  const { data } = await supabase.from('diary_entries').select('*').eq('user_id', USER_ID).gte('entry_date', fromDate).order('entry_date', { ascending: true })
  return (data as DiaryEntry[]) || []
}
export async function saveDiary(entry: Omit<DiaryEntry, 'id'> & { id?: string }): Promise<DiaryEntry> {
  if (!cloud) {
    const all = read<DiaryEntry[]>(KEYS.diary, [])
    const idx = all.findIndex((e) => e.entry_date === entry.entry_date)
    const saved: DiaryEntry = { ...entry, id: entry.id ?? all[idx]?.id ?? uid() }
    if (idx >= 0) all[idx] = saved; else all.push(saved)
    write(KEYS.diary, all)
    return saved
  }
  const { id, ...rest } = entry
  const { data } = await supabase.from('diary_entries').upsert({ ...rest, user_id: USER_ID }, { onConflict: 'user_id,entry_date' }).select().single()
  return (data as DiaryEntry) ?? { ...entry, id: id ?? uid() }
}

// ---- Feelings ----
export async function getFeeling(date: string): Promise<Feeling | null> {
  if (!cloud) return read<Feeling[]>(KEYS.feelings, []).find((f) => f.date === date) || null
  const { data } = await supabase.from('feelings').select('*').eq('user_id', USER_ID).eq('date', date).maybeSingle()
  return (data as Feeling) || null
}
export async function getFeelingsRange(fromDate: string): Promise<Feeling[]> {
  if (!cloud) return read<Feeling[]>(KEYS.feelings, []).filter((f) => f.date >= fromDate).sort((a, b) => a.date.localeCompare(b.date))
  const { data } = await supabase.from('feelings').select('*').eq('user_id', USER_ID).gte('date', fromDate).order('date', { ascending: true })
  return (data as Feeling[]) || []
}
export async function saveFeeling(f: Omit<Feeling, 'id'> & { id?: string }): Promise<Feeling> {
  if (!cloud) {
    const all = read<Feeling[]>(KEYS.feelings, [])
    const idx = all.findIndex((x) => x.date === f.date)
    const saved: Feeling = { ...f, id: f.id ?? all[idx]?.id ?? uid() }
    if (idx >= 0) all[idx] = saved; else all.push(saved)
    write(KEYS.feelings, all)
    return saved
  }
  const { id, ...rest } = f
  const { data } = await supabase.from('feelings').upsert({ ...rest, user_id: USER_ID }, { onConflict: 'user_id,date' }).select().single()
  return (data as Feeling) ?? { ...f, id: id ?? uid() }
}

// ---- Overthoughts ----
export async function getOverthoughts(): Promise<Overthought[]> {
  if (!cloud) return read<Overthought[]>(KEYS.overthoughts, []).sort((a, b) => b.created_at.localeCompare(a.created_at))
  const { data, error } = await supabase.from('overthoughts').select('*').eq('user_id', USER_ID).order('created_at', { ascending: false })
  if (error) console.error('getOverthoughts error:', error.message)
  return (data as Overthought[]) || []
}
export async function addOverthought(o: Omit<Overthought, 'id' | 'created_at' | 'resolved'>): Promise<Overthought> {
  if (!cloud) {
    const all = read<Overthought[]>(KEYS.overthoughts, [])
    const saved: Overthought = { ...o, id: uid(), resolved: false, created_at: new Date().toISOString() }
    write(KEYS.overthoughts, [saved, ...all])
    return saved
  }
  const { data, error } = await supabase.from('overthoughts').insert({ ...o, resolved: false, user_id: USER_ID }).select().single()
  if (error) console.error('addOverthought error:', error.message)
  return (data as Overthought) ?? { ...o, id: uid(), resolved: false, created_at: new Date().toISOString() }
}
export async function resolveOverthought(id: string): Promise<void> {
  if (!cloud) {
    write(KEYS.overthoughts, read<Overthought[]>(KEYS.overthoughts, []).map((o) => (o.id === id ? { ...o, resolved: true } : o)))
    return
  }
  await supabase.from('overthoughts').update({ resolved: true }).eq('id', id)
}

// ---- Checklist templates ----
export async function getTemplates(): Promise<ChecklistTemplate[]> {
  if (!cloud) return read<ChecklistTemplate[]>(KEYS.templates, [])
  const { data } = await supabase.from('checklist_templates').select('*').eq('user_id', USER_ID)
  return (data as ChecklistTemplate[]) || []
}
export async function addTemplate(name: string, labels: string[]): Promise<ChecklistTemplate> {
  const items: ChecklistItem[] = labels.map((l) => ({ id: uid(), label: l, done: false }))
  if (!cloud) {
    const t: ChecklistTemplate = { id: uid(), name, items, created_at: new Date().toISOString() }
    write(KEYS.templates, [...read<ChecklistTemplate[]>(KEYS.templates, []), t])
    return t
  }
  const { data } = await supabase.from('checklist_templates').insert({ name, items, user_id: USER_ID }).select().single()
  return (data as ChecklistTemplate) ?? { id: uid(), name, items, created_at: new Date().toISOString() }
}
export async function deleteTemplate(id: string): Promise<void> {
  if (!cloud) {
    write(KEYS.templates, read<ChecklistTemplate[]>(KEYS.templates, []).filter((t) => t.id !== id))
    return
  }
  await supabase.from('checklist_templates').delete().eq('id', id)
}

// ---- Checklist instances ----
export async function getInstances(date: string): Promise<ChecklistInstance[]> {
  if (!cloud) return read<ChecklistInstance[]>(KEYS.instances, []).filter((i) => i.date === date)
  const { data } = await supabase.from('checklist_instances').select('*').eq('user_id', USER_ID).eq('date', date)
  return (data as ChecklistInstance[]) || []
}
export async function startInstance(templateId: string, date: string): Promise<ChecklistInstance> {
  if (!cloud) {
    const all = read<ChecklistInstance[]>(KEYS.instances, [])
    const existing = all.find((i) => i.template_id === templateId && i.date === date)
    if (existing) return existing
    const tpl = read<ChecklistTemplate[]>(KEYS.templates, []).find((t) => t.id === templateId)
    const inst: ChecklistInstance = { id: uid(), template_id: templateId, date, items: (tpl?.items || []).map((i) => ({ ...i, done: false })), completion_pct: 0 }
    write(KEYS.instances, [...all, inst])
    return inst
  }
  const existing = await supabase.from('checklist_instances').select('*').eq('user_id', USER_ID).eq('template_id', templateId).eq('date', date).maybeSingle()
  if (existing.data) return existing.data as ChecklistInstance
  const tpl = (await getTemplates()).find((t) => t.id === templateId)
  const items = (tpl?.items || []).map((i) => ({ ...i, done: false }))
  const { data } = await supabase.from('checklist_instances').insert({ template_id: templateId, date, items, completion_pct: 0, user_id: USER_ID }).select().single()
  return (data as ChecklistInstance) ?? { id: uid(), template_id: templateId, date, items, completion_pct: 0 }
}
export async function toggleInstanceItem(instanceId: string, itemId: string): Promise<ChecklistInstance[]> {
  if (!cloud) {
    const all = read<ChecklistInstance[]>(KEYS.instances, []).map((inst) => {
      if (inst.id !== instanceId) return inst
      const items = inst.items.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it))
      const pct = items.length ? Math.round((items.filter((i) => i.done).length / items.length) * 100) : 0
      return { ...inst, items, completion_pct: pct }
    })
    write(KEYS.instances, all)
    return all.filter((i) => i.date === todayStr())
  }
  const today = todayStr()
  const list = await getInstances(today)
  const target = list.find((i) => i.id === instanceId)
  if (target) {
    const items = target.items.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it))
    const pct = items.length ? Math.round((items.filter((i) => i.done).length / items.length) * 100) : 0
    await supabase.from('checklist_instances').update({ items, completion_pct: pct }).eq('id', instanceId)
  }
  return getInstances(today)
}

// ---- Profile ----
const DEFAULT_PROFILE: Profile = {
  display_name: 'You',
  reminder_time: '21:00',
  theme: 'dark',
  timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' : 'UTC',
  swe_target: 6,
  workout_target: 5,
}
export async function getProfile(): Promise<Profile> {
  if (!cloud) return read<Profile>(KEYS.profile, DEFAULT_PROFILE)
  const { data } = await supabase.from('profiles').select('*').eq('id', USER_ID).maybeSingle()
  if (!data) return DEFAULT_PROFILE
  return {
    display_name: data.display_name ?? DEFAULT_PROFILE.display_name,
    reminder_time: data.reminder_time ?? DEFAULT_PROFILE.reminder_time,
    theme: data.theme ?? DEFAULT_PROFILE.theme,
    timezone: data.timezone ?? DEFAULT_PROFILE.timezone,
    swe_target: data.swe_target ?? DEFAULT_PROFILE.swe_target,
    workout_target: data.workout_target ?? DEFAULT_PROFILE.workout_target,
  }
}
export async function saveProfile(p: Profile): Promise<Profile> {
  if (!cloud) return write(KEYS.profile, p)
  await supabase.from('profiles').upsert({ id: USER_ID, ...p })
  return p
}

export async function exportAll() {
  return {
    diary: await getDiaryRange('2000-01-01'),
    feelings: await getFeelingsRange('2000-01-01'),
    overthoughts: await getOverthoughts(),
    templates: await getTemplates(),
    instances: await getInstances(todayStr()),
    profile: await getProfile(),
  }
}

export async function seedDefaults() {
  const existing = await getTemplates()
  if (existing.length === 0) {
    await addTemplate('Morning', ['Hydrate', 'Stretch', 'Meditate', 'Plan day'])
    await addTemplate('Night', ['Reflect', 'Read 20 min', 'No screens', 'Sleep by 11'])
    await addTemplate('Office Day', ['Standup', 'Deep work block', 'Lunch walk', 'Inbox zero'])
  }
}

// ---- Goals ----
export const goalProgress = (g: Goal): number =>
  g.milestones.length === 0 ? 0 : Math.round((g.milestones.filter((m) => m.done).length / g.milestones.length) * 100)

export async function getGoals(): Promise<Goal[]> {
  if (!cloud) return read<Goal[]>(KEYS.goals, [])
  const { data } = await supabase.from('goals').select('*').eq('user_id', USER_ID).order('created_at', { ascending: true })
  return (data as Goal[]) || []
}

export async function addGoal(name: string, category: Goal['category'], milestones: string[]): Promise<Goal> {
  const goal: Goal = {
    id: uid(),
    name,
    category,
    milestones: milestones.map((label) => ({ id: uid(), label, done: false })),
    active: true,
    created_at: new Date().toISOString(),
  }
  if (!cloud) {
    const all = read<Goal[]>(KEYS.goals, [])
    write(KEYS.goals, [...all, goal])
    return goal
  }
  await supabase.from('goals').insert({ ...goal, user_id: USER_ID })
  return goal
}

export async function updateGoal(goal: Goal): Promise<void> {
  if (!cloud) {
    const all = read<Goal[]>(KEYS.goals, []).map((g) => (g.id === goal.id ? goal : g))
    write(KEYS.goals, all)
    return
  }
  await supabase.from('goals').update({ name: goal.name, category: goal.category, milestones: goal.milestones, active: goal.active }).eq('id', goal.id).eq('user_id', USER_ID)
}

export async function toggleMilestone(goalId: string, milestoneId: string): Promise<void> {
  const goals = await getGoals()
  const goal = goals.find((g) => g.id === goalId)
  if (!goal) return
  goal.milestones = goal.milestones.map((m) => (m.id === milestoneId ? { ...m, done: !m.done } : m))
  await updateGoal(goal)
}

export async function deleteGoal(id: string): Promise<void> {
  if (!cloud) {
    write(KEYS.goals, read<Goal[]>(KEYS.goals, []).filter((g) => g.id !== id))
    return
  }
  await supabase.from('goals').delete().eq('id', id).eq('user_id', USER_ID)
}

// ---- Todos ----
const byDeadline = (a: Todo, b: Todo) => {
  if (a.done !== b.done) return a.done ? 1 : -1
  if (!a.deadline) return 1
  if (!b.deadline) return -1
  return a.deadline.localeCompare(b.deadline)
}

export async function getTodos(): Promise<Todo[]> {
  if (!cloud) return read<Todo[]>(KEYS.todos, []).sort(byDeadline)
  const { data, error } = await supabase.from('todos').select('*').eq('user_id', USER_ID)
  if (error) console.error('getTodos error:', error.message)
  return ((data as Todo[]) || []).sort(byDeadline)
}

export async function addTodo(title: string, deadline: string | null): Promise<Todo> {
  const todo: Todo = { id: uid(), title, deadline, done: false, created_at: new Date().toISOString() }
  if (!cloud) {
    write(KEYS.todos, [...read<Todo[]>(KEYS.todos, []), todo])
    return todo
  }
  const { error } = await supabase.from('todos').insert({ ...todo, user_id: USER_ID })
  if (error) console.error('addTodo error:', error.message)
  return todo
}

export async function toggleTodo(id: string): Promise<void> {
  const todos = await getTodos()
  const t = todos.find((x) => x.id === id)
  if (!t) return
  if (!cloud) {
    write(KEYS.todos, read<Todo[]>(KEYS.todos, []).map((x) => (x.id === id ? { ...x, done: !x.done } : x)))
    return
  }
  await supabase.from('todos').update({ done: !t.done }).eq('id', id).eq('user_id', USER_ID)
    .then(({ error }) => { if (error) console.error('toggleTodo error:', error.message) })
}

export async function deleteTodo(id: string): Promise<void> {
  if (!cloud) {
    write(KEYS.todos, read<Todo[]>(KEYS.todos, []).filter((t) => t.id !== id))
    return
  }
  await supabase.from('todos').delete().eq('id', id).eq('user_id', USER_ID)
    .then(({ error }) => { if (error) console.error('deleteTodo error:', error.message) })
}
