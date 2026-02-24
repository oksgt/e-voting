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

type EditEventProps = {
  event: {
    id: number
    name: string
    keyword: string | null
    description: string | null
    start_date: string // biasanya format ISO datetime
    duration: number   // integer (menit)
    is_autorun: boolean
    status: "pending" | "scheduled" | "running" | "finished" | "cancelled"
    is_running: boolean // tinyint(1) → boolean
    started_at?: string | null
    finished_at?: string | null
  }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Events',
        href: route('events.index'),
    },
];

export default function Edit({ event }: EditEventProps) {
    console.log(event);
    const { data, setData, put, processing, errors, reset } = useForm({
        name: event.name || '',
        keyword: event.keyword || '',
        description: event.description || '',
        start_date: event.start_date || '',
        duration: event.duration || '',
        is_autorun: event.is_autorun || false,
        status: event.status || 'pending',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        put(route("events.update", event.id), {
            onSuccess: () => {
                toast.success("Election Event updated successfully!", {
                    style: { backgroundColor: "green", color: "white" },
                })
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Election Event Edit" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend>Edit Election Event</FieldLegend>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">

                                            {/* Event Name */}
                                            <Field>
                                                <FieldLabel htmlFor="input-name">Event Name</FieldLabel>
                                                <Input
                                                    id="input-name"
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
                                                    value={data.start_date}
                                                    onChange={(e) => setData('start_date', e.target.value)}
                                                />
                                                {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
                                            </Field>

                                            {/* Duration */}
                                            <Field>
                                                <FieldLabel htmlFor="input-duration">Duration (minutes)</FieldLabel>
                                                <Input
                                                    type="number"
                                                    id="input-duration"
                                                    value={data.duration}
                                                    onChange={(e) => setData('duration', e.target.value)}
                                                />
                                                {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
                                            </Field>

                                            {/* Autorun Switch */}
                                            <Field>
                                                <FieldLabel htmlFor="autorun-switch">Autorun</FieldLabel>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        id="autorun-switch"
                                                        checked={data.is_autorun}
                                                        onCheckedChange={(checked) => setData("is_autorun", checked)}
                                                    />
                                                    <span>{data.is_autorun ? "Enabled" : "Disabled"}</span>
                                                </div>
                                            </Field>

                                            {/* Status Select */}
                                            <Field>
                                                <FieldLabel htmlFor="status-select">Status</FieldLabel>
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(value) => setData("status", value)}
                                                >
                                                    <SelectTrigger id="status-select">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                                        <SelectItem value="running">Running</SelectItem>
                                                        <SelectItem value="finished">Finished</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
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
                                        <Button type="submit" disabled={processing}>
                                            {processing ? (
                                                <span className="flex items-center gap-2">
                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : (
                                                "Save Changes"
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
