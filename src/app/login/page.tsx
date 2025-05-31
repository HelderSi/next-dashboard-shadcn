// app/login/page.tsx
"use client";

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { InputWithError } from "@/components/ui/input-with-error";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { loading, error, loginUser } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const handleEmailLogin = async (data: LoginFormData) => {
        await loginUser(data.email, data.password);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="mb-4 text-2xl font-bold text-center">NR Digital CCB</h1>

            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded shadow">
                <h2 className="mb-4 text-xl font-bold text-center">Login</h2>
                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
                <form onSubmit={handleSubmit(handleEmailLogin)}>
                    <div className="mb-4">
                        <label className="block mb-1">Email</label>
                        <InputWithError
                            type="email"
                            className="w-full"
                            placeholder="you@example.com"
                            required
                            {...register('email')}
                            error={errors.email?.message}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Password</label>
                        <InputWithError
                            type="password"
                            className="w-full"
                            placeholder="********"
                            required
                            {...register('password')}
                            error={errors.password?.message}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Login"}
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <Link href="/reset-password" className="text-sm text-blue-500 hover:underline">
                        Esqueceu a senha?
                    </Link>
                </div>
            </div>
        </div>
    );
}
