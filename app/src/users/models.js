'use strict'

import db from '../db/database.js'

let make = (spec) => {

    let email = spec.email
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

let selectAll = async () => {
    let users = await db.query('select * from users;')
    return users.rows
}

let selectById = async (id) => {
    let user = await db.query(`select * from users where id=${id};`)
    return user
}

let insert = async (params) => {
    let user = await db.query(`insert into users (id, email, password) values (${params.id}, '${params.email}', '${params.password}');`)
    return user
}

let update = async (params) => {
    let user = await db.query(`update users set email='${params.email}', password='${params.password}' where id=${params.id}`)
    return user
}

let deleteFn = async (id) => {
    let user = await db.query(`delete from users where id=${id}`)
    return user
}

export default {
    selectAll: selectAll,
    selectById: selectById,
    insert: insert,
    update: update,
    delete: deleteFn
}
