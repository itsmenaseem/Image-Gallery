import mongoose, { Schema, Document } from 'mongoose';

interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
    verifyToken:string;
    verifyTokenExpires: Date;
    verified: boolean;
    createdAt: Date;
}

const userSchema: Schema<UserInterface> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const gallerySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // reference to the User model
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  notes: { type: String,default:""},
  publicId:{ type: String,required:true}
});

export const Images= mongoose.models.Image || mongoose.model('Image', gallerySchema);
const User=mongoose.models.ImageGalleryUser || mongoose.model("ImageGalleryUser",userSchema);
export default User;
