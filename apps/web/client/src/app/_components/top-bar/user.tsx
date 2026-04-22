'use client';

import { CurrentUserAvatar } from '@/components/ui/avatar-dropdown';
import { api } from '@/trpc/react';
import { Routes } from '@/utils/constants';
import { Button } from '@onlook/ui/button';
import Link from 'next/link';

export const AuthButton = () => {
    const { data: user } = api.user.get.useQuery();
    return (
        <div className="flex items-center gap-3 mt-0">
            <Button variant="secondary" asChild className="rounded cursor-pointer">
                <Link href={Routes.PROJECTS}>Projects</Link>
            </Button>
            {user ? <CurrentUserAvatar className="cursor-pointer hover:opacity-80" /> : null}
        </div>
    );
};