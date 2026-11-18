import Task from '../models/Task.js'

const isValidDate = value => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    return date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
}

const validateTask = body => {
    const errors = []

    if (typeof body.title !== 'string' || !body.title.trim()) {
        errors.push('A task title is required')
    } else if (body.title.trim().length > 120) {
        errors.push('Task titles must be 120 characters or fewer')
    }

    if (!isValidDate(body.dueDate)) {
        errors.push('A valid due date is required')
    }

    if (body.description !== undefined &&
        (typeof body.description !== 'string' || body.description.length > 500)) {
        errors.push('Descriptions must be 500 characters or fewer')
    }

    if (body.category !== undefined &&
        !['study', 'exam', 'personal'].includes(body.category)) {
        errors.push('Choose a valid task category')
    }

    if (body.completed !== undefined && typeof body.completed !== 'boolean') {
        errors.push('Task completion must be true or false')
    }

    return errors
}

const taskFields = body => ({
    title: body.title.trim(),
    description: body.description?.trim() || '',
    dueDate: body.dueDate,
    category: body.category || 'study',
    completed: body.completed ?? false
})

export const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).sort({ dueDate: 1, createdAt: 1 })
        res.status(200).json({ success: true, data: tasks })
    } catch (error) {
        next(error)
    }
}

export const createTask = async (req, res, next) => {
    try {
        const errors = validateTask(req.body)
        if (errors.length) {
            return res.status(400).json({ success: false, error: errors.join('. ') })
        }

        const task = await Task.create({
            ...taskFields(req.body),
            userId: req.user._id
        })
        res.status(201).json({ success: true, data: task })
    } catch (error) {
        next(error)
    }
}

export const updateTask = async (req, res, next) => {
    try {
        const errors = validateTask(req.body)
        if (errors.length) {
            return res.status(400).json({ success: false, error: errors.join('. ') })
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            taskFields(req.body),
            { new: true, runValidators: true }
        )

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' })
        }

        res.status(200).json({ success: true, data: task })
    } catch (error) {
        next(error)
    }
}

export const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' })
        }

        res.status(200).json({ success: true, data: { id: task._id } })
    } catch (error) {
        next(error)
    }
}
