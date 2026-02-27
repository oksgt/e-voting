import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Card, CardContent } from "@/components/ui/card";
import { VoterForm } from "@/components/voters/VoterForm";
import { useVoterForm } from "@/hooks/useVoterForm";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem, User } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Voter", href: route("voters.index") },
    { title: "Edit Voter", href: route("voters.index") },
];

interface EditProps {
    user: User;
    roles: string[];
    userRoles: string[];
}

export default function Edit({ user, roles, userRoles }: EditProps) {
    const { form, loginMethod, onSubmit, handleCheckboxChange, handleToggleGroup } = useVoterForm(user, userRoles);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Voter" />
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
                            legend="Form Edit Voter"
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
