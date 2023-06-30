'use strict'

const make = (db) => {

	const _selectAll = async () => {
    const users = await db.query('select * from users;')
    return users
	}

	const _selectById = async (id) => {
    const user = await db.query(`select * from users where id=${id};`)
    return user
	}

	const _insert = async (params) => {
    const result = await db.query(`insert into users (email, password) values ('${params.email}', '${params.password}');`)
    return result
	}

	const _update = async (params) => {
    const result = await db.query(`update users set email='${params.email}', password='${params.password}' where id=${params.id}`)
    return result
	}

	const _delete = async (id) => {
    const result = await db.query(`delete from users where id=${id}`)
    return result
	}

	const that = Object.create({})
	that.selectAll = _selectAll
	that.selectById = _selectById
	that.insert = _insert
	that.update = _update
	that. delete = _delete

	return that

}

export default make
