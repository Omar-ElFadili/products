// require('dotenv').config();
// const config = require('config');
// const nodemailer = require('nodemailer');

// module.exports = async (email, subject, text ) => {
//     try {
//         // Nodemailer configuration for sending verification email
//         var transporter = nodemailer.createTransport({
//             service : process.env.SERVICE,
//             auth: {
//                 user: process.env.AUTH_EMAIL,
//                 pass: process.env.AUTH_PASS
//             }
//         });

//         await transporter.sendMail({
//             from: process.env.AUTH_EMAIL,
//             to: email,
//             subject: subject,
//             text: text
//         });

//         console.log('An email sent to your account: ', process.env.AUTH_EMAIL);

//         // transporter.verify((error, success) => {
//         //     if (error) {
//         //         console.log('We have an error: ', config.get('authEmail'), error);
//         //     } else {
//         //         console.log('Ready for sending messages', success);
//         //     }
//         // });

//     } catch (err) {
//         console.log('Email not sent to your account : ',process.env.AUTH_EMAIL);
//     }
// };
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const fs = require("fs");
const ejs = require("ejs");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, subject, text, urlTemplate) => {
    try {
        // const emailString = email.toString();
        // console.log('convertion de email', emailString)
        theEmail = email.toString()
        console.log('convertion de email', theEmail)
        if (typeof theEmail !== 'string' || !theEmail.trim()) {
            console.log('L\'adresse e-mail destinataire n\'est pas valide');
            return; // ou lancez une erreur appropriée
        }
        
        let emailTemplate = await fs.readFileSync(urlTemplate, "utf-8");
        emailTemplate = ejs.compile(emailTemplate);
        emailTemplate = emailTemplate({ token: text });
        console.log('l email sera envoye au : ', email);
        console.log('Valeur de email:', email);
        const msg = {
            from: process.env.AUTH_EMAIL,
            to: theEmail,
            subject: subject,
            html: emailTemplate,
        };

        await sgMail.send(msg);

        console.log('An email sent to your account: ', email);

    } catch (err) {
        console.log('Email not sent to your account : ', email);
    }
};

module.exports = sendEmail;

