import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isAdminPreviewRoute = createRouteMatcher([
  '/dashboard',
  '/dashboard/home(.*)',
  '/dashboard/projects(.*)',
  '/dashboard/datasets(.*)',
  '/dashboard/templates(.*)',
  '/dashboard/people(.*)',
  '/dashboard/teams(.*)',
  '/dashboard/vendors(.*)'
]);

const clerkEnabled = process.env.NEXT_PUBLIC_ENABLE_CLERK === 'true';

export default clerkEnabled
  ? clerkMiddleware(async (auth, req: NextRequest) => {
      if (isProtectedRoute(req) && !isAdminPreviewRoute(req)) await auth.protect();
    })
  : function proxy() {
      return NextResponse.next();
    };
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
