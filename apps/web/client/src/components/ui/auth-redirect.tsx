'use client';

import { env } from '@/env';
import { LocalForageKeys, Routes } from '@/utils/constants';
import { createClient } from '@/utils/supabase/client';
import localforage from 'localforage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const ensureUser = async () => {
            if (env.NEXT_PUBLIC_ONLOOK_DISABLE_AUTH) {
                return;
            }

            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                const pathname = window.location.pathname;
                await localforage.setItem(LocalForageKeys.RETURN_URL, pathname);
                router.push(Routes.LOGIN);
            }
        };
        ensureUser();
    }, [router]);
    return <>{children}</>;
};