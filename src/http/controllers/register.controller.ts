import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { RegisterService } from "@/services/register"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error"

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6)
	})

	const { name, email, password } = registerBodySchema.parse(request.body)

	try {
		const register = new RegisterService(new PrismaUsersRepository)
		await register.execute({
			name, email, password
		})
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return reply.status(409).send(err)
		}
		return reply.status(500).send()
	}

	return reply.status(201).send()
}