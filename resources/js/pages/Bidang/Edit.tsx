import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import { BidangForm } from "@/components/bidang/BidangForm";
import { Card, CardContent } from "@/components/ui/card";
import { useBidangForm } from "@/hooks/useBidangForm";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import type { Bidang } from "@/types/bidang";

type EditProps = {
    bidang: Bidang;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Bidang",
        href: route("bidang.index"),
    },
    {
        title: "Edit Bidang",
        href: route("bidang.index"),
    },
];

export default function Edit({ bidang }: EditProps) {
    const { form, onSubmit } = useBidangForm(bidang);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Bidang" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <BidangForm form={form} onSubmit={onSubmit} legend="Form Edit Bidang" submitLabel="Update" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
