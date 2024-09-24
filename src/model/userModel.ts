import mongoose, { Schema, Document } from 'mongoose';

export interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

const userSchema: Schema<UserInterface> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
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
