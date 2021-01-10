const {Router} = require('express')
const router = Router()
const Course = require('../models/m_course')
const authMiddleware  = require('../middleware/auth')


router.get('/', async (req, res)=>{
    const courses = await Course.find();
    res.render('courses', {title: "Курсы", IsCourses: true, c: courses})   
})

router.get('/get/:id', async (req, res)=>{
    try {
        const course = await Course.findById(req.params.id)
        res.render('course', {layout: 'empty', course: course})
    } catch (e) {
        res.status(404).end();
    }
})

router.get('/edit/:id', authMiddleware, async (req, res)=>{
    if (!req.query.allow){
        return res.redirect('/')
    }
    const course = await Course.findById(req.params.id)
    res.render('course-edit', {course: course})
})

router.post('/edit', authMiddleware, async (req,res)=>{
    const {id, ...body} = req.body;
    await Course.findByIdAndUpdate(id, body);
    res.redirect('/courses')
})

router.post('/delete', authMiddleware, async (req,res)=>{
    try {
        const {id} = req.body;
        await Course.deleteOne({_id: id});
        res.redirect('/courses')

    } catch (e) {
        console.log(e.message)
        throw e;
    }
})

module.exports = router;