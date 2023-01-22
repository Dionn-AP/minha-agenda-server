import { Schema } from "mongoose";
import mongoose from "mongoose";

const User = new Schema({
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

export default mongoose.model('User', User)
