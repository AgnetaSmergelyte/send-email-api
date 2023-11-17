const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const cors = require('cors');
app.use(cors({
    origin: 'https://www.agnetasmergelyte.lt'
}));
app.use(express.json());
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.USER_KEY
    }
});

app.post("/send", (req, res) => {
    const {email, message} = req.body;
    const emailRegex = /^([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/
    if (!email.match(emailRegex)) {
        res.send({error: true, message: "Incorrect email address"});
        return;
    } else if (message === '') {
        res.send({error: true, message: "Message cannot be empty"});
        return;
    }
    const mailOptions = {
        to: process.env.RECEIVER,
        subject: email,
        text: message
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send({error: true, message: "Server error"});
        } else {
            res.send({error: false, message: "Message sent"});
        }
    });
});

app.listen(port);