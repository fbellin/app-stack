import db from '../utils/postgres.js' 

import store from '../users/store.js'
const userStore = store(db)

import router from '../users/routes.js'
const userRouter = router(userStore)

export default {
    router: userRouter
}
