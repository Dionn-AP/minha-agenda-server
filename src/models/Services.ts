import { Schema } from "mongoose";
import mongoose from "mongoose";

const Servies = new Schema({
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

export default mongoose.model('Services', Servies);



