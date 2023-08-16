import { apiRoutes } from "@/http/routes/api"
import fastify from 'fastify'

export const app = fastify()

app.register(apiRoutes)


