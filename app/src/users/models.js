'use strict'

let make = (spec) => {

    let email = spec.email
    let password = spec.password

    let save = () => {
        console.log(`Save user: ${email} - ${password}`)
    }

    let that = Object.create({})
    that.email = email
    that.password = password
    that.save = save

    return that

}

let getAll = () => {
    return [
        {
            email: 'john@doo.com',
            password: 'johndoo'
        },
        {
            email: 'foo@bar.com',
            password: 'foobar'
        }
    ].map( user => make(user) )
}

export default {
    getAll: getAll
}
