import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { deleteCustomer } from "./actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/modal";
import { CustomerForm } from "./customer-form";
import { Spinner } from "@/components/icons";
import { CustomerModel } from "@/models/Customer";
import { formatCPF } from "@/lib/utils";


export function Customer({ data, selected, onSelectedChange }: {
    readonly data: CustomerModel;
    readonly selected: boolean;
    readonly onSelectedChange: () => void;
}) {
    const [editing, setEditing] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const toastId = toast.loading("Deleting customer...");
            try {
                await deleteCustomer(data.id);
                toast.success("Customer deletado!", { id: toastId });
            } catch (error) {
                console.error(error);
                toast.error("Erro ao deletar", { id: toastId });
            } finally {
                setConfirmingDelete(false);
            }
        });
    };

    return (
        <>
            <TableRow>
                <TableCell className="hidden sm:table-cell" onClick={onSelectedChange}>
                    <Checkbox checked={selected} onCheckedChange={onSelectedChange} />
                </TableCell>
                <TableCell className="font-medium">{data.name}</TableCell>
                <TableCell className="hidden md:table-cell">{formatCPF(data.doc)}</TableCell>
                <TableCell className="hidden md:table-cell">
                    {new Date(data.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setEditing(true)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setConfirmingDelete(true)}>Deletar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            {/* Edit Modal */}
            <Modal open={editing} onClose={() => setEditing(false)} title="Editar Customer">
                <CustomerForm customer={data} onClose={() => setEditing(false)} />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal open={confirmingDelete} onClose={() => setConfirmingDelete(false)} title="Confirmar Deletar">
                <p>Confirmar a deleção de <strong>{data.name}</strong>?</p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setConfirmingDelete(false)} disabled={isPending}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                        {isPending ? <Spinner className="mr-2" /> : null}
                        Deletar
                    </Button>
                </div>
            </Modal>
        </>
    );
}
