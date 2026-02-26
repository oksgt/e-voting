import { useEffect, useState } from "react";
import axios from "axios";
import Countdown from "./countdown";
import { Calendar, ListCheck, ListChecks, RefreshCw } from "lucide-react";
import { FormTahap1 } from "./FormTahap1";
import { TopTwoPerPosition } from "./TopTwoPerPositions";
import { TopTwoPerPositionVoter } from "./TopTwoPerPositionsVoter";

export default function RunningElectionEvent() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get("/api/election-events/running").then((res) => {
            console.log('data', res.data);
            setEvents(res.data);
        });
    }, []);

    const handleRefresh = () => {
        window.location.reload(); // reload current tab
    };

    const dateFormatter = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });


    return (
        <>
            <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                {events.length === 0 ? (
                    <div className="flex flex-col items-center text-center space-y-3">
                        {/* Ikon berwarna dengan gaya Apple */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>

                        <p className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                            Tidak ada event yang sedang berlangsung
                        </p>

                        {/* Link Refresh dengan Lucide Icon */}
                        <button
                            onClick={handleRefresh}
                            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 font-medium text-sm"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span>Refresh</span>
                        </button>
                    </div>

                ) : (
                    <div className="flex flex-col items-center text-center space-y-3">
                        {/* Ikon Apple-style */}
                        <ListChecks className="h-14 w-14 text-green-500" />

                        {/* Informasi Event */}
                        <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6 space-y-3">
                            {/* Judul Event */}
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                                {events.data.name}
                            </h2>

                            {/* Waktu Mulai */}
                            <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 text-sm">
                                <span className="font-medium">Mulai:</span>
                                <span>{dateFormatter.format(new Date(events.data.started_at))}</span>
                            </div>

                            {/* Waktu Selesai */}
                            <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 text-sm">
                                <span className="font-medium">Selesai:</span>
                                <span>{dateFormatter.format(new Date(events.data.finished_at))}</span>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {events?.data?.id === 3 && (
                <div className="overflow-hidden mt-4">
                    <FormTahap1 event={events.data} />
                </div>
            )}

            {events?.data?.id === 4 && (
                <div className="overflow-hidden mt-4">
                    <TopTwoPerPositionVoter eventId={3} />
                </div>
            )}

        </>
    );
}
