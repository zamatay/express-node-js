const homeRoutes = require('./home')
const coursesRoutes = require('./courses')
const cartRoutes = require('./card')
const addRoutes = require('./add')
const authRoutes = require('./auth')
const orderRoutes = require('./orders')

module.exports = function (app){
    app.use(homeRoutes);
    app.use('/courses', coursesRoutes);
    app.use('/card', cartRoutes)
    app.use('/orders', orderRoutes)
    app.use(addRoutes)
    app.use('/auth', authRoutes)
}

