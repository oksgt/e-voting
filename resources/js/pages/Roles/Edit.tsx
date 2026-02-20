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
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import PermissionGroup from '@/components/PermissionGroup';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Edit',
        href: route('roles.index'),
    },
];

export default function Edit({ role, groupedPermissions, selectedPermissions }) {
    // Inertia form state, prefilled with role data
    const { data, setData, put, processing, errors, reset } = useForm({
        name: role.name || '',
        permissions: selectedPermissions || [] as string[],
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
        put(route("roles.update", role.id), {
            onSuccess: () => {
                toast.success("Role updated successfully!", {
                    style: { backgroundColor: "green", color: "white" },
                });
            },
            onError: (errors) => {
                toast.error("Something went wrong while updating the role.", {
                    style: { backgroundColor: "red", color: "white" },
                });
                console.error(errors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Role" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend>Edit Role</FieldLegend>

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

                                    {/* <div className="flex gap-2">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? (
                                                <span className="flex items-center gap-2">
                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : (
                                                "Save changes"
                                            )}
                                        </Button>
                                    </div> */}
                                    <div className="flex gap-2">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button type="button" disabled={processing}>
                                                    {processing ? (
                                                        <span className="flex items-center gap-2">
                                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                                            Processing...
                                                        </span>
                                                    ) : (
                                                        "Save changes"
                                                    )}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        You are about to save changes to this role.
                                                        Please make sure your modifications are correct before proceeding.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleSubmit}
                                                        className="bg-green-600 text-white hover:bg-green-700"
                                                        disabled={processing}
                                                    >
                                                        {processing ? (
                                                            <span className="flex items-center gap-2">
                                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                                                Processing...
                                                            </span>
                                                        ) : (
                                                            "Yes, Save Changes"
                                                        )}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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
