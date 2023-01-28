"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express = require('express');
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
const app = express();
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.json());
app.use(routes_1.default);
mongoose_1.default.set('strictQuery', false);
mongoose_1.default.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jdvevpy.mongodb.net/bancodaapi?retryWrites=true&w=majority`)
    .then(() => {
    console.log('Conectado ao MongoDB!');
    app.listen(8000);
})
    .catch((err) => console.log(err));
