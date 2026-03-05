import { Head, Link } from "@inertiajs/react";
import { Edit2 } from "lucide-react";
import { route } from "ziggy-js";
import { ChartPenjaringan } from "@/components/ChartPenjaringan";
import { ChartPenjaringanTahap2 } from "@/components/ChartPenjaringanTahap2";
import { TopTwoPerPosition } from "@/components/TopTwoPerPositions";
import { TopTwoPerPositionTahap2 } from "@/components/TopTwoPerPositionsTahap2";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";

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

// const toDatetimeLocal = (value: string | null | undefined) => {
//     if (!value) return "";

//     const date = new Date(value);
//     if (Number.isNaN(date.getTime())) return "";

//     const pad = (num: number) => String(num).padStart(2, "0");

//     const year = date.getFullYear();
//     const month = pad(date.getMonth() + 1);
//     const day = pad(date.getDate());
//     const hour = pad(date.getHours());
//     const minute = pad(date.getMinutes());

//     return `${year}-${month}-${day}T${hour}:${minute}`;
// };

export default function Edit({ event }: EditEventProps) {
    console.log("ss", event);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Election Event Edit" />
            <div className="flex flex-col justify-center p-4">
                <Card className="w-full mb-4">
                    <CardHeader className="flex items-center justify-between pb-0">
                        <div className="flex flex-col">
                            <CardTitle>Summary Event: {event.name}</CardTitle>
                            <CardDescription className="mt-2">Rekapitulasi data pemilihan </CardDescription>
                        </div>
                        <Link
                            href={route("events.edit", event.id)}
                            className="inline-flex items-center px-4 py-2 bg-gray-950 text-white rounded"
                        >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit data events
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {event.id === 3 ? (
                            <div className="w-full grid grid-cols-1 gap-6">
                                {/* First row: ChartPenjaringan */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                    <ChartPenjaringan event_id={event.id} />
                                    <ChartPenjaringan event_id={event.id} value_type="number" />
                                </div>

                                {/* Second row: TopTwoPerPosition */}
                                <div className="flex w-full flex-col">
                                    <TopTwoPerPosition eventId={event.id} />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                                {/* 30% */}
                                <div className="flex w-full flex-col">
                                    <ChartPenjaringan event_id={event.id} />
                                </div>

                                <div className="flex w-full flex-col">
                                    <ChartPenjaringan event_id={event.id} value_type={'number'} />
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
