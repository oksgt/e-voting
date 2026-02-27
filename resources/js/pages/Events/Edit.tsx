import { Head, useForm } from "@inertiajs/react";
import { LoaderCircle, Users2Icon } from "lucide-react";
import { toast } from "sonner";
import { route } from "ziggy-js";

import DateTime24Picker, { toIsoDateTime24 } from "@/components/commons/date-time-24-picker";
import { DateTimePicker } from "@/components/DateTimePicker";
import { ChartPenjaringan, Chartpenjaringan } from "@/components/ChartPenjaringan";
import { TopTwoPerPosition } from "@/components/TopTwoPerPositions";

import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";

type EditEventProps = {
    event: {
        id: number;
        name: string;
        keyword: string | null;
        description: string | null;
        started_at: string; // biasanya format ISO datetime
        finished_at: string; // biasanya format ISO datetime
        duration: number; // integer (menit)
        is_autorun: boolean;
        status: "pending" | "scheduled" | "running" | "finished" | "cancelled";
        is_running: boolean; // tinyint(1) → boolean
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Events",
        href: route("events.index"),
    },
];

const toDatetimeLocal = (value: string | null | undefined) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const pad = (num: number) => String(num).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hour}:${minute}`;
};

export default function Edit({ event }: EditEventProps) {
    const { data, setData, put, processing, errors, transform } = useForm({
        name: event.name || "",
        keyword: event.keyword || "",
        description: event.description || "",
        started_at: toDatetimeLocal(event.started_at) || "",
        finished_at: toDatetimeLocal(event.finished_at) || "",
        duration: event.duration || "",
        is_autorun: event.is_autorun || false,
        status: event.status || "pending",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            started_at: toIsoDateTime24(formData.started_at),
            finished_at: toIsoDateTime24(formData.finished_at),
        }));

        put(route("events.update", event.id), {
            onFinish: () => transform((formData) => formData),
            onSuccess: () => {
                toast.success("Election Event updated successfully!", {
                    style: { backgroundColor: "green", color: "white" },
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Election Event Edit" />
            <div className="flex flex-col justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend className='font-bold'>Edit Election Event</FieldLegend>
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
                                            <DateTimePicker
                                                id="input-start-date"
                                                label="Start Date"
                                                value={toDatetimeLocal(data.started_at)}
                                                onChange={(val) => setData("started_at", val)}
                                                error={errors.started_at}
                                            />

                                            <DateTimePicker
                                                id="input-finish-date"
                                                label="Finish Date"
                                                value={toDatetimeLocal(data.finished_at)}
                                                onChange={(val) => setData("finished_at", val)}
                                                error={errors.finished_at}
                                            />

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
                                                        <SelectItem value="pending">Stop</SelectItem>
                                                        <SelectItem value="running">Running</SelectItem>
                                                        <SelectItem value="finished">Finished</SelectItem>
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
    );
}
