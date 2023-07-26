import http from 'node:http'
import { json } from '../middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from '../utils/extract-query-params.js'

// Query parameter - parametro enviado no url ex.: http://localhost:8080/users?userId=2 (nao usar dados sensívels, mais parameteros de paginação, ordenação, etc)
// Route parameter - parametro enviado na rota ex.: http://localhost:8080/users/2 (usados para identificação de recurso. Mesmo assim, dados sensíveis NAO devem ser enviados)
// Body request  - envio de informações de um formulário ex.: http://localhost:8080/users e lá na app tem o json body com os parametros da requisição

const server = http.createServer(async (req, res) => {
    const { method, url } = req

    await json(req, res)

    const route = routes.find(route => {
        return route.method == method && route.path.test(url)
    })
    
    if (route) {
        const routeParams = req.url.match(route.path)

        const { query, ...params } = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)
    }

    return res.writeHead(404).end('Error')
})

server.listen(3333)
