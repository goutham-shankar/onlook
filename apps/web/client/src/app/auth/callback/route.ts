import { trackEvent } from '@/utils/analytics/server';
import { env } from '@/env';
import { Routes } from '@/utils/constants';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { api } from '~/trpc/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const publicOrigin = origin || env.NEXT_PUBLIC_SITE_URL;
    const code = searchParams.get('code');
    const supabase = await createClient();

    if (code) {
        const { error, data } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            try {
                await api.user.upsert({
                    id: data.user.id,
                });

                trackEvent({
                    distinctId: data.user.id,
                    event: 'user_signed_in',
                    properties: {
                        name: data.user.user_metadata.name,
                        email: data.user.email,
                        avatar_url: data.user.user_metadata.avatar_url,
                        $set_once: {
                            signup_date: new Date().toISOString(),
                        }
                    }
                });
            } catch (upsertError) {
                // Don't block successful OAuth login if profile sync/telemetry fails.
                console.error(`Post-auth setup failed for user ${data.user.id}`, upsertError);
            }

            return NextResponse.redirect(`${publicOrigin}${Routes.AUTH_REDIRECT}`);
        }
        console.error(`Error exchanging code for session: ${error}`);

        // Recovery path: if session already exists (e.g. code already exchanged), continue.
        const {
            data: { user: existingUser },
        } = await supabase.auth.getUser();

        if (existingUser) {
            try {
                await api.user.upsert({ id: existingUser.id });
            } catch (upsertError) {
                console.error(`Post-auth setup failed for user ${existingUser.id}`, upsertError);
            }
            return NextResponse.redirect(`${publicOrigin}${Routes.AUTH_REDIRECT}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${publicOrigin}/auth/auth-code-error`);
}
