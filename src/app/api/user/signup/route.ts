import connectToDb from "@/dbConfig/dbConfig";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs";
// Ensure database is connected
connectToDb();

export async function POST(request: NextRequest) {
    try {
        // Extract name, email, and password from request body
        const { name, email, password } = await request.json();


        // Check if email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
                return NextResponse.json({
                    error: "Email already exists"
                }, { status: 409 }); // Use 409 Conflict for existing resource
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save new user to the database
        const savedUser = await newUser.save();
        // Return success response
         // Create a JWT token
         const tokenPayload = { id: savedUser._id };
         const loginToken = jwt.sign(tokenPayload, process.env.SECRET_TOKEN!, { expiresIn: "1h" });
 
         // Prepare the response
         const response = NextResponse.json({
             msg: "Account created successful",
         }, { status: 200 });
 
         // Set token as an httpOnly cookie
         response.cookies.set("loginToken",loginToken, {
             httpOnly: true,
             secure: process.env.NODE_ENV === "production", // Only secure in production
             maxAge: 60 * 60, // 1 hour
             path: "/"
         });
 
         return response;

    } catch (error: any) {
        // Log error and return server error response
        console.error("Error in POST request:", error.message);
        return NextResponse.json({
            error: error.message || "An unknown error occurred"
        }, { status: 500 });
    }
}
