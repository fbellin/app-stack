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

let userFactory = {
    make: make
}
export default userFactory
