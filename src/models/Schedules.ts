import { Schema } from "mongoose";
import mongoose from "mongoose";

const Schedules = new Schema({
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

export default mongoose.model('Schedules', Schedules);