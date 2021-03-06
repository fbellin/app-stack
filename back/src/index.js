import { Application } from "https://deno.land/x/oak/mod.ts"
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import users from './users/index.js'

const app = new Application()

// Adds a basic middleware
app.use(async (ctx, next) => {
  await next()
  console.log(`HTTP ${ctx.request.method} on ${ctx.request.url}`)
})

app.use(
  oakCors({
    origin: "http://localhost:5000"
  }),
);

app.use(async (ctx, next) => {
  ctx.state = {
    models: undefined,
    me: undefined
  };
 
  await next();
});

app.use(users.router.routes())
app.use(users.router.allowedMethods())

// Adds a listener to react on server startup
const PORT = parseInt(Deno.env.get('PORT'))
app.addEventListener( 'listen', () => {
  console.log('Oak server listening on port:' + PORT)
})

try { 
  await app.listen({ port: PORT })
} catch (error) {
  console.log(error)
}
