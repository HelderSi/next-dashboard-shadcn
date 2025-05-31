"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Spinner } from "@/components/icons";
import { addCustomer, cpfAlreadyExists, editCustomer } from "./actions";
import { CustomerModel, StatusEnum, DocTypeEnum } from "@/models/Customer";
import { uploadFile } from "@/lib/storage";
import { formatCPF, formatPhone, validateCPF } from "@/lib/utils";
import { InputWithError } from "@/components/ui/input-with-error";
import { Avatar, AvatarImage } from "@/components/ui/avatar";


type FormErrorsType = {
    doc: string;
    email: string
}


export function CustomerForm({
    customer,
    onClose,
}: {
    readonly customer?: CustomerModel;
    readonly onClose: () => void;
}) {
    // Manage all form fields in a single state object.
    const [formValues, setFormValues] = useState({
        name: customer?.name ?? "",
        doc: customer?.doc ?? "",
        contact_phone: customer?.contact.phone ?? "",
        contact_email: customer?.contact.email ?? "",
        imageUrl: customer?.imageUrl ?? "",
        status: customer?.status ?? StatusEnum.active,
        docType: customer?.docType ?? DocTypeEnum.CPF,
    });

    const [formErrors, setFormErrors] = useState<Partial<FormErrorsType>>({});


    const handleErrorChange = (errors: Partial<FormErrorsType>) => {
        setFormErrors((prev) => ({
            ...prev,
            ...errors
        }));
    };

    const hasErrors = () => Object.values(formErrors).some((error) => !!error);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name } = e.target;
        let { value } = e.target;

        if (name === 'doc') {
            // Remove all non-digit characters and limit to 11 digits
            const rawValue = value.replace(/\D/g, '').substring(0, 11);
            const formattedValue = formatCPF(rawValue);

            value = formattedValue;
            // Validate the raw CPF value
            const isValid = validateCPF(rawValue);
            handleErrorChange({
                doc: isValid ? '' : 'CPF inválido'
            });

            if (isValid) {
                cpfAlreadyExists(rawValue)
                    .then(({ exists }) => {
                        if (exists) {
                            handleErrorChange({
                                doc: 'CPF já cadastrado'
                            });
                        }
                    })
            }
        }

        if (name === 'contact_phone') {
            // Remove all non-digit characters and limit to 11 digits
            const rawValue = value.replace(/\D/g, '').substring(0, 11);
            const formattedValue = formatPhone(rawValue);

            value = formattedValue;
        }
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [, formAction, isPending] = useActionState(
        async (_prevState: any, formData: FormData) => {
            const toastId = toast.loading(
                `${customer ? "Atualizando" : "Adicionando"} customer...`
            );

            // Validate form fields
            if (hasErrors()) {
                toast.error("Corrija os erros antes de enviar o formulário.", { id: toastId });
                return;
            }
            // Set all fields from formValues into the FormData
            Object.entries(formValues).forEach(([key, value]) => {
                if (key === 'doc') {
                    // Remove all non-digit characters from CPF
                    value = value.replace(/\D/g, '').substring(0, 11);
                }
                if (key === 'contact_phone') {
                    // Remove all non-digit characters from phone   
                    value = value.replace(/\D/g, '').substring(0, 11);
                }
                formData.set(key, value);
            });

            if (formData.get("imageUrl_file")) {
                const avatarImageUrl = await uploadAvatarImgFile(formData, "imageUrl_file");
                if (avatarImageUrl) {
                    formData.set("imageUrl", avatarImageUrl);
                    formData.delete("imageUrl_file");
                }
            }

            const actionFn = customer ? editCustomer : addCustomer;
            const result = await actionFn(formData);

            if (result.success) {
                toast.success(
                    `${customer ? "Atualizado" : "Adicionado"} com sucesso!`,
                    { id: toastId }
                );
                onClose();
            } else {
                toast.error(result.error ?? "Um erro ocorreu.", { id: toastId });
            }

            return result;
        },
        { error: "" }
    );

    // Função para fazer upload do arquivo e retornar a URL
    const uploadAvatarImgFile = async (
        formData: FormData,
        fileFieldKey: string
    ): Promise<string | undefined> => {
        const doc = formData.get("doc")?.toString();
        if (!doc) return;

        const file = formData.get(fileFieldKey) as File;

        if (!file || file.size === 0) return;

        const { url, message } = await uploadFile(file, `uploads/customers/${doc}`, "avatar");
        if (!url) toast.error(message ? `${file.name} não enviado: ${message}` : `${file.name} não enviado: Erro ao enviar arquivo.`, {
            duration: 5000,
        })
        return url;
    };

    return (
        <form
            action={formAction}
            className="w-full max-w-4xl mx-auto flex flex-col h-[80vh]"
        >
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {/* ID oculto */}
                <input type="hidden" name="id" value={customer?.id ?? ""} />

                {/* Imagem (URL) */}
                <div>
                    <Input
                        id="imageUrl"
                        name="imageUrl"
                        defaultValue={customer?.imageUrl ?? ""}
                        className="hidden"
                        disabled={isPending}
                    />
                    <Avatar className="w-16 h-16 rounded-md">
                        {customer?.imageUrl ? (
                            <AvatarImage src={customer?.imageUrl} alt={"foto do volunário"} className="object-cover" />
                        ) : (
                            <AvatarImage src={'/user-placeholder-man.jpg'} alt={"foto do volunário"} className="object-cover bg-zinc-300 w-full h-full rounded-md" />
                        )}
                    </Avatar>
                    <Label htmlFor={`imageUrl_file`} className="mt-4">Foto</Label>
                    <Input
                        type="file"
                        id={`imageUrl_file`}
                        name={`imageUrl_file`}
                        className="mt-1"
                        data-no-submit
                        disabled={isPending}
                        accept="image/*"
                    />
                </div>

                {/* Nome */}
                <div>
                    <Label htmlFor="name" className="mt-2">Nome</Label>
                    <Input
                        id="name"
                        name="name"
                        defaultValue={customer?.name ?? ""}
                        required
                        className="mt-1"
                        disabled={isPending}
                        value={formValues.name}
                        onChange={handleChange}
                    />
                </div>

                {/* Status */}
                <div>
                    <Input
                        id="status"
                        name="status"
                        defaultValue={customer?.status ?? StatusEnum.active}
                        className="hidden"
                    />
                </div>

                {/* Documento */}
                <div>
                    <Label htmlFor="doc">CPF</Label>
                    <InputWithError
                        id="doc"
                        name="doc"
                        defaultValue={customer?.doc ?? ""}
                        required
                        className="mt-1"
                        disabled={isPending}
                        value={formValues.doc}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        error={formErrors.doc}
                    />
                </div>

                {/* Tipo de Documento */}
                <div>
                    <Input
                        id="docType"
                        name="docType"
                        defaultValue={DocTypeEnum.CPF}
                        className="hidden"
                    />
                </div>


                {/* Contato */}
                <fieldset className="border p-4 rounded">
                    <legend className="px-2 border rounded">Contato</legend>
                    <div className="mt-1">
                        <Label htmlFor="contact_phone">Telefone</Label>
                        <Input
                            id="contact_phone"
                            name="contact_phone"
                            defaultValue={customer?.contact.phone ?? ""}
                            className="mt-1"
                            disabled={isPending}
                            value={formValues.contact_phone}
                            onChange={handleChange}
                            placeholder="(00) 0 0000-0000"

                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="contact_email">Email</Label>
                        <Input
                            id="contact_email"
                            name="contact_email"
                            type="email"
                            defaultValue={customer?.contact?.email ?? ""}
                            className="mt-1"
                            disabled={isPending}
                            value={formValues.contact_email}
                            onChange={handleChange}
                        />
                    </div>
                </fieldset>
            </div>


            {/* Botões de ação fixos no rodapé com espaçamentos */}
            <div className="px-2 pt-4 border-t flex gap-4 justify-end">
                <Button type="submit" disabled={isPending || hasErrors()}>
                    {isPending ? <Spinner className="mr-2" /> : null}
                    {customer ? "Atualizar" : "Salvar"}
                </Button>
                <Button
                    variant="outline"
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
}
