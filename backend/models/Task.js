import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ''
    },
    dueDate: {
        type: String,
        required: true,
        validate: {
            validator: value => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
                const [year, month, day] = value.split('-').map(Number)
                const date = new Date(Date.UTC(year, month - 1, day))
                return date.getUTCFullYear() === year &&
                    date.getUTCMonth() === month - 1 &&
                    date.getUTCDate() === day
            },
            message: 'Due date must be a valid calendar date'
        }
    },
    category: {
        type: String,
        enum: ['study', 'exam', 'personal'],
        default: 'study'
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

taskSchema.index({ userId: 1, dueDate: 1 })

const Task = mongoose.model('Task', taskSchema)

export default Task
