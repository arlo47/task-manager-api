const jwt = require('jsonwebtoken')
const User = require('../models/user')

//The token contains the user ID and the secret, used to authenticate. Look at generateToken() in user model


const auth = async (req, res, next) => {

    try {
        //get token from request header (the header is of type Bearer, so we must remove Bearer from the beginning)
        const token = req.header('Authorization').replace('Bearer ', '')

        //compares the recieved token to the secret, if the token has our secret it will return true
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        //find the user based id and token
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if(!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (err) {
        res.status(401).send({ error: 'please authenticate' })
    }

}

module.exports = auth