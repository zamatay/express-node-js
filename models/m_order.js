const {Schema, model} = require('mongoose')

const order = new Schema({
    courses: [
        {
            courseId: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                require: true
            },
            count: {
                type: Number,
                require: true
            }
        },
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    date: {type: Date, default: Date.now}
})

order.methods.populateOrder = async function(){
    return await this
        .populate('userId')
        .populate('courses.CourseId')
        .execPopulate()
}

module.exports = model('Order', order)