"use server";

import { env } from '@/env';
import { DEMO_USER } from '@/utils/auth/demo-user';
import { createClient as createSupabaseClient } from '@/utils/supabase/request-server';
import { authUsers, users } from '@onlook/db';
import { db } from '@onlook/db/src/client';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { TRPCError } from '@trpc/server';
import type { NextRequest } from 'next/server';
import { cache } from 'react';
import { createCaller, type AppRouter } from '~/server/api/root';
import { createQueryClient } from './query-client';

export const createTRPCContext = async (req: NextRequest, opts: { headers: Headers }) => {
    const supabase = await createSupabaseClient(req);
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error && error.message !== 'Auth session missing!') {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: error.message });
    }

    const effectiveUser = user ?? (env.ONLOOK_DISABLE_AUTH ? DEMO_USER : null);

    if (env.ONLOOK_DISABLE_AUTH && effectiveUser) {
        await db
            .insert(authUsers)
            .values({
                id: effectiveUser.id,
                email: effectiveUser.email ?? '',
                emailConfirmedAt: effectiveUser.email_confirmed_at ? new Date(effectiveUser.email_confirmed_at) : null,
                rawUserMetaData: effectiveUser.user_metadata,
            })
            .onConflictDoNothing();

        await db
            .insert(users)
            .values({
                id: effectiveUser.id,
                email: effectiveUser.email ?? null,
                firstName: (effectiveUser.user_metadata.first_name as string | undefined) ?? null,
                lastName: (effectiveUser.user_metadata.last_name as string | undefined) ?? null,
                displayName: (effectiveUser.user_metadata.display_name as string | undefined) ?? (effectiveUser.user_metadata.name as string | undefined) ?? null,
                avatarUrl: (effectiveUser.user_metadata.avatar_url as string | undefined) ?? (effectiveUser.user_metadata.avatarUrl as string | undefined) ?? null,
            })
            .onConflictDoNothing();
    }

    return {
        db,
        supabase,
        user: effectiveUser,
        ...opts,
    };
};

const createContext = async (req: NextRequest) => {
    return createTRPCContext(
        req,
        { headers: req.headers },
    );
};


const getQueryClient = cache(createQueryClient);

/**
 * Used for API routes without using next headers lib
 */
export const createClient = async (req: NextRequest) => {
    const context = await createContext(req);
    const caller = createCaller(context);

    const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
        caller,
        getQueryClient,
    );

    return { api, HydrateClient };
}