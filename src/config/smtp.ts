const nodemailer = require('nodemailer');

interface NodeMailer {
    host: string;
    port: number;
    user: string;
    pass: string;
}

const transporter = nodemailer.createTransport({
    host: process.env.MAILGUN_HOST,
    port: process.env.MAILGUN_PORT,
    secure: false,
    auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PASS
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
});

module.exports = transporter;