import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { v4 } from 'https://deno.land/std/uuid/mod.ts'

import models from './models/index.js'

const PORT = parseInt(Deno.env.get('PORT'))
const app = new Application()

// Adds a basic middleware
app.use(async (ctx, next) => {
  await next()
  console.log(`HTTP ${ctx.request.method} on ${ctx.request.url}`)
})

// Adds a basic route
const router = new Router()

router.get('/', (ctx) => {
  console.log('HERE')
  
})
router.get('/users', (ctx) => {
  ctx.response.body = Array.from(Object.values(ctx.state.models.users))
})
router.get('/users/:userId', ctx => {
  ctx.response.body = ctx.state.models.users[ctx.params.userId]
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



router.get('/messages', ctx => {
  console.log("toto")
  ctx.response.body = Array.from(Object.values(ctx.state.models.messages))
})
router.get('/messages/:messageId', ctx => {
  ctx.response.body = ctx.state.models.messages[ctx.params.messageId]
})
router.post('/messages', async (ctx) => {
  const id = v4.generate()
  
  const { value } = ctx.request.body({ type: 'json' })
  const { text } = await value

  ctx.state.models.messages[id] = {
    id: id.toString(),
    text: text,
    userId: ctx.state.me.id
  }
  ctx.response.body = ctx.state.models.messages[id]
})
router.delete('/messages/:messageId', async (ctx) => {
 
  const isDeleted = delete ctx.state.models.messages[ctx.params.messageId]
 
  ctx.response.body = isDeleted;
});

router.get('/session', (ctx) => {
  ctx.response.body = users.get(ctx.state.me.id);
});

app.use(async (ctx, next) => {
  ctx.state = {
    models: models,
    me: models.users[1] 
  };
 
  await next();
});
 
app.use(router.routes())
app.use(router.allowedMethods())

// Adds a listener to react on server startup
app.addEventListener( 'listen', () => {
  console.log('Oak server listening on port:' + PORT)
})

await app.listen({ port: PORT })
