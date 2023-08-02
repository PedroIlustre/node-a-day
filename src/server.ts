import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

const app = fastify()
// registering plugin
app.register(cookie)
app.register(transactionsRoutes, {
	prefix: 'transactions'
})

app.listen({
	port: env.PORT
}).then(() => {
	console.log('HTTP server running')
})
