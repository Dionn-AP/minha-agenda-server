import { Schema } from "mongoose";
import mongoose from "mongoose";

const Companies = new Schema({
    company: String,
    name_owner: String,
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

export default mongoose.model('Companies', Companies);