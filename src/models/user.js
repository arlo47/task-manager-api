const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        //defines the type restriction
        type: String,    
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        //Here we are using the validator module with validate(). isEmail() is a method of validator
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('email is invalid')
            }
        }
    },
    age: {
        //defines the type restriction
        type: Number,
        default: 0,    
        //validate is a method on mongoose. It only provides basic validation. Above we use a combination of validator module and validate() for more complex validation
        validate(value) {
            if( value < 0) {
                throw new Error('Age cannot be negative')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minLength: 7,
        validate(value) {
            if(value.length < 6) {
                throw new Error('password must be more than 6 characters')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, 
//second object arg for options
{
    //adds created at and updated at fields
    timestamps: true
})

//statics creates a static method
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//methods creates an instance method
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    //adds the token object to user
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

/**
 * toJSON() is an override. Whenever the User model is stringified to JSON, this method will run
 * This works because in index.js, we are using express.json() as middleware to stringified data to json automatically
 */
userSchema.methods.toJSON = function() {
    const user = this

    //create an object from the user model
    const userObject = user.toObject()

    //delete the sensitive data from the userObject
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar    //delete image because it is a large file

    return userObject
}

/**
 * mongoose allows two types of middleware pre (before event) and post (after event)
 * The first arg is the name of the event, the second is the callback. 
 * Note that arrow functions do not bind this
 */

 //hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    //next will run the next middleware, or continue the request
    next()
})

//delete user tasks when user is removed
userSchema.pre('remove', async function(next) {
    const user = this

    //cascading delete
    await Task.deleteMany({ owner: user._id })

    next()
})

//Passing in model as a schema instead of putting the model directly in the second argument allows us to use middleware
const User = mongoose.model('User', userSchema)

module.exports = User