const {Router} = require('express')
const Order = require('../models/m_order')
const router = Router()

router.get('/', async(req,res)=>{
    try {
        const orders = await Order.find({'userId': req.user})
            .populate('userId')
            .populate('courses.courseId');
        let data = orders.map(item=>{
            item.populateOrder();
            const {__v, courses, date, userId, ...any} = item._doc

            const summa = courses.reduce((total, item)=>{
                return total += item.count * item.courseId.price
            }, 0);
            const items = courses.map(i=> {
                return {id: i.id, title: i.courseId.title, price: i.courseId.price}
            })
            return {id: item.id, summa, items, date, user: req.user, courses}
        })
        res.render('orders', {isOrder: true, orders: data})
    } catch (e) {
        console.log(e.message)
    }
})

router.post('/', async(req, res)=>{
    const user = await req.user.populateCard()
    const courses = user.cart.items.map(c=> {
        let {_id} = c.courseId._doc;
        return {courseId: _id, count: c.count};
    })

    const order = new Order({
        userId: req.user,
        courses: courses
    });

    await order.save();
    await user.clearCart();
    res.redirect('/orders');
})

module.exports = router