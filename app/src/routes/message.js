import { Router } from 'https://deno.land/x/oak/mod.ts'
import { v4 } from 'https://deno.land/std/uuid/mod.ts'

const router = new Router()

router.get('/messages', ctx => {
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

export default router