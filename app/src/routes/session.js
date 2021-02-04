import { Router } from 'https://deno.land/x/oak/mod.ts'

const router = new Router()

router.get('/session', (ctx) => {
    ctx.response.body = users.get(ctx.state.me.id);
});

export default router