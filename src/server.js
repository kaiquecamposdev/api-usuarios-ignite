import http from 'node:http';
import { routes } from './routes.js';
import { json } from './middlewares/json.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const port = 8080

const server = http.createServer(async (req, res) => {
  const { method, url } = req
  await json(req, res)
  const route = routes.find((route) => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)
    const { query, ...params } = routeParams.groups
  
    req.params = params
    req.query = extractQueryParams(query)
    
    return route.handler(req, res)
  } else {
    return res.writeHead(404).end('Not Found!')
  }
})

server.listen(port, () => {
  console.log("Server está executando na porta ::" + port)
})