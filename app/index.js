import { Application } from "https://deno.land/x/oak/mod.ts"

const PORT = parseInt(Deno.env.get('PORT'))
const app = new Application()

app.use((ctx) => {
  ctx.response.body = "Hello World from Deno with denon !"
})

app.addEventListener( 'listen', () => {
  console.log('Oak server listening on port:' + PORT)
})

await app.listen({ port: PORT })
