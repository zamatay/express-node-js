const {Schema, model} = require('mongoose')

const course = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String,
    // user_id: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // }
})

course.method('toClient', function(){
    let {_id, __v, ...data} = this.toObject;
    data.id = _id;
    return data;
})

module.exports = model('Course', course)