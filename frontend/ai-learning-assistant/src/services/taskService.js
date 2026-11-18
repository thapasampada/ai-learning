import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'

const getTasks = async () => {
    const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL)
    return response.data.data
}

const createTask = async task => {
    const response = await axiosInstance.post(API_PATHS.TASKS.CREATE, task)
    return response.data.data
}

const updateTask = async (id, task) => {
    const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE(id), task)
    return response.data.data
}

const deleteTask = async id => {
    const response = await axiosInstance.delete(API_PATHS.TASKS.DELETE(id))
    return response.data.data
}

const taskService = { getTasks, createTask, updateTask, deleteTask }

export default taskService
