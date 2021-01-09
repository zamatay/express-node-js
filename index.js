const express = require('express')
const path = require('path')
const app=express()
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const cartRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const authRoutes = require('./routes/auth')
const orderRoutes = require('./routes/orders')
const expressHandleBar = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const localMiddleware = require('./middleware/variables')

// регистрируем хандлбар для рендеринга страниц
const express_option = {defaultLayout: 'main', extname: 'hbs', handlebars: allowInsecurePrototypeAccess(Handlebars)}
const eho = expressHandleBar.create(express_option)
app.engine('hbs', eho.engine)
// app.engine('hbs', expressHandleBar({
//     handlebars: allowInsecurePrototypeAccess(Handlebars),
//     defaultLayout: 'main',
//     extname: 'hbs'
// }))
app.set('view engine', 'hbs')
// указываем где хранятся наши шаблоны
app.set('views', 'views')

const pass = 'c8Q-Z3u-2D8-AAK'
const uriMongoDb = `mongodb+srv://developer:${pass}@cluster0.fpbze.mongodb.net/shop`
const store = new MongoStore({
    collection: 'sessions',
    uri: uriMongoDb,
})
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(localMiddleware)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:false}))

app.use(homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cartRoutes)
app.use('/orders', orderRoutes)
app.use(addRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000;

const handleListen = ()=>{
    console.log(`Server is running on port ${PORT}`);
}

connectToDB = async ()=>{
    try {
        await  mongoose.connect(uriMongoDb, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
        app.listen(PORT, handleListen)
    }catch(e){
        console.log(e);
    }
}
connectToDB()

