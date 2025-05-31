'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedLayout({ children }: { readonly children: React.ReactNode }) {
    const router = useRouter();
    const { user, loading } = useAuthStore();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else {
            router.push('/');
        }
    }, [user, loading, router]);

    return <>{children}</>;
}