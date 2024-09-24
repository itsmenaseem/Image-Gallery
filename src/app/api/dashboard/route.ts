import { NextRequest, NextResponse } from "next/server";
import User,{Images} from "@/model/userModel";
import connectToDb from "@/dbConfig/dbConfig";
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
connectToDb();
interface TokenPayload {
  id: string; // or number, depending on your implementation
  // Add any other properties that your token might include
}
export async function GET(req: NextRequest) {
    const loginToken=req.cookies.get("loginToken")?.value;
    if (!loginToken) {
      console.error("Login token is missing");  // Log missing token
      return;  // Exit or handle missing token scenario (e.g., return, redirect)
    }
        let user;
        try {
          // Verify the token only if loginToken is defined
          const decodedToken = jsonwebtoken.verify(loginToken, process.env.SECRET_TOKEN!) as JwtPayload | string;
          const tokenPayload= decodedToken as TokenPayload
          // Continue processing with the verified token
          user = await User.findById(tokenPayload.id);
          if(!user) throw new Error(`Could not find`);
        } catch (error:unknown) {
          console.error('Token verification failed:',error);  // Log the verification error
          // Handle verification error (e.g., redirect to login page)
          return NextResponse.json({
            msg:"Verification failed"
          },{status:401});
        }
        // console.log(user.images);
          // Find all galleries for the user
          const userGalleries = await Images.find({ userId: user._id });

          // Extract and combine all images from each gallery document
          const allImages = userGalleries.reduce((acc, gallery) => {
            return acc.concat(gallery);
          }, []);
        return NextResponse.json({
          "images":allImages
        });
}
