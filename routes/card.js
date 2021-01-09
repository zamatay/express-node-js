const {Router} = require('express')
const Card = require('../models/card')
const Course = require('../models/m_course')

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
    await user.populateCard()
    return mapCartItems(user.cart.items);
}

router.post('/add', async (req, res)=>{
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course);
    res.redirect('/card')
})

router.post('/', async (req, res)=>{
    const data = await getCard(req.user);
    res.json(data);
})

router.get('/', async (req, res)=>{
    // const card = Card.fetch();
    const data = await getCard(session.user);
    res.render('card', {card: data, IsCard: true})
})

router.delete('/remove/:id', async (req, res)=>{
    await session.user.removeFromCart(req.params.id)
    const data = await getCard(req.user);
    res.json(data);
})

module.exports = router