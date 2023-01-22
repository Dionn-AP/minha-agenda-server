const nodemailer = require('nodemailer');

interface NodeMailer {
    host: string;
    port: number;
    user: string;
    pass: string;
}

export const transporter = nodemailer.createTransport({
    host: process.env.MAILGUN_HOST,
    port: process.env.MAILGUN_PORT,
    secure: false,
    auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PASS
    }
});