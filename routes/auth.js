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
    try {
        const {email, password} = req.body;
        const item = await User.findOne({email, password})
        if (!item)
            res.redirect('/auth/login')
        else{
            req.session.user_id = item.id
            req.session.save(err=>{
                if (err)
                    throw err;
                res.redirect('/')
            })
        }
    }catch (e) {
        console.log(e)
    }
})

router.post('/register', async(req,res)=>{
    try {
        const {email, password, requirePassword, name} = req.body;
        const item = await User.findOne({email})
        console.log(item)
        if (item)
            res.redirect('/auth/login#register')
        else
        {
            user = new User({
                email, name, password
            })
            await user.save();
            res.redirect('/auth/login')

        }
    }catch (e) {
        console.log(e)
    }
})

module.exports = router