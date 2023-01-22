import { Schema } from "mongoose";
import mongoose from "mongoose";

const ConfirmPassword = new Schema({
    name: String,
    email: String,
    code: String
}, { timestamps: true });

export default mongoose.model('ConfirmPass', ConfirmPassword)