const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

//Para correr este programa tenes que poner en una nueva terminal 


const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

/*
Modelo de Gmail

const contactEmail = nodemailer.createTransport({
    service: 'gmail',  // Utiliza el servicio de Gmail
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "", // Asegúrate de que las credenciales estén en un archivo .env
        pass: ""     // Asegúrate de que las credenciales estén en un archivo .env
    },
    /*tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false // Esto permite conexiones no seguras, útil para pruebas
    }*/
//})


//Modelo para hotmail

//Sirve para poder conectarte a tu hotmail o gmail
const contactEmail = nodemailer.createTransport({
    service: 'hotmail',  
    host: 'smtp.live.com',
    port: 587,  // Puerto estándar para TLS/STARTTLS
    secure: false,  // Cambiar a true si se usa el puerto 465
    auth: {
        user: "", // Usa variables de entorno del .env
        pass: "", // Usa variables de entorno .env
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    }
});


//Verifica si hay algun error al conectarte a tu hotmail
contactEmail.verify((error) => {
    if (error) {
        console.log('Error in email verification:', error);
    } else {
        console.log('Ready to send emails');
    }
});


//Hace el envio de datos
app.post("/api/contact", (req, res) => {
    const { firstName, lastName, email, message, phone } = req.body;
    const name = `${firstName} ${lastName}`;
    console.log(process.env.EMAIL_ADDRESS);

    const mail = {
        from: "",//Usar el mismo email en el cual queres que te lleguen los correos
        to: "",//Repetir el email
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
