"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const Schedules = new mongoose_1.Schema({
    company_id: String,
    user_id: String,
    schedules_info: {
        service_type: [
            {
                name_service: String,
                price: Number
            }
        ],
        date: Date,
        client: {
            name: String,
            phone: String,
            email: String
        }
    }
}, { timestamps: true });
exports.default = mongoose_2.default.model('Schedules', Schedules);
