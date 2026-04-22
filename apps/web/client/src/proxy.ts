import { env } from '@/env';
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    if ((env.ONLOOK_DISABLE_AUTH || env.NEXT_PUBLIC_ONLOOK_DISABLE_AUTH) && request.nextUrl.pathname === '/login') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/auth/redirect';
        return NextResponse.redirect(redirectUrl);
    }

    // update user's auth session
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
