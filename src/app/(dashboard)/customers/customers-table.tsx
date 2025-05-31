'use client';

import {
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    Table
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useTransition } from 'react';
import { SearchInput } from '../search';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { CustomerModel } from '@/models/Customer';
import { Customer } from './customer';
import { deleteManyCustomerById } from './actions';
import { Spinner } from '@/components/icons';

export function CustomersTable({
    customers,
    offset,
    pageSize,
    total,
    showTitleDescription = false,
    sort = 'name:asc'
}: {
    readonly customers: CustomerModel[];
    readonly offset: number;
    readonly pageSize: number;
    readonly total: number;
    readonly showTitleDescription?: boolean;
    readonly sort?: string;
}) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const itemsPerPage = pageSize;


    function prevPage() {
        startTransition(() => {
            router.back();
        });
    }

    function nextPage() {
        startTransition(() => {
            router.push(`customers/?offset=${offset}`, { scroll: false });
        });
    }

    const toggleSelectAll = () => {
        setSelected(selected.size === customers.length ? new Set() : new Set(customers.map(v => v.id)));
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selected);
        if (newSelected.has(id))
            newSelected.delete(id)
        else
            newSelected.add(id)
        setSelected(newSelected);
    };

    const handleSort = (field: keyof CustomerModel) => {
        const currentSort = sort.split(':');
        const currentField = currentSort[0];
        const currentOrder = currentSort[1];
        const newOrder = currentField === field && currentOrder === 'asc' ? 'desc' : 'asc';
        startTransition(() => {
            router.push(`customers/?sort=${field}:${newOrder}`, { scroll: false });
        });
        setSelected(new Set());
    };

    const handleBulkAction = (action: string) => {
        startTransition(() => {
            if (action === 'delete') {
                deleteManyCustomerById([...selected])
            }
            setSelected(new Set())
        });

    };

    return (
        <Card>
            <CardHeader className="flex justify-between">
                {showTitleDescription && (
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Customers {isPending && <Spinner className="w-4 h-4" />}
                        </CardTitle>
                        <CardDescription>
                            Gerenciamento de customers.
                        </CardDescription>
                    </div>
                )}
                <div className="flex gap-2">
                    <SearchInput path='customers' position='mr-auto' placeholder='Buscar Nome ou CPF' />
                    {!!selected.size &&
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled={selected.size === 0}>
                                    Ação em lote ({selected.size})
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => handleBulkAction('delete')}>Deletar</DropdownMenuItem>
                                {/* <DropdownMenuItem onSelect={() => handleBulkAction('mark_active')}>Marcar como Ativo</DropdownMenuItem> */}
                            </DropdownMenuContent>
                        </DropdownMenu>}
                </div>
            </CardHeader>
            <CardContent>
                {isPending && (
                    <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
                        <Spinner className="w-10 h-10 text-zinc-500" />
                    </div>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer hidden md:table-cell">
                                <Checkbox
                                    checked={selected.size === customers.length && customers.length > 0}
                                    disabled={!customers.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            {/* <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                            </TableHead> */}
                            <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                                Nome <ChevronsUpDown className="w-4 h-4 inline" />
                            </TableHead>
                            <TableHead className="cursor-pointer hidden md:table-cell">
                                CPF
                            </TableHead>
                            <TableHead onClick={() => handleSort("createdAt")} className="cursor-pointer hidden md:table-cell">
                                Adicionado em <ChevronsUpDown className="w-4 h-4 inline" />
                            </TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((data) => (
                            <Customer key={data.id} data={data} selected={selected.has(data.id)} onSelectedChange={() => toggleSelect(data.id)} />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <form className="flex items-center w-full justify-between">
                    <div className="text-xs text-muted-foreground">
                        Exibindo{' '}
                        <strong>
                            {Math.max(0, Math.min(offset - itemsPerPage, total) + 1)}-{offset}
                        </strong>{' '}
                        de <strong>{total}</strong> customers
                    </div>
                    <div className="flex">
                        <Button
                            formAction={prevPage}
                            variant="ghost"
                            size="sm"
                            type="submit"
                            disabled={(offset - itemsPerPage) <= 0}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Anterior
                        </Button>
                        <Button
                            formAction={nextPage}
                            variant="ghost"
                            size="sm"
                            type="submit"
                            disabled={offset >= total - 1}
                        >
                            Próximo
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </CardFooter>
        </Card>
    );
}
