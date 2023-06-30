import { Router } from 'https://deno.land/x/oak/mod.ts'

const make = (users) => {

	const router = new Router()

	router.get('/users', async (ctx) => {
			ctx.response.body = {
					status: 'Success',
					data: await users.selectAll()
			}
	})

	router.get('/users/:id', async (ctx) => {
			ctx.response.body = {
					status: 'Success',
					data: await users.selectById(ctx.params.id)
			}
	})

	router.post('/users', async (ctx) => {
			
			const body = ctx.request.body()
			const values = await body.value.read()
			
			ctx.response.body = {
					status: 'Success',
					data: await users.insert(values.fields)
			}
	})

	router.put('/users/:id', async (ctx) => {

			const body = ctx.request.body()
			const values = await body.value.read()
			values.fields.id = ctx.params.id

			ctx.response.body = {
					status: 'Success',
					data: await users.update(values.fields)
			}
	})

	router.delete('/users/:id', async (ctx) => {
			ctx.response.body = {
					status: 'Success',
					data: await users.delete(ctx.params.id)
			}
	})

	return router

}

export default make
