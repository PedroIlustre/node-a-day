import { compare, hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { GetUserProfileService } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('Get User profile service', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetUserProfileService(usersRepository)
	})

	it('Should be able to get user profile', async () => {

		// Create user
		const createdUser = await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password_hash: await hash('123456', 6),
		})

		// Test recent created user
		const { user } = await sut.execute({
			userId: createdUser.id
		})

		expect(user.id).toEqual(expect.any(String))
		expect(user.name).toEqual('John Doe')
	})

	it('Should not be able to get user profile', async () => {
		await expect(() =>
			sut.execute({
				userId: 'non-existing-id'
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})