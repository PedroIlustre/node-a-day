import { apiRoutes } from "@/http/routes/api"
import fastify from 'fastify'
import { ZodError } from "zod"
import { env } from './env'
import { AppError } from "./services/errors/app-error"

export const app = fastify()

app.register(apiRoutes)

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({
				message: 'Validation Error', issues: error.format()
			})
	}

	if (error instanceof AppError) {
		return reply
			.status(error.status_code)
			.send({ message: error.message, status: error.status_code })
	}

	if (env.NODE_ENV != 'production') {
		console.error(error)
	} else {
		//TODO here we gonna do a log to a external API to send the error log to this tool
	}

	return reply.status(500).send({ message: 'Internal Server error' })
})
