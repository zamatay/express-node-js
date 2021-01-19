const User = require('./../models/m_user')
const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const crypto = require("crypto");
const mail = require('../common/email');

const env = require('../keys/index.json')

class EInvalidLogin extends Error{

}
// const rootCas = require('ssl-root-cas').create();
// //rootCas.addFile();
// require('https').globalAgent.options.ca = rootCas;


router.get('/login', async(req,res)=>{
    res.render('auth/login', {
        title: "Авторизация",
        isLogin: true,
        errorLogin: req.flash('errorLogin'),
        errorRegister: req.flash('errorRegister')
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
        if (!item) {
            req.flash('errorLogin', 'Такого пользователя не существует')
            throw new EInvalidLogin('Not found user')
        }
        if (!await bcrypt.compare(password, item.password)) {
            req.flash('errorLogin', 'Неверный пароль')
            throw new EInvalidLogin('Incorrect password')
        }
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
        if (item) {
            req.flash('errorRegister', 'Польователь с таким именем уже существует')
            res.redirect('/auth/login#register')
        } if (password !== requirePassword){
            req.flash('errorRegister', 'Пароли не совпадают')
            res.redirect('/auth/login#register')
        } else {
            const hashPass = await bcrypt.hash(password, 10)
            user = new User({
                email, name, password: hashPass
            })
            await user.save();
            res.redirect('/auth/login')
            await mail(email, 'Аккаунт создан', 'register')
        }
    }catch (e) {
        console.log(e)
    }
})

router.get('/resetPassword', async (req, res)=>{
    res.render('auth/resetPassword', {
        title: 'Сброс пароля',
        error: req.flash('error')
    })
})

router.post('/resetPassword', async (req, res)=> {
    try {
        crypto.randomBytes(32, async (err, buffer)=>{
            if (err) {
                req.flash('error', 'Что то пошло не так, попытайтесь еще раз')
                res.redirect('/auth/resetPassword');
                return
            }

            const token = buffer.toString('hex')
            const {email} = req.body;
            const user = await User.findOne({email});
            if (user){
                user.resetToken = token
                user.resetTokenExp = Date.now() + 60 * 60 * 1000
                await user.save();
                await mail(email, 'Сброс пароля', 'resetPassword', {token})
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Пользователя с такой почтой не обнаружено')
                res.redirect('/auth/resetPassword');
                return
            }
        })
    } catch (e){
        console.log(e)
    }
})

router.get('/setPassword/:token', async (req, res)=> {

    if (!req.params.token){
        return res.redirect('/auth/login')
    }

    const user = await User.findOne({
        resetToken: req.params.token,
        resetTokenExp: {$gt: Date.now()},

    })

    if (!user){
        return res.redirect('/auth/login')
    }

    try {
        res.render('auth/setPassword', {
            title: "Сброс пароля",
            error: req.flash('error'),
            userId: user._id.toString(),
            token: req.params.token
        })
    } catch (e) {
        console.log(e)
    }

})

router.post('/setPassword/', async (req, res)=> {
    const {token, user_id, password, requirePassword} = req.body

    if (!token){
        req.flash('error', 'Токен не найден')
        return res.redirect('/auth/setPassword')
    }

    try {
        const user = await User.findOne({
            _id: user_id,
            resetToken: token,
            resetTokenExp: {$gt: Date.now()},
        })

        if (!user) {
            req.flash('error', 'Срок действия токена истек')
            return res.redirect('/auth/setPassword')
        }

        if (password !== requirePassword){
            req.flash('error', 'Пароли не совпадают')
            return res.redirect('/auth/setPassword')
        }

        const hashPass = await bcrypt.hash(password, 10)
        user.password = hashPass
        user.resetToken = undefined
        user.resetTokenExp = undefined
        await user.save();
        res.redirect('/auth/login')
        await mail(user.email, 'Пароль изменен', 'register')
    } catch (e) {
        console.log(e)
    }

})

module.exports = router