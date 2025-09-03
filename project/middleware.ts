import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Set protected routes
const isProtected = createRouteMatcher([
  "/analytics(.*)",
  "/calendar(.*)",
  "/dashboard(.*)",
  "/projects(.*)",
  "/settings(.*)",
  "/team(.*)"
]);

// Set public only routes
const isAuthOnlyPublic = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up"
]);

export default clerkMiddleware(async (auth, req) => {
  // Get userId
  const { userId } = await auth();

  // Authenticated user accessing public only route, redirect to dashboard
  if(userId){
    if(isAuthOnlyPublic(req)){
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } 
  // Not authenticated user accessing protected route, redirect to sign in
  else{
    if(isProtected(req)){
      await auth.protect();
    }
  }

  // Allow request
  return NextResponse.next();
});

// Setup matcher
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};