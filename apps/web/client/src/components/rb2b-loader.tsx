'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { env } from '@/env';

export default function RB2BLoader() {
    const pathname = usePathname();

    useEffect(() => {
        const rb2bId = env.NEXT_PUBLIC_RB2B_ID;
        if (!rb2bId || rb2bId.includes('<') || rb2bId.includes('>')) return;
        
        const existing = document.getElementById('rb2b-script');
        if (existing) existing.remove();
        
        const script = document.createElement('script');
        script.id = 'rb2b-script';
        script.src = `https://ddwl4m2hdecbv.cloudfront.net/b/${rb2bId}/${rb2bId}.js.gz`;
        script.async = true;
        document.body.appendChild(script);
    }, [pathname]);

    return null;
}
