import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
	// list all transactions
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req) => {

			const { sessionId } = req.cookies

			const transactions = await knex('transactions')
				.where('session_id', sessionId)
				.select('*')
			return { transactions }
		},
	)

	// get a transaction
	app.get('/:id',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req) => {
			const getTransactionsParamsSchema = z.object({
				id: z.string().uuid()
			})

			const { id } = getTransactionsParamsSchema.parse(req.params)
			const { sessionId } = req.cookies

			const transactions = await knex('transactions')
				.where({
					'session_id': sessionId,
					id
				})
				.first()
			return { transactions }
		},
	)

	// sum all transactions
	app.get('/summary',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req) => {

			const { sessionId } = req.cookies

			const summary = await knex('transactions')
				.where({ 'session_id': sessionId })
				.sum('amount', { as: 'amount' })
				.first()
			return { summary }
		},
	)

	// create a transaction
	app.post('/',
		{
			preHandler: [checkSessionIdExists],
		},
		async (req, rep) => {
			const createTransactionBodySchema = z.object({
				title: z.string(),
				amount: z.number(),
				type: z.enum(['credit', 'debit']),
			})


			const { title, amount, type } = createTransactionBodySchema.parse(req.body)


			let sessionId = req.cookies.sessionId
			if (!sessionId) {
				sessionId = randomUUID()
				rep.cookie('sessionId', sessionId, {
					path: '/',
					maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
				})
			}
			await knex('transactions')
				.insert({
					id: randomUUID(),
					title,
					amount: type == 'credit' ? amount : amount * -1,
					session_id: sessionId
				})

			return rep.status(201).send()
		})
}