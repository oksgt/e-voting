import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import { AnggotaKoperasiForm } from "@/components/anggota-koperasi/AnggotaKoperasiForm";
import { Card, CardContent } from "@/components/ui/card";
import { useAnggotaKoperasiForm } from "@/hooks/useAnggotaKoperasiForm";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";

type CreateProps = {
    bidangList: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Anggota Koperasi",
        href: route("anggota-koperasi.index"),
    },
    {
        title: "Tambah Anggota",
        href: route("anggota-koperasi.create"),
    },
];

export default function Create({ bidangList }: CreateProps) {
    const { form, onSubmit } = useAnggotaKoperasiForm();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Anggota Koperasi" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <AnggotaKoperasiForm form={form} onSubmit={onSubmit} legend="Form Tambah Anggota Koperasi" submitLabel="Simpan" bidangList={bidangList} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
