import { Client } from 'https://deno.land/x/postgres/mod.ts'

let make = async (spec) => {

    let connection_parameters = spec

    let client = new Client(connection_parameters)
    await client.connect()
    console.log('database connection ok.')

    let query = async (sql) => {

        let result = []
        let cursor = await client.queryArray(sql)
        cursor.rows.map( row => {
            let record = {}
            cursor.rowDescription.columns.map( (attribute, i) => {
                record[attribute.name] = row[i]
            })
            result.push(record)
        })
        return result
    }

    let that = Object.create({})
    that.query = query

    return that

}
const db = await make({
    hostname: 'localhost',
    port: 5432,
    database: 'appdb',
    user:'appdbadm',
    password: 'appdbadm'
})

export default db
