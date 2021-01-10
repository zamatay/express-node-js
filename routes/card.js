const {Router} = require('express')
const Course = require('../models/m_course')
const authMiddleware  = require('../middleware/auth')

const  router = Router();

mapCartItems = (items)=>{
    let data = items.map(c=> {
        const {__v, _id, ...data} = c.courseId._doc
        data.count = c.count
        data.id = _id;
        return data
    })
    return data;
}

getCard = async (user)=>{
    console.log(user)
    if (user){
        await user.populateCard()
        return mapCartItems(user.cart.items);
    }
}

router.post('/add', authMiddleware, async (req, res)=>{
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course);
    res.redirect('/card')
})

router.post('/', authMiddleware, async (req, res)=>{
    console.log(req.user)
    const data = await getCard(req.user);
    res.json(data);
})

router.get('/', authMiddleware, async (req, res)=>{
    // const card = Card.fetch();
    const data = await getCard(req.user);
    res.render('card', {card: data, IsCard: true})
})

router.delete('/remove/:id', authMiddleware, async (req, res)=>{
    await req.user.removeFromCart(req.params.id)
    const data = await getCard(req.user);
    res.json(data);
})

module.exports = router