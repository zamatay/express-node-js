const flash = require('connect-flash')
const csrf = require('csurf')
const localMiddleware = require('./variables')
const userMiddleware = require('./user')

module.exports = app=>{
    app.use(csrf())
    app.use(flash())
    app.use(localMiddleware)
    app.use(userMiddleware)
}