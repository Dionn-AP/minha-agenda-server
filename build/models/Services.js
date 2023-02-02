"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const mongoObjectId = function () {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};
const Servies = new mongoose_1.Schema({
    company_id: String,
    name_company: String,
    service_types: [
        {
            name_service: String,
            price: Number,
            available: { type: Boolean, default: true },
            _id: { type: mongoose_1.Schema.Types.ObjectId, default: mongoObjectId }
        }
    ],
}, { timestamps: true });
exports.default = mongoose.model('Services', Servies);
