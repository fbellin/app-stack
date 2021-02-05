'use strict'

import userFactory from './users.js'

// Set sample data
let data = [
  {
    email: 'john@doo.com',
    password: 'johndoo'
  },
  {
    email: 'foo@bar.com',
    password: 'foobar'
  }
]

let users = data.map( user => {
  return userFactory.make(user)
})

console.log(users)

export default {
    users
  }