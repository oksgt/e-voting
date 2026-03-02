import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import { AnggotaKoperasiForm } from "@/components/anggota-koperasi/AnggotaKoperasiForm";
import { Card, CardContent } from "@/components/ui/card";
import { useAnggotaKoperasiForm } from "@/hooks/useAnggotaKoperasiForm";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import type { AnggotaKoperasi } from "@/types/anggota-koperasi";

type EditProps = {
    anggota: AnggotaKoperasi;
    bidangList: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Anggota Koperasi",
        href: route("anggota-koperasi.index"),
    },
    {
        title: "Edit Anggota",
        href: route("anggota-koperasi.index"),
    },
];

export default function Edit({ anggota, bidangList }: EditProps) {
    const { form, onSubmit } = useAnggotaKoperasiForm(anggota);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Anggota Koperasi" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <AnggotaKoperasiForm form={form} onSubmit={onSubmit} legend="Form Edit Anggota Koperasi" submitLabel="Update" bidangList={bidangList} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
