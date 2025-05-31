// components/volunteer-card.tsx
"use client";

import { NrType, VolunteerModel } from "@/models/Volunteer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCPF, formatDate } from "@/lib/utils";

function daysUntilExpire(dateStr: string, yearsValid: number) {
    const date = new Date(dateStr);
    date.setFullYear(date.getFullYear() + yearsValid);
    const diffMs = date.getTime() - Date.now();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

type NRInfoProps = {
    label: string;
    nr: NrType;
    validYears: number;
};

function NRInfo({ label, nr, validYears }: NRInfoProps) {
    const hasCourse = Boolean(nr.curso?.data);
    const hasAso = Boolean(nr.aso?.data);
    if (!hasCourse && !hasAso) return null;

    const daysLeft = hasCourse ? daysUntilExpire(nr.curso.data, validYears) : null;
    const expired = daysLeft !== null && daysLeft < 0;
    const cardStyle = expired
        ? "border rounded p-3 flex flex-col bg-red-50"
        : "border rounded p-3 flex flex-col";
    const badgeStyle = expired
        ? "bg-red-100 text-red-800 border-red-200"
        : "bg-green-100 text-green-800 border-green-200";
    return (
        <div className={cardStyle}>
            <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-700">{label}</span>
                <Badge className={badgeStyle}>{expired ? 'Expirado' : 'Válido'}</Badge>
            </div>
            <div className="mt-2 text-sm text-zinc-600 space-y-1">
                {hasCourse && (
                    <p>
                        <strong>Curso:</strong> {formatDate(new Date(nr.curso.data))}
                        {daysLeft !== null && !expired && (
                            <span> (Vence em {daysLeft} dias)</span>
                        )}
                        {expired && <span className="text-red-600"> (vencido)</span>}
                    </p>
                )}
                {hasAso && (
                    <p>
                        <strong>ASO:</strong> {formatDate(new Date(nr.aso.data))}
                        <span className="text-zinc-500"></span>
                    </p>
                )}
            </div>
        </div>
    );
}

export function VolunteerCard({ volunteer }: { volunteer: VolunteerModel }) {
    const { name, imageUrl, doc, nr05, nr10, nr35, adm } = volunteer;

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
            <Card className="w-full max-w-3xl max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
                {/* Header: side-by-side avatar and basic info */}
                <div className="text-2xl text-zinc-800 m-1">CONGREGAÇÃO CRISTÃ NO BRASIL</div>
                <CardHeader className="flex flex-row items-center space-x-4 p-4">
                    <Avatar className="w-24 h-24 rounded-md">
                        {imageUrl ? (
                            <AvatarImage src={imageUrl} alt={name} className="object-cover" />
                        ) : (
                            <div className="bg-zinc-300 w-full h-full rounded-md" />
                        )}
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-2xl text-zinc-800 mb-1">{name}</CardTitle>
                        <p className="text-sm text-zinc-500">{formatCPF(doc)}</p>
                        <p className="text-sm text-zinc-500">{adm.cidade} - {adm.estado}</p>

                    </div>
                </CardHeader>

                <CardContent className="flex flex-col flex-1 p-4 overflow-y-auto">
                    {/* NR Panels */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <NRInfo label="NR 05" nr={nr05} validYears={2} />
                        <NRInfo label="NR 10" nr={nr10} validYears={1} />
                        <NRInfo label="NR 35" nr={nr35} validYears={1} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
