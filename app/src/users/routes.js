import { Router } from 'https://deno.land/x/oak/mod.ts'
import users from './models.js'

const router = new Router()

router.get('/users', (ctx) => {
    console.log('Route users')
    ctx.response.body = {
        status: 'Success',
        data: users.getAll()
    }
})

export default router