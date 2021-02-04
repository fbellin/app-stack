import { Application, Router } from "https://deno.land/x/oak/mod.ts"

const PORT = parseInt(Deno.env.get('PORT'))
const app = new Application()

// Adds a basic middleware
app.use(async (ctx, next) => {
  await next()
  console.log(`HTTP ${ctx.request.method} on ${ctx.request.url}`)
})

// Adds a basic route
const router = new Router()

router.get('/users', (ctx) => {
  ctx.response.body = 'GET HTTP method on user resource'
})
 
router.post('/users', (ctx) => {
  ctx.response.body = 'POST HTTP method on user resource'
})
 
router.put('/users/:userId', (ctx) => {
  ctx.response.body = `PUT HTTP method on user/${ctx.params.userId} resource`
})
 
router.delete('/users/:userId', (ctx) => {
  ctx.response.body = `DELETE HTTP method on user/${ctx.params.userId} resource`
})

app.use(router.routes())
app.use(router.allowedMethods())

// Adds a listener to react on server startup
app.addEventListener( 'listen', () => {
  console.log('Oak server listening on port:' + PORT)
})

await app.listen({ port: PORT })
