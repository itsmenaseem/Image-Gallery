
import { NextRequest,NextResponse } from "next/server";
// connect();
export async function middleware(request:NextRequest){
    const path=request.nextUrl.pathname;
    const token:any=request.cookies.get("loginToken")?.value || '';
    const isPublic=path==="/";
    if(isPublic && token){
        return NextResponse.redirect(new URL("/dashboard",request.nextUrl));
    }
    if(!isPublic && !token)
        return NextResponse.redirect(new URL("/",request.nextUrl));
}

export const config = {
    matcher: ['/dashboard/:path*','/',"/upload/:path*"], // Middleware will only run on these routes
  };