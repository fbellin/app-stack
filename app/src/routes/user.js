import { Router } from 'https://deno.land/x/oak/mod.ts'

const router = new Router()

router.get('/users', (ctx) => {
    console.log('Route users')
})

export default router