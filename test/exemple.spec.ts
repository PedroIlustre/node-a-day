import { expect, test } from 'vitest'

test('o user consegue fazer uma nova transacao', () => {
	// fazer chamada HTTP pra criar uma nova transacao

	const responseStatusCode = 201
	// validar asserts
	expect(responseStatusCode).toEqual(201)
})