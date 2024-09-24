import { NextRequest, NextResponse } from "next/server";
import connectToDb from "@/dbConfig/dbConfig";
import path from "path";
import fs from "fs";
import User, { Images, UserInterface } from "@/model/userModel";
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

connectToDb();

// Directory to save uploads locally
const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

interface TokenPayload extends JwtPayload {
  id: string; // or number, depending on your implementation
}

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const POST = async (req: NextRequest) => {
  // Get login token from cookies
  const loginToken = req.cookies.get("loginToken")?.value;

  if (!loginToken) {
    console.error("Login token is missing");
    return NextResponse.json({ msg: "Login required" }, { status: 401 });
  }

  let user: UserInterface | null;
  try {
    // Verify JWT and extract user information
    const decodedToken = jsonwebtoken.verify(loginToken, process.env.SECRET_TOKEN!) as JwtPayload | string;
    const tokenPayload = decodedToken as TokenPayload;
    user = await User.findById(tokenPayload.id);
    if (!user) {
      throw new Error("User not found");
    }
  } catch (error: unknown) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ msg: "Invalid token" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    
    // Extract file and notes from formData
    const file = formData.get("file");
    const notes = formData.get("notes")?.toString(); // Extract notes from formData

    if (!file || !(file instanceof File)) {
      return NextResponse.json({
        success: false,
        message: "No file uploaded or file type not supported",
      });
    }

    // Check if the uploaded file is an image
    const mimeType = file.type;
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(mimeType)) {
      return NextResponse.json({
        success: false,
        message: "Only images are allowed. Supported formats: JPEG, PNG, GIF, WEBP.",
      },{status:402});
    }

    // Ensure the upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Convert file to buffer and save it locally
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.resolve(UPLOAD_DIR, file.name);
    fs.writeFileSync(filePath, buffer);

    // Upload file to Cloudinary with a unique ID
    const cloudinaryId = uuidv4() + file.name;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id: cloudinaryId,
    });

    // Remove the local file after successful upload
    fs.unlinkSync(filePath);
    console.log(uploadResult);
    
    // Associate uploaded image and notes with the user in the database
    if (user) {
      const newImages = new Images({
        userId: user._id,
        imageUrl: uploadResult.secure_url,
        uploadedAt: new Date(),
        notes: notes || "", // Store notes if provided
        publicId: uploadResult.public_id,
      });
      await newImages.save();
    }

    return NextResponse.json({
      success: true,
      name: file.name,
      url: uploadResult.secure_url,
      // Include notes in response
    });
  } catch (error: unknown) {
    console.error("File upload error:", error);
    return NextResponse.json({
      success: false,
      message: "Error uploading file",
    },{status:501});
  }
};
