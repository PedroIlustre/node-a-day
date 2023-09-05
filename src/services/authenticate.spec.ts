import { compare, hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate User Service', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new AuthenticateService(usersRepository)
	})

	it('Should be able to authenticate', async () => {

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
		await expect(() =>
			sut.execute({
				email: 'johndoe@gmail.com',
				password: '123456',
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('Should not be able to authenticate with wrong password', async () => {
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