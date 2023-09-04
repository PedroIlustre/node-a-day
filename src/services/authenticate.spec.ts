import { compare, hash } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate User Service', () => {
	it('Should be able to authenticate', async () => {
		const usersRepository = new InMemoryUsersRepository
		const sut = new AuthenticateService(usersRepository)

		// Create user
		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password_hash: await hash('123456', 6),
		})

		// Test recent created user
		const { user } = await sut.execute({
			email: 'johndoe@gmail.com',
			password: '123456',
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('Should not be able to authenticate with wrong email', async () => {
		const usersRepository = new InMemoryUsersRepository
		const sut = new AuthenticateService(usersRepository)
		const email = 'johndoe2@gmail.com'

		// Create user
		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password_hash: await hash('123456', 6),
		})

		await expect(() =>
			sut.execute({
				email,
				password: '123456',
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('Should not be able to authenticate with not found email', async () => {
		const usersRepository = new InMemoryUsersRepository
		const sut = new AuthenticateService(usersRepository)

		await expect(() =>
			sut.execute({
				email: 'johndoe@gmail.com',
				password: '123456',
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('Should not be able to authenticate with wrong password', async () => {
		const usersRepository = new InMemoryUsersRepository
		const sut = new AuthenticateService(usersRepository)
		const email = 'johndoe@gmail.com'

		// Create user
		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password_hash: await hash('123456', 6),
		})

		await expect(() =>
			sut.execute({
				email,
				password: '12345',
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})