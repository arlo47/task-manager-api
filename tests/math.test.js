const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')

// test('Should calculate total with tip', () => {
//     const total = calculateTip(10, 0.3)
//     expect(total).toBe(13)

//     // if(total !== 13) {
//     //     throw new Error('Total tip should be 13. Got ' + total)
//     // }
// })

// test('Should calculate total with default tip', () => {
//     const total = calculateTip(10)
//     expect(total).toBe(12.5)
// })

// test('Should convert 32 F to 0 C', () => {
//     const result = fahrenheitToCelsius(32)
//     expect(result).toBe(0)
// })

// test('Should convert 0 C to 32 F', () => {
//     const result = celsiusToFahrenheit(0)
//     expect(result).toBe(32)
// })

//Done is used for async testing. You must provide a done arg, and invoke it when the test should be finished
// test('Async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)
// })

// test('Should add two numbers', (done) => {
//     add(2, 3)
//         .then((sum) => {
//             expect(sum).toBe(5)
//             done()
//         })
// })

// test('Should add two nmbers using async/await', async () => {
//     const sum = await add(10, 22)
//     expect(sum).toBe(32)
// })