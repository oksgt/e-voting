import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import { PositionForm } from "@/components/positions/PositionForm";
import { Card, CardContent } from "@/components/ui/card";
import { usePositionForm } from "@/hooks/usePositionForm";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import type { Position } from "@/types/position";

type EditProps = {
    position: Position;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Position",
        href: route("positions.index"),
    },
    {
        title: "Edit Position",
        href: route("positions.index"),
    },
];

export default function Edit({ position }: EditProps) {
    const { form, onSubmit } = usePositionForm(position);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Position" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <PositionForm form={form} onSubmit={onSubmit} legend="Form Edit Position" submitLabel="Update" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
