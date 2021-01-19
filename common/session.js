const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const env = require('../keys/index.json')

module.exports = function (app, uri){
    const store = new MongoStore({
        collection: 'sessions',
        uri: uri,
    })
    app.use(session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store
    }))
}