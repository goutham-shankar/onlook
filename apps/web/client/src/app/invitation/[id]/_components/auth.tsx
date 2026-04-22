'use client';

import { Routes } from '@/utils/constants';
import { Button } from '@onlook/ui/button';
import { Icons } from '@onlook/ui/icons/index';
import { useRouter } from 'next/navigation';

export const HandleAuth = () => {
    const router = useRouter();

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-2xl">Continue to projects</div>
                <Button variant="outline"
                    onClick={() => router.push(Routes.PROJECTS)}
                >
                    <Icons.OnlookLogo className="size-4" />
                    Open Projects
                </Button>
            </div>
        </div>
    )
}