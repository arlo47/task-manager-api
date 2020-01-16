const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to: 'gfitzpatrick@mogiletech.com',
//     from: 'gfitzpatrick2@gmail.com',
//     subject: 'this is my first email',
//     text: 'I hope this one actually gets to you'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gfitzpatrick2@gmail.com',
        subject: 'Thanks for joining in',
        text: `hello ${name}!, Welcome to the app. Let me know how you like it.`
    })
}

const sendDeleteEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gfitzpatrick2@gmail.com',
        subject: 'deleted',
        text: `goodbye ${name}!,`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail
}