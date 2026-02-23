import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from "@/components/ui/switch"

type EditProps = {
    user: {
        id: number
        name: string
        description: string
        status: number // tinyint (1 or 0)
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Position Edit',
        href: route('positions.index'),
    },
]

export default function Edit({ user }: EditProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name || '',
        description: user.description || '',
        status: user.status === 1 ? 'active' : 'not active',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        put(route("positions.update", user.id), {
            onSuccess: () => {
                toast.success("Position updated successfully!", {
                    style: { backgroundColor: "green", color: "white" },
                })
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Position" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend>Edit Position</FieldLegend>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">
                                            {/* Position Name */}
                                            <FieldGroup>
                                                <Field>
                                                    <FieldLabel htmlFor="input-name">Position Name</FieldLabel>
                                                    <Input
                                                        id="input-name"
                                                        placeholder="Enter full name"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                    />
                                                    {errors.name && (
                                                        <p className="text-red-500 text-sm">{errors.name}</p>
                                                    )}
                                                </Field>
                                            </FieldGroup>

                                            {/* Description */}
                                            <FieldGroup>
                                                <Field>
                                                    <FieldLabel htmlFor="input-description">Description</FieldLabel>
                                                    <Input
                                                        id="input-description"
                                                        placeholder="Description"
                                                        value={data.description}
                                                        onChange={(e) => setData('description', e.target.value)}
                                                    />
                                                    {errors.description && (
                                                        <p className="text-red-500 text-sm">{errors.description}</p>
                                                    )}
                                                </Field>
                                            </FieldGroup>

                                            {/* Status Switch */}
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

                                {/* Action Buttons */}
                                <Field orientation="horizontal" className="flex justify-between mt-6">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => window.history.back()}
                                    >
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
                                                "Update"
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
