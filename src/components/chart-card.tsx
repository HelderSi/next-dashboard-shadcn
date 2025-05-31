"use client";

import React, { JSXElementConstructor, ReactElement, ReactNode } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// import { ChartContainer } from "./ui/chart";
// Your chart container component

type ChartCardProps = Readonly<{
    title: string;
    description: string;
    chartConfig?: any; // Customize type if needed
    chartData: any[];  // Data for the chart
    renderChart: (data: any[]) => ReactNode & ReactElement<unknown, string | JSXElementConstructor<any>>; // Function to render the chart based on data
    footerStat?: string;
    footerDescription?: string;
    className?: string;
    key?: string;
}>;

export function ChartCard({
    title,
    description,
  //  chartConfig = {},
    chartData,
    renderChart,
    footerStat,
    footerDescription,
    className,
}: ChartCardProps) {

    return (
        <Card className={`bg-zinc-100 border border-zinc-700 ${className ?? ""}`} >
            <CardHeader className="pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {renderChart(chartData)}
            </CardContent>
            {(footerStat || footerDescription) && <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {footerStat}
                </div>
                <div className="leading-none text-muted-foreground">
                    {footerDescription}
                </div>
            </CardFooter>}
        </Card>
    );
}
