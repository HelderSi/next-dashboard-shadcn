import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomersTable } from './customers-table';
import { db } from '@/lib/db';
import { AddCustomerButton } from './add-customer-button';
import Link from 'next/link';
import { StatusEnum } from '@/models/Product';

export default async function CustomersPage(
    props: {
        readonly searchParams: Promise<{ q: string; offset: string, size: string, filterField: string, filterValue: string, sort: string }>;
    }
) {
    const searchParams = await props.searchParams;
    const search = searchParams.q ?? '';
    const offset = searchParams.offset ?? 0;
    const pageSize = searchParams.size ?? 10;
    const sort = searchParams.sort ?? 'name:asc';
    const activeTab = searchParams.filterField ?? 'all';
    const filterValue = searchParams.filterValue ?? '';


    const { customers, newOffset, totalCustomers } = await db.getCustomers(
        {
            search,
            offset: Number(offset),
            pageSize: Number(pageSize),
            filterField: activeTab,
            filterValue,
            sort
        }
    );
    return (
        <Tabs defaultValue={activeTab}>
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="all" asChild>
                        <Link href={{ pathname: '/customers' }}>Todos</Link>
                    </TabsTrigger>
                    <TabsTrigger value={StatusEnum.active} asChild>
                        <Link href={{ pathname: '/customers', query: { filterField: 'status', filterValue: StatusEnum.active } }}>Ativos</Link>
                    </TabsTrigger>
                    <TabsTrigger value={StatusEnum.inactive} asChild>
                        <Link href={{ pathname: '/customers', query: { filterField: 'status', filterValue: StatusEnum.inactive } }}>Inativos</Link>
                    </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    {/* Wrap the export button in an anchor linking to the export CSV endpoint */}
                    <a
                        href="/api/customers/export"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline"
                    >
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Exportar
                            </span>
                        </Button>
                    </a>
                    <AddCustomerButton />
                </div>
            </div>
            <TabsContent value={activeTab}>
                <CustomersTable
                    customers={customers}
                    offset={newOffset ?? totalCustomers}
                    total={totalCustomers}
                    showTitleDescription
                    pageSize={(newOffset ?? totalCustomers) - Number(offset)}
                    sort={sort}
                />
            </TabsContent>
        </Tabs>
    );
}