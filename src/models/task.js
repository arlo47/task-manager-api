const mongoose = require('mongoose')
const validator = require('validator')

//Create a task model
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //references another mongoose model. With this we can easily fetch entire user object
        ref: 'User'
    }
}, {
    timestamps: true
}) 



const Task = mongoose.model('Task', taskSchema)

module.exports = Task