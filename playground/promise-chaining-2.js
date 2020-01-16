require('../src/db/mongoose')
const Task = require('../src/models/task')
const User = require('../src/models/user')

// Task.findByIdAndDelete("5e1a1c8ee2015e24e8973c70")
//     .then((task) => {
//         console.log(task)
//         return Task.countDocuments({ completed: false })
//     })
//     .then((result) => {
//         console.log(result)
//     })
//     .catch((err) => {
//         console.log(err)
//     })

// const updateAgeAndCount = async (id, age) => {
//     const user = await User.findByIdAndUpdate(id, { age })
//     const count = await User.countDocuments({ age })

//     return count
// }

// updateAgeAndCount('5e1a29e36ec0cd27a48c3f25', 30)
//     .then((count) => {
//         console.log(count)
//     })
//     .catch((err) => {
//         console.log(err)
//     })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })

    return count
}

deleteTaskAndCount('5e1a21f303ed0a0378053963')
    .then((count) => {
        console.log(count)
    })
    .catch((err) => {
        console.log(err)
    })