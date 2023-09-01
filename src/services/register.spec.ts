import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { RegisterService } from './register'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register service', () => {
	it('Should be able to register', async () => {
		const usersRepository = new InMemoryUsersRepository
		const registerService = new RegisterService(usersRepository)

		const { user } = await registerService.execute({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('Should hash user password upon registration', async () => {
		const usersRepository = new InMemoryUsersRepository
		const registerService = new RegisterService(usersRepository)

		const { user } = await registerService.execute({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		})

		const isPasswordCorrectlyHashed = await compare(
			'123456',
			user.password_hash
		)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})

	it('Should not be able to register with same email twice', async () => {
		const usersRepository = new InMemoryUsersRepository
		const registerService = new RegisterService(usersRepository)
		const email = 'johndoe@gmail.com'

		await registerService.execute({
			name: 'John Doe',
			email,
			password: '123456',
		})

		expect(() =>
			registerService.execute({
				name: 'John Doe',
				email,
				password: '123456',
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)


	})
})