import connectToDb from "@/dbConfig/dbConfig";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectToDb();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({
                msg: "User not found"
            }, { status: 401 });
        }

        // Verify the password
        const isPasswordMatched:boolean = await bcryptjs.compare(password, user.password);
        if (!isPasswordMatched) {
            return NextResponse.json({
                msg: "Invalid password"
            }, { status: 401 });
        }

        // Create a JWT token
        const tokenPayload = { id: user._id };
        const loginToken = jwt.sign(tokenPayload, process.env.SECRET_TOKEN!, { expiresIn: "1h" });

        // Prepare the response
        const response = NextResponse.json({
            msg: "Login successful",
        }, { status: 200 });

        // Set token as an httpOnly cookie
        response.cookies.set("loginToken",loginToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only secure in production
            maxAge: 60 * 60, // 1 hour
            path: "/"
        });

        return response;
    } catch (error: unknown) {
        console.error("Error during login:", error);
        return NextResponse.json({
            msg:  "An unknown error occurred"
        }, { status: 500 });
    }
}
