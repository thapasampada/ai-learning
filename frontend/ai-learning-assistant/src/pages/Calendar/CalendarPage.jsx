import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  ListTodo,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../../components/common/Modal'
import Spinner from '../../components/common/Spinner'
import taskService from '../../services/taskService'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const categories = [
  { value: 'study', label: 'Study', color: 'bg-[#EAF2F2] text-[#3D7F87]' },
  { value: 'exam', label: 'Exam', color: 'bg-[#FFF1E8] text-[#C66B30]' },
  { value: 'personal', label: 'Personal', color: 'bg-[#F4EDF8] text-[#8B5EA5]' },
]

const dateKey = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDate = value =>
  new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

const getCategory = value =>
  categories.find(category => category.value === value) || { ...categories[0], label: 'Task' }

const emptyForm = dueDate => ({
  title: '',
  description: '',
  dueDate,
  category: 'study',
  completed: false,
})

const CalendarPage = () => {
  const today = useMemo(() => new Date(), [])
  const [tasks, setTasks] = useState([])
  const [selectedDate, setSelectedDate] = useState(dateKey(today))
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [form, setForm] = useState(() => emptyForm(dateKey(today)))
  const [saving, setSaving] = useState(false)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setLoadError(false)
    try {
      setTasks(await taskService.getTasks())
    } catch (error) {
      console.error(error)
      setLoadError(true)
      toast.error(error.response?.data?.error || 'Could not load your tasks.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const tasksByDate = useMemo(() => {
    return tasks.reduce((grouped, task) => {
      grouped[task.dueDate] = [...(grouped[task.dueDate] || []), task]
      return grouped
    }, {})
  }, [tasks])

  const calendarDays = useMemo(() => {
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
    const startDate = new Date(firstDay)
    startDate.setDate(firstDay.getDate() - firstDay.getDay())
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + index)
      return date
    })
  }, [visibleMonth])

  const selectedTasks = (tasksByDate[selectedDate] || []).slice().sort((a, b) => {
    return Number(a.completed) - Number(b.completed) || a.title.localeCompare(b.title)
  })
  const completedCount = tasks.filter(task => task.completed).length
  const pendingCount = tasks.length - completedCount

  const changeMonth = offset => {
    setVisibleMonth(current => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  const openNewTask = () => {
    setEditingTask(null)
    setForm(emptyForm(selectedDate))
    setIsModalOpen(true)
  }

  const openEditTask = task => {
    setEditingTask(task)
    setForm({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate,
      category: task.category,
      completed: task.completed,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleSaveTask = async event => {
    event.preventDefault()
    if (!form.title.trim()) {
      toast.error('Enter a task title.')
      return
    }
    setSaving(true)
    try {
      const savedTask = editingTask
        ? await taskService.updateTask(editingTask._id, form)
        : await taskService.createTask(form)

      setTasks(current => editingTask
        ? current.map(task => task._id === savedTask._id ? savedTask : task)
        : [...current, savedTask])
      setSelectedDate(savedTask.dueDate)
      setVisibleMonth(new Date(
        Number(savedTask.dueDate.slice(0, 4)),
        Number(savedTask.dueDate.slice(5, 7)) - 1,
        1
      ))
      setIsModalOpen(false)
      setEditingTask(null)
      toast.success(editingTask ? 'Task updated.' : 'Task added to your calendar.')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not save your task.')
    } finally {
      setSaving(false)
    }
  }

  const toggleTask = async task => {
    try {
      const updatedTask = await taskService.updateTask(task._id, {
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate,
        category: task.category,
        completed: !task.completed,
      })
      setTasks(current => current.map(item => item._id === task._id ? updatedTask : item))
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not update task status.')
    }
  }

  const handleDeleteTask = async task => {
    try {
      await taskService.deleteTask(task._id)
      setTasks(current => current.filter(item => item._id !== task._id))
      toast.success('Task deleted.')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not delete task.')
    }
  }

  const monthLabel = visibleMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return (
    <div className="mx-auto max-w-7xl px-1 py-3 sm:px-2">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#4F9DA6]">
            <CalendarDays size={17} />
            <span>STAY ON TRACK</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2A3439]">Calendar & tasks</h1>
          <p className="mt-1 text-sm text-[#647278]">Plan your study sessions and keep every deadline in sight.</p>
        </div>
        <button
          type="button"
          onClick={openNewTask}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#4F9DA6] to-[#3D7F87] px-5 text-sm font-semibold text-white shadow-md shadow-[#4F9DA6]/20 transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F9DA6]/40"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add task
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:max-w-lg">
        <div className="flex items-center gap-3 rounded-2xl border border-[#DCE6E8] bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2F2] text-[#3D7F87]">
            <ListTodo size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#647278]">To do</p>
            <p className="text-xl font-bold text-[#2A3439]">{pendingCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[#DCE6E8] bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF5EE] text-[#5C9468]">
            <Check size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#647278]">Completed</p>
            <p className="text-xl font-bold text-[#2A3439]">{completedCount}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-80 items-center justify-center"><Spinner /></div>
      ) : loadError ? (
        <div className="rounded-2xl border border-[#DCE6E8] bg-white px-6 py-12 text-center">
          <p className="mb-4 text-sm text-[#647278]">Your calendar could not be loaded.</p>
          <button type="button" onClick={fetchTasks} className="font-semibold text-[#3D7F87] hover:underline">
            Try again
          </button>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
          <section className="overflow-hidden rounded-2xl border border-[#DCE6E8] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAF0F1] px-4 py-4 sm:px-6">
              <h2 className="text-lg font-bold text-[#2A3439]">{monthLabel}</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1))
                    setSelectedDate(dateKey(today))
                  }}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-[#3D7F87] hover:bg-[#EAF2F2]"
                >
                  Today
                </button>
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => changeMonth(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE6E8] text-[#647278] hover:bg-[#F7FAFB]"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => changeMonth(1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE6E8] text-[#647278] hover:bg-[#F7FAFB]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-[#EAF0F1] bg-[#FAFCFC]">
              {weekDays.map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold uppercase tracking-wide text-[#859197]">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map(day => {
                const key = dateKey(day)
                const dayTasks = tasksByDate[key] || []
                const isCurrentMonth = day.getMonth() === visibleMonth.getMonth()
                const isToday = key === dateKey(today)
                const isSelected = key === selectedDate

                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setSelectedDate(key)}
                    aria-label={`${formatDate(key)}${dayTasks.length ? `, ${dayTasks.length} tasks` : ''}`}
                    aria-pressed={isSelected}
                    className={`min-h-[82px] border-b border-r border-[#EAF0F1] p-1.5 text-left transition hover:bg-[#F7FAFB] sm:min-h-[108px] sm:p-2 ${
                      isSelected ? 'bg-[#F0F7F7] ring-1 ring-inset ring-[#4F9DA6]/40' : 'bg-white'
                    }`}
                  >
                    <span className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                      isToday ? 'bg-[#4F9DA6] text-white' : isCurrentMonth ? 'text-[#2A3439]' : 'text-[#B3BDC1]'
                    }`}>
                      {day.getDate()}
                    </span>
                    <span className="mt-1 hidden space-y-1 sm:block">
                      {dayTasks.slice(0, 2).map(task => (
                        <span
                          key={task._id}
                          className={`block truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            task.completed ? 'bg-[#F1F4F4] text-[#899397] line-through' : getCategory(task.category).color
                          }`}
                        >
                          {task.title}
                        </span>
                      ))}
                      {dayTasks.length > 2 && (
                        <span className="block px-1 text-[10px] font-semibold text-[#647278]">
                          +{dayTasks.length - 2} more
                        </span>
                      )}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="mt-1 flex justify-center gap-0.5 sm:hidden" aria-hidden="true">
                        {dayTasks.slice(0, 3).map(task => (
                          <span key={task._id} className={`h-1 w-1 rounded-full ${task.completed ? 'bg-[#B5C0C2]' : 'bg-[#4F9DA6]'}`} />
                        ))}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-[#DCE6E8] bg-white">
            <div className="flex items-start justify-between gap-3 border-b border-[#EAF0F1] px-5 py-5">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#4F9DA6]">Your agenda</p>
                <h2 className="text-lg font-bold text-[#2A3439]">{formatDate(selectedDate)}</h2>
                <p className="mt-1 text-xs text-[#859197]">{selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'}</p>
              </div>
              <button
                type="button"
                onClick={openNewTask}
                aria-label="Add task for selected date"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F2] text-[#3D7F87] hover:bg-[#DCEBEC]"
              >
                <Plus size={19} />
              </button>
            </div>

            {selectedTasks.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3F7F7] text-[#8CA5A8]">
                  <CalendarDays size={22} />
                </div>
                <p className="text-sm font-semibold text-[#2A3439]">Nothing planned yet</p>
                <p className="mt-1 text-xs text-[#859197]">Add a task to make this day count.</p>
                <button type="button" onClick={openNewTask} className="mt-4 text-sm font-semibold text-[#3D7F87] hover:underline">
                  Create a task
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#EAF0F1]">
                {selectedTasks.map(task => {
                  const category = getCategory(task.category)
                  return (
                    <article key={task._id} className="group flex gap-3 px-5 py-4">
                      <button
                        type="button"
                        aria-label={task.completed ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
                        onClick={() => toggleTask(task)}
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                          task.completed
                            ? 'border-[#4F9DA6] bg-[#4F9DA6] text-white'
                            : 'border-[#C6D1D3] text-transparent hover:border-[#4F9DA6]'
                        }`}
                      >
                        {task.completed ? <Check size={12} strokeWidth={3} /> : <Circle size={7} fill="currentColor" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <h3 className={`break-words text-sm font-semibold ${
                          task.completed ? 'text-[#899397] line-through' : 'text-[#2A3439]'
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-relaxed text-[#647278]">
                            {task.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${category.color}`}>
                            {category.label}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#859197]">
                            <Clock3 size={11} />
                            All day
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-start gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                        <button
                          type="button"
                          aria-label={`Edit ${task.title}`}
                          onClick={() => openEditTask(task)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#859197] hover:bg-[#EAF2F2] hover:text-[#3D7F87]"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${task.title}`}
                          onClick={() => handleDeleteTask(task)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#859197] hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? 'Edit task' : 'Add a task'}
      >
        <form onSubmit={handleSaveTask} className="space-y-4">
          <div>
            <label htmlFor="task-title" className="mb-1.5 block text-sm font-semibold text-[#2A3439]">Task name</label>
            <input
              id="task-title"
              type="text"
              value={form.title}
              onChange={event => setForm(current => ({ ...current, title: event.target.value }))}
              maxLength={120}
              required
              autoFocus
              placeholder="e.g. Review chapter 4"
              className="h-11 w-full rounded-xl border border-[#DCE6E8] px-3 text-sm outline-none transition focus:border-[#4F9DA6] focus:ring-2 focus:ring-[#4F9DA6]/15"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="task-date" className="mb-1.5 block text-sm font-semibold text-[#2A3439]">Date</label>
              <input
                id="task-date"
                type="date"
                value={form.dueDate}
                onChange={event => setForm(current => ({ ...current, dueDate: event.target.value }))}
                required
                className="h-11 w-full rounded-xl border border-[#DCE6E8] px-3 text-sm outline-none transition focus:border-[#4F9DA6] focus:ring-2 focus:ring-[#4F9DA6]/15"
              />
            </div>
            <div>
              <label htmlFor="task-category" className="mb-1.5 block text-sm font-semibold text-[#2A3439]">Category</label>
              <select
                id="task-category"
                value={form.category}
                onChange={event => setForm(current => ({ ...current, category: event.target.value }))}
                className="h-11 w-full rounded-xl border border-[#DCE6E8] bg-white px-3 text-sm outline-none transition focus:border-[#4F9DA6] focus:ring-2 focus:ring-[#4F9DA6]/15"
              >
                {categories.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="task-description" className="mb-1.5 block text-sm font-semibold text-[#2A3439]">
              Notes <span className="font-normal text-[#859197]">(optional)</span>
            </label>
            <textarea
              id="task-description"
              value={form.description}
              onChange={event => setForm(current => ({ ...current, description: event.target.value }))}
              maxLength={500}
              rows={3}
              placeholder="Add a few details..."
              className="w-full resize-y rounded-xl border border-[#DCE6E8] px-3 py-2.5 text-sm outline-none transition focus:border-[#4F9DA6] focus:ring-2 focus:ring-[#4F9DA6]/15"
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-[#EAF0F1] pt-4">
            <button type="button" onClick={closeModal} disabled={saving} className="inline-flex h-10 items-center gap-1 rounded-xl px-4 text-sm font-semibold text-[#647278] hover:bg-[#F3F7F7] disabled:opacity-50">
              <X size={15} />
              Cancel
            </button>
            <button type="submit" disabled={saving} className="h-10 rounded-xl bg-[#3D7F87] px-5 text-sm font-semibold text-white hover:bg-[#326B72] disabled:cursor-wait disabled:opacity-60">
              {saving ? 'Saving...' : editingTask ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default CalendarPage
