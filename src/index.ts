require('dotenv').config();
const express = require('express');
import mongoose from 'mongoose';

import routes from './routes';

const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.use(routes);

mongoose.set('strictQuery', false)

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jdvevpy.mongodb.net/bancodaapi?retryWrites=true&w=majority`
)
    .then(() => {
        console.log('Conectado ao MongoDB!')
        app.listen(8000)
    })
    .catch((err) => console.log(err));