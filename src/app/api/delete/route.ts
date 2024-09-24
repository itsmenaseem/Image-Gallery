import { Images } from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import connectToDb from "@/dbConfig/dbConfig";
import { v2 as cloudinary } from 'cloudinary';

// Connect to the database
connectToDb();

interface DeleteImageRequest {
    imageId: string;
    publicId: string;
}

export async function POST(req: NextRequest) {
    // Ensure the body is parsed correctly
    const { imageId, publicId } = await req.json() as DeleteImageRequest;

    // Cloudinary Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    // Attempt to delete the image from Cloudinary
    try {
        const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary response:", cloudinaryResponse); // Log the response for debugging
        if (cloudinaryResponse.result !== 'ok') {
            console.error("Cloudinary delete failed:", cloudinaryResponse);
            return NextResponse.json({
                msg: "Failed to delete image from Cloudinary",
            }, { status: 501 });
        }
    } catch (error) {
        console.error("Error connecting to Cloudinary:", error); // Log the error
        return NextResponse.json({
            msg: "Failed to connect to Cloudinary",
        }, { status: 501 });
    }

    // Delete the image from the database
    try {
        const deletedImage = await Images.findByIdAndDelete(imageId);
        if (!deletedImage) {
            return NextResponse.json({
                msg: "Image not found in database",
            }, { status: 404 });
        }
        return NextResponse.json({
            msg: "Image deleted",
        }, { status: 201 });
    } catch (error) {
        console.error("Error deleting image from database:", error); // Log the error
        return NextResponse.json({
            msg: "Failed to delete image from database",
        }, { status: 501 });
    }
}
