import { register } from "@/http/controllers/register.controller"
import { FastifyInstance } from "fastify"

export async function apiRoutes(app: FastifyInstance) {
	app.post('/users', register)
	app.post('/sessions', register)
}