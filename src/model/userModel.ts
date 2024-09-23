import mongoose, { Schema, Document } from 'mongoose';

interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
    images: string[];
    createdAt: Date;
}

const userSchema: Schema<UserInterface> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    images: { type: [String],default: []  },
    createdAt: { type: Date, default: Date.now }
});
const User=mongoose.models.ImageGallery || mongoose.model("ImageGallery",userSchema);
export default User;
