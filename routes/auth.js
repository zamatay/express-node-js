const User = require('./../models/m_user')
const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
class EInvalidLogin extends Error{

}

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
        const item = await User.findOne({email})
        if (!item)
            throw new EInvalidLogin('Not found user')
        if (!await bcrypt.compare(password, item.password))
            throw new EInvalidLogin('Incorrect password')
        req.session.user_id = item.id
        req.session.save(err=>{
            if (err)
                throw err;
            return res.redirect('/')
        })
    }catch (e) {
        if (e instanceof EInvalidLogin) {
            res.redirect('/auth/login')
        }
        else
            console.log(e.message)
    }
})

router.post('/register', async(req,res)=>{
    try {
        const {email, password, requirePassword, name} = req.body;
        const item = await User.findOne({email})
        if (item)
            res.redirect('/auth/login#register')
        else
        {
            const hashPass = await bcrypt.hash(password, 10)
            user = new User({
                email, name, password: hashPass
            })
            await user.save();
            res.redirect('/auth/login')

        }
    }catch (e) {
        console.log(e)
    }
})

module.exports = router