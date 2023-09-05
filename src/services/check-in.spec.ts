import { expect, describe, it, beforeEach } from 'vitest'
import { CheckInService } from './checkin'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInService

describe('Check-in service', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new CheckInService(checkInsRepository)
	})

	it('Should be able to check in', async () => {

		const { checkIn } = await sut.execute({
			userId: 'user-01',
			gymId: '01'
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})