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

    console.log(event)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Election Event Edit" />
            <div className="flex flex-col justify-center p-4">
                <Card className="w-full mb-4">
                    <CardHeader>
                        <CardTitle>Summary Event: {event.name}</CardTitle>
                        <CardDescription>Rekapitulasi data pemilihan tahap penjaringan bakal calon</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Kolom kiri: Chart */}
                            <div className="flex w-full flex-col">
                                <ChartPenjaringan event_id={event.id} />
                            </div>

                            {/* Kolom kanan: Top 2 penjaringan */}
                            <div className="flex w-full flex-col">
                                <TopTwoPerPosition eventId={event.id} />
                                {/* Tambahkan Item lain sesuai kebutuhan */}
                            </div>
                        </div>
                    </CardContent>
                </Card>



            </div>
        </AppLayout>
    );
}
