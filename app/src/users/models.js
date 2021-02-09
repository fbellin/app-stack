'use strict'

import db from '../db/database.js'

let make = (spec) => {

    let email = spec.name
    let password = spec.password

    let toString = () => {
        console.log(`Save user: ${email} - ${password}`)
    }

    let that = Object.create({})
    that.email = email
    that.password = password
    that.toString = toString

    return that

}

let getAll = async () => {
    let users = await db.query('select * from users;')
    return users.map( user => make(user))
}

export default {
    getAll: getAll
}
