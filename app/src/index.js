import { Application } from "https://deno.land/x/oak/mod.ts"

import models from './models/index.js'
import routes from './routes/index.js'

const app = new Application()

// Adds a basic middleware
app.use(async (ctx, next) => {
  await next()
  console.log(`HTTP ${ctx.request.method} on ${ctx.request.url}`)
})

app.use(async (ctx, next) => {
  ctx.state = {
    models: models,
    me: models.users[1] 
  };
 
  await next();
});
 
app.use(routes.session.routes())
app.use(routes.session.allowedMethods())
app.use(routes.user.routes())
app.use(routes.user.allowedMethods())
app.use(routes.message.routes())
app.use(routes.message.allowedMethods())

// Adds a listener to react on server startup
const PORT = parseInt(Deno.env.get('PORT'))
app.addEventListener( 'listen', () => {
  console.log('Oak server listening on port:' + PORT)
})

await app.listen({ port: PORT })
