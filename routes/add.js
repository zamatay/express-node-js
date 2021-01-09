const {Router} = require('express')
const router = Router()
const Course = require('../models/m_course')

router.get('/add', (req, res)=>{
    res.render('add', {title: "Добавить курс", IsAdd: true})
})

router.post('/add', async(req, res)=>{
    let {title, price, img} = req.body;
    //course = new Course(title, price, img)
    let course = new Course({title, price, img, user_id: req.user})
    try {
        await course.save();
        res.redirect('/courses')

    } catch(e){
        console.log(e)
    }
})

module.exports = router;