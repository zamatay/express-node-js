const express = require('express')
const app=express()
const path = require('path')
const mongoose = require('mongoose')
const route = require('./routes/web')
const session = require('./common/session')
const env = require('./keys/index.json')
const tempEngine = require('./common/hbsRegister')
const middlewareRegister = require('./middleware/register')

tempEngine(app);
session(app, env.uriMongoDb)

app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))
middlewareRegister(app);

route(app)

const handleListen = ()=>{
    console.log(`Server is running on port ${env.PORT}`);
}

connectToDB = async ()=>{
    try {
        await  mongoose.connect(env.uriMongoDb, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
        app.listen(env.PORT, handleListen)
    }catch(e){
        console.log(e);
    }
}
connectToDB()

