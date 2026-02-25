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
import { Textarea } from "@/components/ui/textarea"
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { finished } from 'stream';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Events',
        href: route('events.index'),
    },
];

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        keyword: '',
        description: '',
        started_at: '',
        finished_at: '',
        duration: '',
        is_autorun: false,
        status: 'pending',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route("events.store"), {
            onSuccess: () => {
                toast.success("Election Event created successfully!", {
                    style: { backgroundColor: "green", color: "white" },
                })
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Election Event Create" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend>Form Add Election Event</FieldLegend>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">

                                            {/* Event Name */}
                                            <Field>
                                                <FieldLabel htmlFor="input-name">Event Name</FieldLabel>
                                                <Input
                                                    id="input-name"
                                                    placeholder="Enter event name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                />
                                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                            </Field>

                                            {/* Keyword */}
                                            <Field>
                                                <FieldLabel htmlFor="input-keyword">Keyword</FieldLabel>
                                                <Input
                                                    id="input-keyword"
                                                    placeholder="Enter keyword"
                                                    value={data.keyword}
                                                    onChange={(e) => setData('keyword', e.target.value)}
                                                />
                                                {errors.keyword && <p className="text-red-500 text-sm">{errors.keyword}</p>}
                                            </Field>

                                            {/* Description */}
                                            <Field>
                                                <FieldLabel htmlFor="input-description">Description</FieldLabel>
                                                <Textarea
                                                    id="input-description"
                                                    placeholder="Description"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                />
                                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                                            </Field>

                                            {/* Start Date */}
                                            <Field>
                                                <FieldLabel htmlFor="input-start-date">Start Date</FieldLabel>
                                                <Input
                                                    type="datetime-local"
                                                    id="input-start-date"
                                                    value={data.started_at}
                                                    onChange={(e) => setData('started_at', e.target.value)}
                                                />
                                                {errors.started_at && <p className="text-red-500 text-sm">{errors.started_at}</p>}
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="input-finish-date">Finish Date</FieldLabel>
                                                <Input
                                                    type="datetime-local"
                                                    id="input-finish-date"
                                                    value={data.finished_at}
                                                    onChange={(e) => setData('finished_at', e.target.value)}
                                                />
                                                {errors.finished_at && <p className="text-red-500 text-sm">{errors.finished_at}</p>}
                                            </Field>


                                        </div>
                                    </div>
                                </FieldSet>

                                {/* Action Buttons */}
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
