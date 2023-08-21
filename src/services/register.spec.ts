import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { expect, test, describe, it } from 'vitest'
import { RegisterService } from './register'

describe('Register service', () => {
	it('Should hash user password upon registration', async () => {
		const prismaUsersRepository = new PrismaUsersRepository()
		const registerService = new RegisterService(prismaUsersRepository)

		const { user } = await registerService.execute({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		})

		console.log(user)
	})
})