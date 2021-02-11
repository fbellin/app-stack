import { Client } from 'https://deno.land/x/postgres/mod.ts'

let make = async (spec) => {

    let connection_parameters = spec

    let client = new Client(connection_parameters)
    await client.connect()
    console.log('database connection ok.')

    let query = async (sql) => {

        try {
            let result = await client.queryObject(sql)
            switch (result.command) {
                case 'SELECT' :
                    result = result.rows
                    break
                case 'INSERT' :
                case 'UPDATE' :
                case 'DELETE' :
                    result = {
                        command: result.command,
                        rowCount: result.rowCount
                    }
                    break
                default:
                    throw new Error ('Unknown sql command in query result')
            }
            return result
        } catch (error) {
            console.log(error)
        }
        
       
       
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
