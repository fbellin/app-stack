import { Client } from 'https://deno.land/x/postgres/mod.ts'

const POSTGRES_HOST = Deno.env.get('POSTGRES_HOST')
const POSTGRES_PORT = parseInt(Deno.env.get('POSTGRES_PORT'))
const POSTGRES_DB = Deno.env.get('POSTGRES_DB')
const POSTGRES_USER = Deno.env.get('POSTGRES_USER')
const POSTGRES_PASSWORD = Deno.env.get('POSTGRES_PASSWORD')

let make = async () => {

    let connection_parameters = {
        hostname: POSTGRES_HOST,
        port: POSTGRES_PORT,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
    }

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

export default await make()
