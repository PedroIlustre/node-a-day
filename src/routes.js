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

            const users = database.select('tasks', search ? {
                title: search,
                description: search,
            } : null)
            return res.end(JSON.stringify(users))
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
                created_at:new Date(),
                updated_at:null,
                completed_at:null,
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/users/:id'),
        handler: (req, res) => {
            const { id } = req.params
            database.delete('users', id)
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/users/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { name, email } = req.body

            database.update('users', id,  { name, email })
            return res.writeHead(204).end()
        }
    }

]