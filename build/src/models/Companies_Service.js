"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const Companies = new mongoose_1.Schema({
    name: String,
    email: String,
    address: {
        phone: String,
        road: String,
        district: String,
        complement: String,
        post: String,
        number_address: String,
        city: String,
        state: String,
    },
    location: {
        lati: String,
        long: String,
    },
    service_tags: [String],
    open_schedules: Boolean,
    id_favorite: [String]
}, { timestamps: true });
exports.default = mongoose_2.default.model('Companies', Companies);
