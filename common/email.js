const env = require('../keys')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: false,
    ignoreTLS: true,
    auth: {
        user: env.MAIL_USERNAME,
        pass: env.MAIL_PASSWORD
    }
});

const options = {
    viewEngine: {
        layoutsDir: 'views/email/',
        defaultLayout : '',
        extname: '.hbs'
    },
    viewPath: path.join(__dirname, '../views/email/'),
    extName: '.hbs'
}
transporter.use('compile', hbs(options))

module.exports = async (email, subject, template, contextData = false)=>{
    await transporter.sendMail({
        to: email,
        from: env.EMAIL_FROM,
        subject,
        template,
        context: contextData
    }, (err, info)=>{
        if (err) {
            throw new Error(err.message);
        }
        console.log("Message sent: %s", info.message);
    })
}