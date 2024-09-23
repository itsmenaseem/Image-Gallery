import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import connectToDb from "@/dbConfig/dbConfig";
import jsonwebtoken from "jsonwebtoken";
connectToDb();
export async function GET(req: NextRequest) {
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
        // console.log(user.images);
        
        return NextResponse.json({
          "images":user.images
        });
}
