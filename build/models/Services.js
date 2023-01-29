"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const Servies = new mongoose_1.Schema({
    company_id: String,
    name_company: String,
    service_types: [
        {
            name_service: String,
            price: Number,
            available: { type: Boolean, default: true }
        }
    ],
}, { timestamps: true });
exports.default = mongoose_2.default.model('Services', Servies);
