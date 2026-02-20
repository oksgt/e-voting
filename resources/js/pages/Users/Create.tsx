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
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import RolesGroup from '@/components/RolesGroup';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Create',
        href: route('users.index'),
    },
];

export default function Create({ roles }) {
    const [showPassword, setShowPassword] = useState(false)
    const [showRePassword, setShowRePassword] = useState(false)

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: []
    });

    const handleCheckboxChange = (role: string, checked: boolean) => {
        setData('roles', checked
            ? [...data.roles, role]
            : data.roles.filter((r) => r !== role)
        );
    };

    const toggleGroup = (roles: string[], selectAll: boolean) => {
        const current = Array.isArray(data.roles) ? data.roles : [];
        const filtered = current.filter((r) => !roles.includes(r));
        setData('roles', selectAll ? [...filtered, ...roles] : filtered);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route("users.store"), {
            onSuccess: () => {
                toast.success("User created successfully!", {
                    style: { backgroundColor: "green", color: "white" },
                })
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User" />
            <div className="flex justify-center p-4">
                <Card className="w-full ">
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend>Form Add New User</FieldLegend>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">
                                            <FieldGroup>
                                                <Field>
                                                    <FieldLabel htmlFor="input-name">Name</FieldLabel>
                                                    <Input
                                                        id="input-name"
                                                        placeholder="Enter full name"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                    />
                                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                                </Field>
                                            </FieldGroup>

                                            <FieldGroup>
                                                <Field>
                                                    <FieldLabel htmlFor="input-email">Email</FieldLabel>
                                                    <Input
                                                        id="input-email"
                                                        placeholder="Enter email"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                    />
                                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                                </Field>
                                            </FieldGroup>

                                            <FieldGroup>
                                                <Field>
                                                    <FieldLabel htmlFor="input-password">Password</FieldLabel>
                                                    <div className="relative">
                                                        <Input
                                                            id="input-password"
                                                            placeholder="Enter password"
                                                            type={showPassword ? "text" : "password"}
                                                            value={data.password}
                                                            onChange={(e) => setData('password', e.target.value)}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                                </Field>
                                            </FieldGroup>

                                            <FieldGroup>
                                                <Field>
                                                    <FieldLabel htmlFor="input-re-password">Retype Password</FieldLabel>
                                                    <div className="relative">
                                                        <Input
                                                            id="input-re-password"
                                                            placeholder="Enter password"
                                                            type={showRePassword ? "text" : "password"}
                                                            value={data.password_confirmation}
                                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                                            onClick={() => setShowRePassword(!showRePassword)}
                                                        >
                                                            {showRePassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </Field>
                                            </FieldGroup>
                                        </div>

                                        <div className="w-full md:w-1/2 space-y-4">
                                            <Field>
                                                <FieldLabel>Roles</FieldLabel>
                                                <div className="relative">
                                                    <RolesGroup
                                                        roles={roles}
                                                        selectedRoles={data.roles}
                                                        onToggleGroup={toggleGroup}
                                                        onCheckboxChange={handleCheckboxChange}
                                                    />
                                                </div>
                                                {errors.roles && <p className="text-red-500 text-sm">{errors.roles}</p>}
                                            </Field>
                                        </div>
                                    </div>
                                </FieldSet>

                                <Field orientation="horizontal" className="flex justify-between mt-6">
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
