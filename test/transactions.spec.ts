import { test, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	test('User can do transactions', async () => {
		await request(app.server)
			.post('/transactions')
			.send({
				title: 'Transaction created by test',
				amount: 2000,
				type: 'credit'
			})
			.expect(201)
	})
})
