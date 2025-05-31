'use client';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserModel } from "@/models/User";
import { ChevronsUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";

const allColumns = ["name", "role"];

export function UsersTable({
    users,
}: {
    users: UserModel[];
    search: string;
    offset: number;
    totalUsers: number;
}) {
    const [search, ] = useState<string>("");
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, ] = useState<number>(1);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns);
    const rowsPerPage = 5;

    const toggleSelect = (id: number) => {
        const newSelected = new Set(selected);
        if(newSelected.has(id))
            newSelected.delete(id)
        else
            newSelected.add(id)
        setSelected(newSelected);
    };

    const toggleSelectAll = () => {
        setSelected(selected.size === users.length ? new Set() : new Set(users.map(v => v.id)));
    };

    const handleSort = (column: keyof UserModel) => {
        const newDirection: "asc" | "desc" = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
        setSortColumn(column);
        setSortDirection(newDirection);
        // setUsers([...users].sort((a, b) => {
        //     if (a[column] < b[column]) return newDirection === "asc" ? -1 : 1;
        //     if (a[column] > b[column]) return newDirection === "asc" ? 1 : -1;
        //     return 0;
        // }));
    };

    const filteredUsers = users.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.role.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div>
            <div className="flex justify-between mb-4">
                <Input
                    placeholder="Search..."
                    value={search}
                    // onChange={(e) => setSearch(e.target.value)}
                    className="w-1/3"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Select Columns</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {allColumns.map((col) => (
                            <DropdownMenuItem key={col} onClick={() => {
                                setVisibleColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
                            }}>
                                <Checkbox checked={visibleColumns.includes(col)} /> {col}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <p className="text-gray-600 mb-2">Total Rows: {filteredUsers.length}</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Checkbox
                                checked={selected.size === users.length}
                                onCheckedChange={toggleSelectAll}
                            />
                        </TableHead>
                        {visibleColumns.includes("name") && (
                            <TableHead onClick={() => handleSort("name")} className="cursor-pointer">Name <ChevronsUpDown className="w-4 h-4 inline" /></TableHead>
                        )}
                        {visibleColumns.includes("role") && (
                            <TableHead onClick={() => handleSort("role")} className="cursor-pointer">Role <ChevronsUpDown className="w-4 h-4 inline" /></TableHead>
                        )}
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <Checkbox
                                    checked={selected.has(user.id)}
                                    onCheckedChange={() => toggleSelect(user.id)}
                                />
                            </TableCell>
                            {visibleColumns.includes("name") && <TableCell>{user.name}</TableCell>}
                            {visibleColumns.includes("role") && <TableCell>{user.role}</TableCell>}
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost"><MoreHorizontal className="w-4 h-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}