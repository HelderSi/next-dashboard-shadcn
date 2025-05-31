"use client";

import { z } from 'zod';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { InputWithError } from '@/components/ui/input-with-error';

const loginSchema = z.object({
    email: z.string().email("Informe um email válido").nonempty("Email é obrigatório"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const ResetPasswordPage = () => {
    const [message,] = useState("");
    const [loading,] = useState(false);


    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const { sendPasswordResetLink } = useAuthStore();

    const onSubmit = async (data: LoginFormData) => {
        const promise = sendPasswordResetLink(data.email);
        toast.promise(promise, {
            loading: 'Enviando link',
            success: 'Link de recuperação enviado para seu email.',
            error: 'Erro ao enviar link.',
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md p-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Recuperar Senha</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <InputWithError
                            type="email"
                            placeholder="Seu email"
                            {...register("email", { required: true })}
                            className="w-full"
                            required
                            error={errors.email?.message}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar Link de Recuperação"}
                        </Button>
                    </form>
                    {message && <p className="mt-4 text-sm text-center text-gray-500">{message}</p>}
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPasswordPage;
