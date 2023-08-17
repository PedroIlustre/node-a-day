import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UsersRepository } from "@/repositories/users-repository"

interface RegisterServiceRequest {
	name: string,
	email: string,
	password: string,
}

export class RegisterService {
	constructor(private usersRepository: UsersRepository) { }

	async execute({ name, email, password }: RegisterServiceRequest) {

		const userWithSameEmail = await prisma.user.findUnique({
			where: {
				email
			}
		})

		if (userWithSameEmail) {
			throw new Error('Email already exists.')
		}

		const password_hash = await hash(password, 6)

		await this.usersRepository.create({ name, email, password_hash })
	}
}

