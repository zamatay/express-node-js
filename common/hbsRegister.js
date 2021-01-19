const expressHandleBar = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

module.exports = (app)=>{
    // регистрируем хандлбар для рендеринга страниц
    const express_option = {defaultLayout: 'main', extname: 'hbs', handlebars: allowInsecurePrototypeAccess(Handlebars)}
    const eho = expressHandleBar.create(express_option)
    app.engine('hbs', eho.engine)
    app.set('view engine', 'hbs')
    // указываем где хранятся наши шаблоны
    app.set('views', 'views')
}