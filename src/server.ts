import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
	const transaction = await knex('transactions').insert({
		id: crypto.randomUUID(),
		title: 'some text',
		amount: 1000
	}).returning('*')

	return transaction
})

app.get('/hello2', async () => {
	const transaction = await knex('transactions')
		.where('amount', 500)
		.select('*')
	return transaction
})

app.listen({
	port: env.PORT
}).then(() => {
	console.log('HTTP server running')
})
