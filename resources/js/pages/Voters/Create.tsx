import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Card, CardContent } from "@/components/ui/card";
import { VoterForm } from "@/components/voters/VoterForm";
import { useVoterForm } from "@/hooks/useVoterForm";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Voter", href: route("voters.index") },
    { title: "Tambah Voter", href: route("voters.create") },
];

export default function Create({ roles }: { roles: string[] }) {
    const { form, loginMethod, onSubmit, handleCheckboxChange, handleToggleGroup } = useVoterForm();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Voter" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <VoterForm
                            form={form}
                            loginMethod={loginMethod}
                            roles={roles}
                            onSubmit={onSubmit}
                            onCheckboxChange={handleCheckboxChange}
                            onToggleGroup={handleToggleGroup}
                            legend="Form Tambah Voter"
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
