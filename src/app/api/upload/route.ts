import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import User from "@/model/userModel";
import jsonwebtoken from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
// Directory to save uploads locally
const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

export const POST = async (req: NextRequest) => {
    const loginToken=req.cookies.get("loginToken")?.value;
    if (!loginToken) {
      console.error("Login token is missing");  // Log missing token
      return;  // Exit or handle missing token scenario (e.g., return, redirect)
    }
        let user;
        try {
          // Verify the token only if loginToken is defined
          console.log(process.env.SECRET_TOKEN);
          const tokenPayload:any = jsonwebtoken.verify(loginToken, process.env.SECRET_TOKEN!);
          // Continue processing with the verified token
          user = await User.findById(tokenPayload.id);
          if(!user) throw new Error(`Could not find`);
        } catch (error) {
          console.error('Token verification failed:');  // Log the verification error
          // Handle verification error (e.g., redirect to login page)
          return NextResponse.json({
            msg:"Verification failed"
          },{status:401});
        }
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({
        success: false,
        message: "No file uploaded or file type not supported",
      });
    }

    // Configure Cloudinary
    cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_SECRET_KEY
    });

    // Ensure the upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Convert file to a Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save the file to the local file system
    const filePath = path.resolve(UPLOAD_DIR, file.name);
    fs.writeFileSync(filePath, buffer);

    // Upload the saved file to Cloudinary
    const rand=uuidv4()
    // console.log(rand+file.name);
    
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id: rand+file.name, // Set a unique public ID
    });
    // Log the Cloudinary upload result
    // console.log(uploadResult);
    fs.unlinkSync(filePath);
    // Respond with success
      if(user){
        user.images.push(uploadResult.secure_url);
        await user.save();
      }
    return NextResponse.json({
      success: true,
      name: file.name,
      url: uploadResult.secure_url, // Return the Cloudinary URL
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({
      success: false,
      message: "Error uploading file",
    });
  }
};
