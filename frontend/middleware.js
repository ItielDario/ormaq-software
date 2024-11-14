import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {

  if(request.cookies.has("jwt") == false)  
    return NextResponse.redirect(new URL('/login', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
}