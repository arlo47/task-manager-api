const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(500).send()
    }

})

router.get('/tasks', auth, async (req, res) => {
    const _id = req.params.id
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true' ? 'true' : 'false'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //find all tests with req.user_.id (logged in user is stored in req obj)
        //const tasks = await Task.find({ owner: req.user._id })
        
        //res.send(tasks)   //pass the tasks in based on variable declared above
        
        //another method is to populate the tasks array on user using execPopulate()
        //We can do this because we set up references and virtuals on the models
        await req.user.populate({ 
            path: 'tasks', 
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)    //access tasks inside req obj after populating them
    } catch (err) {
        res.status(500).send()
    }
    
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (err) {
        res.status(500).send()
    }

})

router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

    if(!isValidUpdate) {
        res.status(400).send({ error: 'Not a valid update' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if(!task) {
            res.status(404).send()
        }

        updates.forEach(update => task[update] = req.body[update])

        await task.save()

        res.status(200).send(task)

    } catch (err) {
        res.status(500).send(err)
    }

})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })

        if(!task) {
            res.status(404).send()
        }

        res.send(task)

    } catch (err) {
        res.status(500).send(err)
    }

})

module.exports = router