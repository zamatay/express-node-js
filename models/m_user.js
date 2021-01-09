const {Schema, model} = require('mongoose')

const user = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: false,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: false
                }
            }
        ]
    }
})

user.methods.clearCart = async function(){
    this.cart.items = [];
    return this.save();
}

user.methods.populateCard = async function(){
    return await this
        .populate('cart.items.courseId')
        .execPopulate()
}

user.methods.addToCart = function(course){
    try {
        const items = [...this.cart.items]
        const idx = items.findIndex((c) => {
            return c.courseId.toString() === course._id.toString()
        })

        // есть такой элемент
        if (idx >= 0) {
            items[idx].count++;
        } else {
            items.push({courseId: course._id, count: 1})
        }

        this.cart = {items};
        return this.save();
    } catch (e) {
        console.log(e.message)
    }
}

user.methods.removeFromCart = function(id){
    let items = [...this.cart.items]
    const idx = items.findIndex((c) => {
        return c.courseId.toString() === id
    })
    console.log(id, idx, items)

    // есть такой элемент
    if (idx >= 0 && items[idx].count > 1){
        items[idx].count--;
    } else if (idx >= 0 && items[idx].count == 1){
        items = items.filter(c=>c.courseId.toString() !== id)
    }
    this.cart = {items};
    return this.save();
}

module.exports = model('User', user)