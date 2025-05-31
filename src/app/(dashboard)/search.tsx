'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Spinner } from '@/components/icons';

export function SearchInput({
    path = '',
    position = 'mr-auto',
    placeholder = ''
}: {
    readonly path?: string;
    readonly position?: 'mr-auto' | 'ml-auto';
    readonly placeholder?: string;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function searchAction(formData: FormData) {
        const value = formData.get('q') as string;
        const params = new URLSearchParams({ q: value });
        startTransition(() => {
            router.replace(`/${path}?${params.toString()}`);
        });
    }

    return (
        <form action={searchAction} className={`relative flex-1 ${position} md:grow-0`}>
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input
                name="q"
                type="search"
                placeholder={placeholder || "Buscar..."}
                className="w-full rounded-lg bg-background pl-8 pr-8 md:w-[200px] lg:w-[336px]"
            />

            {isPending && (
                <Spinner className='absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4' />
            )}
        </form>
    );
}