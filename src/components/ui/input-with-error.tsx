// components/ui/input-with-error.tsx
import { Input } from '@/components/ui/input';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type InputProps = ComponentProps<typeof Input>;

interface InputWithErrorProps extends InputProps {
    error?: string;
}

const InputWithError = forwardRef<HTMLInputElement, InputWithErrorProps>(
    ({ className, error, ...props }, ref) => (
        <div className="space-y-1">
            <Input
                ref={ref}
                className={cn(
                    error && 'border-destructive focus-visible:ring-destructive/50',
                    className
                )}
                {...props}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    )
);

InputWithError.displayName = 'InputWithError';

export { InputWithError };