'use client';

import { LocalForageKeys, Routes } from '@/utils/constants';
import { env } from '@/env';
import { sanitizeReturnUrl } from '@/utils/url';
import localforage from 'localforage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { api } from '@/trpc/react';

export default function AuthRedirect() {
    const router = useRouter();
    const shouldBypassSubscriptionGate =
        process.env.NODE_ENV === 'development' || env.NEXT_PUBLIC_ONLOOK_DISABLE_AUTH;
    const { data: subscription, isLoading: subscriptionLoading } = api.subscription.get.useQuery();
    const { data: legacySubscription, isLoading: legacyLoading } = api.subscription.getLegacySubscriptions.useQuery();

    useEffect(() => {
        const handleRedirect = async () => {
            const returnUrl = await localforage.getItem<string>(LocalForageKeys.RETURN_URL);
            await localforage.removeItem(LocalForageKeys.RETURN_URL);

            // Local self-hosting: skip subscription gate in development.
            if (shouldBypassSubscriptionGate) {
                const sanitizedUrl = sanitizeReturnUrl(returnUrl);
                router.replace(sanitizedUrl);
                return;
            }

            // Wait for both subscription queries to complete
            if (subscriptionLoading || legacyLoading) {
                return;
            }

            // If user has no active subscription or legacy subscription, redirect to demo-only page
            if (!subscription && !legacySubscription) {
                router.replace(Routes.DEMO_ONLY);
                return;
            }

            // Otherwise, redirect to their intended destination
            const sanitizedUrl = sanitizeReturnUrl(returnUrl);
            router.replace(sanitizedUrl);
        };
        handleRedirect();
    }, [router, shouldBypassSubscriptionGate, subscription, legacySubscription, subscriptionLoading, legacyLoading]);

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-semibold mb-4">Redirecting...</h1>
                <p className="text-foreground-secondary">Please wait while we redirect you back.</p>
            </div>
        </div>
    );
} 