import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from 'react';
import { CheckSquare, Eye, EyeOff, LoaderCircle, Square } from 'lucide-react';
import { toast } from 'sonner';
import PermissionGroup from '@/components/PermissionGroup';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Create',
        href: route('roles.index'),
    },
];

export default function Create({ groupedPermissions }) {

    // Inertia form state
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const handleCheckboxChange = (permission: string, checked: boolean) => {
        setData('permissions', checked
            ? [...data.permissions, permission]
            : data.permissions.filter((p) => p !== permission)
        );
    };

    const toggleGroup = (perms: string[], selectAll: boolean) => {
        const current = Array.isArray(data.permissions) ? data.permissions : [];
        const filtered = current.filter((p) => !perms.includes(p));
        setData('permissions', selectAll ? [...filtered, ...perms] : filtered);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("roles.store"), {
            onSuccess: () => {
                toast.success("Role created successfully!", {
                    style: { backgroundColor: "green", color: "white" },
                });
            },
            onError: (errors) => {
                toast.error("Something went wrong while creating the role.", {
                    style: { backgroundColor: "red", color: "white" },
                });
                console.error(errors); // optional: log errors for debugging
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend>Form Add New Role</FieldLegend>

                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="input-role-name">Role Name</FieldLabel>
                                            <Input
                                                id="input-role-name"
                                                placeholder="Enter role name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                            />
                                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                        </Field>
                                    </FieldGroup>

                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="input-permission">Available Permissions</FieldLabel>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                                {Object.entries(groupedPermissions).map(([group, perms]) => (
                                                    <PermissionGroup
                                                        key={group}
                                                        group={group}
                                                        perms={perms}
                                                        selectedPermissions={data.permissions}
                                                        onToggleGroup={toggleGroup}
                                                        onCheckboxChange={handleCheckboxChange}
                                                    />

                                                ))}
                                            </div>
                                            {errors.permissions && <p className="text-red-500 text-sm">{errors.permissions}</p>}
                                        </Field>
                                    </FieldGroup>

                                </FieldSet>

                                <Field orientation="horizontal" className="flex justify-between">
                                    <Button variant="secondary" type="button" onClick={() => window.history.back()}>
                                        Back
                                    </Button>

                                    <div className="flex gap-2">
                                        <Button variant="outline" type="reset" onClick={() => reset()}>
                                            Reset
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? (
                                                <span className="flex items-center gap-2">
                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : (
                                                "Save"
                                            )}
                                        </Button>
                                    </div>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
