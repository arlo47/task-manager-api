/**
 * This file is not used in the final project. mongoose.js connects to the database
 */

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID
//This is the same as above
const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('unable to connect to database', error)
    }
    
    console.log('connected to db');

    const db = client.db(databaseName)

    // db.collection('users').deleteMany({ age: 31 })
    //     .then(result => {
    //         console.log(result)
    //     })
    //     .catch(error => {
    //         console.log(error)
    //     })

    // db.collection('tasks').deleteOne({ description: 'take out the garbage' })
    //     .then(result => {
    //         console.log(result)
    //     })
    //     .catch(error => {
    //         console.log(error)
    //     })

    // db.collection('users').findOne({ age: 30 })
    //     .then(result => {
    //         console.log(result)
    //     })
    //     .catch(error => {
    //         console.log(error)
    //     })

})