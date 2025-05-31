"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Spinner } from "@/components/icons";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type CustomerStats = {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
};

const COLORS = ["#3f3f46", "#d4d4d8"]; // Ativo: zinc-700, Inativo: zinc-300

export default function DashboardPage() {
    const [stats, setStats] = useState<CustomerStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/customers/stats");
                if (!res.ok) {
                    throw new Error("Failed to fetch stats");
                }
                const data = await res.json();
                console.log(data);
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white/70 z-50 flex items-center justify-center">
                <Spinner className="w-10 h-10 text-zinc-500" />
            </div>
        );
    }

    if (!stats) {
        return <div className="text-red-500">Error loading dashboard metrics.</div>;
    }

    const pieData = [
        { name: "Ativos", value: stats.activeCustomers },
        { name: "Inativos", value: stats.inactiveCustomers },
    ];

    return (
        <div className="p-6 min-h-screen text-zinc-100">
            <h2 className="text-2xl font-semibold mb-4 text-zinc-800">Estatísticas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-100 border border-zinc-700 mb-6 shadow-lg flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle>Customers</CardTitle>
                        <CardDescription>Total de Customers</CardDescription>
                    </CardHeader>
                    <CardContent className="text-4xl font-bold text-zinc-800 text-right">
                        {stats.totalCustomers}
                    </CardContent>
                </Card>
                <Card className="bg-zinc-100 border border-zinc-700 mb-6 shadow-lg flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle>Customers Ativos</CardTitle>
                        <CardDescription>Total de Customers Ativos</CardDescription>
                    </CardHeader>
                    <CardContent className="text-4xl font-bold text-zinc-800 text-right">
                        {stats.activeCustomers}
                    </CardContent>
                </Card>
                <Card className="bg-zinc-100 border border-zinc-700 mb-6 shadow-lg flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle>Customers Inativos</CardTitle>
                        <CardDescription>Total de Customers Inativos</CardDescription>
                    </CardHeader>
                    <CardContent className="text-4xl font-bold text-zinc-800 text-right">
                        {stats.inactiveCustomers}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-100 border border-zinc-700 mb-6 shadow-lg">
                    <CardHeader>
                        <CardTitle>Ativos vs Inativos</CardTitle>
                        <CardDescription>Distribuição de customers</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
