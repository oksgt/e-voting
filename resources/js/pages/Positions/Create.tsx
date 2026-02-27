import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import { PositionForm } from "@/components/positions/PositionForm";
import { Card, CardContent } from "@/components/ui/card";
import { usePositionForm } from "@/hooks/usePositionForm";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Position",
        href: route("positions.index"),
    },
    {
        title: "Tambah Position",
        href: route("positions.create"),
    },
];

export default function Create() {
    const { form, onSubmit } = usePositionForm();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Position" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <PositionForm form={form} onSubmit={onSubmit} legend="Form Tambah Position" submitLabel="Save" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
