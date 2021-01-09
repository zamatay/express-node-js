const User = require('./../models/m_user')
const {Router} = require('express')
const router = Router()

router.get('/login', async(req,res)=>{
    res.render('auth/login', {
        title: "Авторизация",
        isLogin: true
    })
})

router.get('/logout', async(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/auth/login')
    });
})

router.post('/login', async(req,res)=>{
    const user = await User.findById('5fe78b9d3d8dea2cace03dc5')
    req.session.user = user;
    req.session.save(err=>{
        if (err)
            throw err;
        res.redirect('/')
    })
})

router.post('/register', async(req,res)=>{
})

module.exports = router