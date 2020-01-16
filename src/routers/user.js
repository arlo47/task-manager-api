const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const { sendWelcomeEmail, sendDeleteEmail } = require('../emails/account')


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/login', async (req, res) => {
    
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (err) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (err) {
        res.status(500).send()
    }

})

router.post('/users/logoutAll', auth, async (req, res) => {

    /**
     * The array of tokens is for logging the user in from different computers. Each of these is a valid token
     * The token object following the array is the token currently being used to authenticate.
     * This route deletes all tokens, forcing the user to log out from all computers
     */

    try {
        //delete all tokens in the tokens array
        req.user.tokens = []

        //save, deleting them from the database
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }

})

//you can assign middleware on a route level as the second arg
router.get('/users/me', auth, async (req, res) => {
    
    res.send(req.user)
    
    //find all users, a better way
    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // } catch (err) {
    //     res.status(500).send(err)
    // }

    //find all users, not the best way
    // User.find({})
    //     .then((users) => {
    //         res.send(users)
    //     })
    //     .catch((err) => {
    //         res.status(500)
    //            .send()
    //     })
})

router.patch('/users/me', auth, async (req, res) => {
    //get keys in req.body to be sure they are valid updates
    const updates = Object.keys(req.body)

    //these are the valid fields that can be updated
    const allowedUpdates = ['name', 'email', 'password', 'age']
    //every returns false if all elements do not return true. includes checks if the array contains the element
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const user = await User.findById(req.user._id)

        //This replaces each user property with a property from the req.body, using the updates array in place of each actual property name
        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (err) {
        res.status(400).send(err)
    }

})

router.delete('/users/me', auth, async (req, res) => {
    
    try {
        await req.user.remove()
        sendDeleteEmail(req.user.email, req.user.name)
        res.send(req.user)

    } catch (err) {
        res.status(500).send()
    }

})

//multer options for file upload
const upload = multer({
    //folder to save files too
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(file.originalname.endsWith('jpg') 
            || file.originalname.endsWith('jpeg') 
            || file.originalname.endsWith('png')) {
            cb(undefined, true)
        }
        else {
            cb(new Error('File must be jpg, jpeg or png'))
        }
    }
})


router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, 
//you can format error messages coming from middleware by providing your route with a second callback. It is important to provide all 4 args below.
//The error.message is provided from the error thrown in the callback of fileFilter above.
(error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {

    if(!req.user.avatar) {
        res.status(404).send('No avatar to delete')
    }

    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (err) {
        res.status(404).send()
    }

})

module.exports = router