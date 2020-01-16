const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     if(req.method === 'GET') {
//         res.send('GET requests are disabled')
//     }
//     else {
//         next()
//     }
// })

//maintenance mode middleware
// app.use((req, res, next) => {
//     res.status(503).send('Server currently in maintenance mode')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`server up on ${port}`)
})




const multer = require('multer')

//multer options for file upload
const upload = multer({
    //folder to save files too
    dest: 'images',
    limits: {
        //file size is in bytes
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(doc|docx)$/)) {
            cb(new Error('File must be a doc or docx'))
        }

        cb(undefined, true)
    }
})

//multer's single() method is our middleware for uploading files

//note that when testing in postman, in the body tab, form-data must be selected, 
//the key must be the same as the string passed into single() below. And the dropdown by "key" must be changed to file (to allow uploads)
app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})



//This method is to test populating fields by reference (between user and tasks) using execPopulate()
//This is set up in the task and users models
// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5e1dddf4793ba23c38afbca3')

//     // //This allows us to populate the owner field with the entire user. 
//     // //We can do this because we added the ref field to the owner schema
//     // await task.populate('owner').execPopulate()

//     const user = await User.findById('5e1ddd4a3b1c4a1bd06ca6ac')

//     //Here we are populating the tasks with the same user id, it is defined in the userSchema, the method is called virtuals
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }


//This method is used to test creating a json web token with a secret
// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     //creates a token with, second arg is the secret
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' })
//     console.log(token)

//     //vertifys token with secret
//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }

// myFunction()