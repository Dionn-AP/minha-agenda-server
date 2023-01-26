import { Schema } from "mongoose";
import mongoose from "mongoose";

const Schedules = new Schema({
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
    open_schedules: Boolean,
    id_favorite: [String]
}, { timestamps: true });

export default mongoose.model('Schedules', Schedules);