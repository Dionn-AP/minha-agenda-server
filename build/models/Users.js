"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const User = new mongoose_1.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    road: String,
    district: String,
    complement: String,
    post: String,
    number_address: String,
    city: String,
    state: String
}, { timestamps: true });
exports.default = mongoose_2.default.model('User', User);
