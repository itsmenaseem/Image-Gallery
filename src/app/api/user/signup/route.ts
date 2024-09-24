import connectToDb from "@/dbConfig/dbConfig";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendMail } from "@/helper/mail";
// Ensure database is connected
connectToDb();

export async function POST(request: NextRequest) {
    try {
        // Extract name, email, and password from request body
        const { name, email, password } = await request.json();


        // Check if email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(existingUser);
            
            if(!existingUser.verified){
                sendMail(email,existingUser._id);
                return NextResponse.json({
                    error: "Email is not verified"
                }, { status: 410 }); 
            }
            else{
                return NextResponse.json({
                    error: "Email already exists"
                }, { status: 409 }); // Use 409 Conflict for existing resources
            }
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
        sendMail(email,savedUser._id);
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            user: {
                name: savedUser.name,
                email: savedUser.email,
                createdAt: savedUser.createdAt
            }
        }, { status: 201 }); // Use 201 Created for successful creation

    } catch (error: any) {
        // Log error and return server error response
        console.error("Error in POST request:", error.message);
        return NextResponse.json({
            error: error.message || "An unknown error occurred"
        }, { status: 500 });
    }
}
