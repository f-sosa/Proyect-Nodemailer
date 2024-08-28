const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

const contactEmail = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com', // Cambié a 'outlook' para mayor compatibilidad con Hotmail
    port: 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.EMAIL_ADDRESS, // Asegúrate de que las credenciales estén en un archivo .env
        pass: process.env.EMAIL_PASS      // Asegúrate de que las credenciales estén en un archivo .env
    },
    /*tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false // Esto permite conexiones no seguras, útil para pruebas
    }*/
});

contactEmail.verify((error) => {
    if (error) {
        console.log('Error in email verification:', error);
    } else {
        console.log('Ready to send emails');
    }
});

app.post("/api/contact", (req, res) => {
    const { firstName, lastName, email, message, phone } = req.body;
    const name = `${firstName} ${lastName}`;
    console.log(process.env.EMAIL_ADDRESS);

    const mail = {
        from: process.env.EMAIL_ADDRESS,
        to: process.env.EMAIL_ADDRESS,
        subject: "Contact Form submission - Portfolio",
        html: `<p>Name: ${name}</p>
               <p>Email: ${email}</p>
               <p>Phone: ${phone}</p>
               <p>Message: ${message}</p>`
    };
    console.log("Entro en api/contact");

    contactEmail.sendMail(mail, (error) => {

        console.log("Entro aca en send email");
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json({ code: 200, status: "Message Sent" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is online on port: ${PORT}`);
});
