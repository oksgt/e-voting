import { Head, Link, useForm } from "@inertiajs/react";
import { Edit2, LoaderCircle, Users2Icon } from "lucide-react";
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
import { ChartPenjaringanTahap2 } from "@/components/ChartPenjaringanTahap2";
import { TopTwoPerPositionTahap2 } from "@/components/TopTwoPerPositionsTahap2";

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

    console.log('ss', event)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Election Event Edit" />
            <div className="flex flex-col justify-center p-4">
                <Card className="w-full mb-4">
                    <CardHeader className="flex items-center justify-between pb-0">
                        <div className="flex flex-col">
                            <CardTitle>Summary Event: {event.name}</CardTitle>
                            <CardDescription>Rekapitulasi data pemilihan tahap penjaringan bakal calon</CardDescription>
                        </div>
                        <Link href={route('events.edit', event.id)} className="inline-flex items-center px-4 py-2 bg-gray-950 text-white rounded">
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit data events
                        </Link>

                    </CardHeader>
                    <CardContent>
                        {event.id === 3 ? (
                            <div className="w-full grid grid-cols-1 gap-6">
                                {/* First row: ChartPenjaringan */}
                                <div className="flex w-full flex-col">
                                    <ChartPenjaringan event_id={event.id} />
                                </div>

                                {/* Second row: TopTwoPerPosition */}
                                <div className="flex w-full flex-col">
                                    <TopTwoPerPosition eventId={event.id} />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full grid grid-cols-1 md:grid-cols-2  gap-6">
                                {/* 30% */}
                                <div className="flex w-full flex-col">
                                    <ChartPenjaringanTahap2 event_id={event.id} />
                                </div>

                                {/* 70% */}
                                <div className="flex w-full flex-col">
                                    <TopTwoPerPositionTahap2 eventId={event.id} />
                                </div>
                            </div>
                        )}

                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
