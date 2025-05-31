"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Configurações da aplicação</h2>

            <Tabs defaultValue="general" className="mt-6 w-full">
                <TabsList className="bg-zinc-100">
                    <TabsTrigger value="general">Geral</TabsTrigger>
                    <TabsTrigger value="users">Usuários</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <div className="text-zinc-600 mt-2">General settings.</div>
                </TabsContent>

                <TabsContent value="users">
                    <div className="text-zinc-600 mt-2">Users page.</div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
