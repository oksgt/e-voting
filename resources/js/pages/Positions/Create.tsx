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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { login } from '@/routes';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Position Create',
        href: route('positions.index'),
    },
];

export default function Create() {

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        status: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route("positions.store"), {
            onSuccess: () => {
                toast.success("Position created successfully!", {
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
                                    <FieldLegend>Form Add Position</FieldLegend>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">
                                            <FieldGroup>
                                                <Field>
                                                    <FieldLabel htmlFor="input-name">Position Name</FieldLabel>
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
                                                    <FieldLabel htmlFor="input-nik">Description</FieldLabel>
                                                    <Input
                                                        id="input-description"
                                                        placeholder="Desctiption"
                                                        value={data.description}
                                                        onChange={(e) => setData('description', e.target.value)}
                                                    />
                                                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                                                </Field>
                                            </FieldGroup>

                                            <FieldGroup>
                                                <Field>
                                                    <FieldLabel htmlFor="status-switch">Status</FieldLabel>
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            id="status-switch"
                                                            checked={data.status === "active"}
                                                            onCheckedChange={(checked) =>
                                                                setData("status", checked ? "active" : "not active")
                                                            }
                                                        />
                                                        <span>{data.status === "active" ? "Active" : "Not Active"}</span>
                                                    </div>
                                                    {errors.status && (
                                                        <p className="text-red-500 text-sm">{errors.status}</p>
                                                    )}
                                                </Field>
                                            </FieldGroup>


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
