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
import { Activity, BadgeCheck, CirclePlay, LoaderCircle, Square, Zap } from 'lucide-react';
import { Clock, PlayCircle, CheckCircle, XCircle } from "lucide-react"
import { toast } from 'sonner';
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import EventControlToggle from '@/components/EventControlToggle';



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
    const statusIcon = {
        pending: Clock,
        scheduled: Clock,
        running: PlayCircle,
        finished: CheckCircle,
        cancelled: XCircle,
    }

    const Icon = statusIcon[event.status];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Election Event Detail" />
            <div className="flex justify-center p-6">
                <Card className="w-full max-w-4xl shadow-lg rounded-xl border border-gray-200">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Column 1: Event Information */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {event.name}
                                </h2>
                                <div className="space-y-2 text-gray-600">
                                    <div>
                                        <span className="font-medium text-gray-700">Keyword:</span>{" "}
                                        <span className="text-gray-900">{event.keyword}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Description:</span>{" "}
                                        <span className="text-gray-900">
                                            {event.description || "-"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Start Date:</span>{" "}
                                        {event.start_date
                                            ? new Date(event.start_date).toLocaleString("id-ID", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "-"}
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Duration:</span>{" "}
                                        {event.duration} menit
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700">Autorun:</span>{" "}
                                        <span
                                            className={
                                                event.is_autorun
                                                    ? "text-green-600 font-semibold"
                                                    : "text-red-600 font-semibold"
                                            }
                                        >
                                            {event.is_autorun ? "Enabled" : "Disabled"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="font-medium text-gray-700">Status:</span>{" "}
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                            <Icon className="h-4 w-4" />
                                            {event.status}
                                        </span>

                                    </div>

                                </div>
                            </div>

                            {/* Column 2: Control Toggle */}
                            <div className="flex flex-col items-center justify-center gap-6">
                                <EventControlToggle />
                            </div>
                        </div>

                        <div className="flex justify-center mt-8">
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => window.history.back()}
                            >
                                Back
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
