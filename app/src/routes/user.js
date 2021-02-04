import { Router } from 'https://deno.land/x/oak/mod.ts'

const router = new Router()

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

export default router