import { NextResponse ,NextRequest} from "next/server";
export function GET(){
    try {
        const response=NextResponse.json({
            message:"Logout succesfull",
            suceess:true
        },{status:201});
        // Clear the login token cookie
        response.cookies.set("loginToken","",{
            httpOnly:true,expires:new Date(0)
        });
        return response;
    } catch (error:unknown) {
        return NextResponse.json(
            {error:"error"}
        ,{status:500})
    }
}