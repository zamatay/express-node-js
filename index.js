const express = require('express')
const app=express()
const csrf = require('csurf')
const path = require('path')
const expressHandleBar = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const localMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const route = require('./routes/web')

// регистрируем хандлбар для рендеринга страниц
const express_option = {defaultLayout: 'main', extname: 'hbs', handlebars: allowInsecurePrototypeAccess(Handlebars)}
const eho = expressHandleBar.create(express_option)
app.engine('hbs', eho.engine)
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
app.use(csrf())

app.use(localMiddleware)
app.use(userMiddleware)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:false}))
route(app)

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

