import { Router } from 'https://deno.land/x/oak/mod.ts'
import users from './models.js'

const router = new Router()

router.get('/users', async (ctx) => {
    console.log('Route users')
    ctx.response.body = {
        status: 'Success',
        data: await users.getAll()
    }
})

export default router