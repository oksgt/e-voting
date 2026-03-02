import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import { BidangForm } from "@/components/bidang/BidangForm";
import { Card, CardContent } from "@/components/ui/card";
import { useBidangForm } from "@/hooks/useBidangForm";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Bidang",
        href: route("bidang.index"),
    },
    {
        title: "Tambah Bidang",
        href: route("bidang.create"),
    },
];

export default function Create() {
    const { form, onSubmit } = useBidangForm();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Bidang" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <BidangForm form={form} onSubmit={onSubmit} legend="Form Tambah Bidang" submitLabel="Simpan" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
