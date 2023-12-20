const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const express = require('express');

const app = express();
const port = 3000;

const CLIENT_ID = '1094890715791-qs9qfcurke445sb8rh6jiva3iuav1vcp.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04eMjmCMfvARGCgYIARAAGAQSNwF-L9IrKGtqNOgy4YYw7EBnBei79owDmdYd3GWED7aAh-yIZP6BVKYwlngE3gJmGdihmrr-Uh8';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

async function sendMail(res) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const otp = generateOTP();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'shyamsam1818@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        text=`
        Hello,
        
        Your One-Time Password (OTP) for verifying your Nveg account is: ${otp}.
        
        Please use this OTP within the next 5 minutes to complete your account verification.
        
        If you did not request this OTP, please ignore this email. Your account security is important to us.
        
        Thank you for using Nveg!
        
        Sincerely,
        The Nveg Team
      `;

        const mailOptions = {
            from: 'Naan than pa Shyam <shyamsam1818@gmail.com>',
            to: 'j2a7g0a2n2003@gmail.com',
            subject: 'Hello from NonVeg App',
            text: text,
        };

        const result = await transport.sendMail(mailOptions);
        
        res.status(200).json({ otp: otp, message: 'Email sent successfully', result: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

app.get('/send-otp', (req, res) => {
    sendMail(res);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
