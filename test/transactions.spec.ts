import { test, beforeAll, afterAll, describe, expect } from 'vitest'
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

	test('User can do transactions', async () => {
		const createTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'Transaction created by test',
				amount: 2000,
				type: 'credit'
			})

		const cookies = createTransactionResponse.get('Set-Cookie')
		await request(app.server)
			.get('/transactions')
			.set('Cookie', cookies)
			.expect(200)

	})

	test('User can do transactions with the expected body response', async () => {
		const createTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'Transaction created by test',
				amount: 2000,
				type: 'credit'
			})

		const cookies = createTransactionResponse.get('Set-Cookie')
		const getTransactionResponse = await request(app.server)
			.get('/transactions')
			.set('Cookie', cookies)
			.expect(200)

		expect(getTransactionResponse.body.transactions).toEqual([
			expect.objectContaining({
				title: 'Transaction created by test',
				amount: 2000,
			})
		])
	})
})
