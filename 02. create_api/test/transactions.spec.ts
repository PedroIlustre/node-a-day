import { test, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../create_api/src/app'

describe('Transactions routes', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	beforeEach(async () => {
		execSync('npm run knex migrate:rollback --all')
		execSync('npm run knex migrate:latest')
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

	test('User get transactions', async () => {
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

	test('User can get transactions with the expected body response', async () => {
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

	test('User can search for an especific transaction', async () => {
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

		const transactionId = getTransactionResponse.body.transactions[0].id

		const getSpecificTransactionResponse = await request(app.server)
			.get(`/transactions/${transactionId}`)
			.set('Cookie', cookies)
			.expect(200)

		expect(getSpecificTransactionResponse.body.transaction).toEqual(
			expect.objectContaining({
				title: 'Transaction created by test',
				amount: 2000,
			})
		)
	})

	test('User can get transactionssummary', async () => {
		const createCreditTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'Transaction created by test',
				amount: 4500,
				type: 'credit'
			})

		const cookies = createCreditTransactionResponse.get('Set-Cookie')

		await request(app.server)
			.post('/transactions')
			.set('Cookie', cookies)
			.send({
				title: 'Transaction created by test',
				amount: 2000,
				type: 'debit'
			})

		const summaryResponse = await request(app.server)
			.get('/transactions/summary')
			.set('Cookie', cookies)
			.expect(200)

		expect(summaryResponse.body.summary).toEqual({ amount: 2500 })
	})
})
