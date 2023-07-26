import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from '../utils/build-route-path.js'

const database = new Database()


export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
            } : null)
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const task = database.searchById('tasks',id)
            return res.end(JSON.stringify(task))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            if (!title || !description){
                const missingField = !title ? 'title' : 'description'
                return res.writeHead(400).end('O campo '+missingField+' é obrigatório.');
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                created_at: new Date(),
                updated_at: null,
                completed_at: null,
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const taskRes = database.delete('tasks', id)
            return res.end(taskRes)
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body
            const { created_at, completed_at } = database.searchById('tasks', id)
            const taskRes = database.update('tasks', id,  { title, description, updated_at: new Date(), created_at, completed_at})
            return res.writeHead(200).end(taskRes)
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description, created_at } = database.searchById('tasks', id)
            const taskRes = database.update('tasks', id,  { title, description, updated_at: new Date(), completed_at: new Date(), created_at })
            return res.writeHead(200).end(taskRes)
        }
    }

]