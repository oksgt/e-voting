import { useEffect, useState } from "react";
import axios from "axios";
import Countdown from "./countdown";

export default function RunningElectionEvent() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get("/api/election-events/running").then((res) => {
            console.log(res.data);
            setEvents(res.data);
        });
    }, []);

    return (
        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
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
                </div>
            ) : (
                <div className="flex flex-col items-center text-center space-y-3">
                    {/* Ikon Apple-style */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>

                    {/* Informasi Event */}
                    <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                        {events.data.name}
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        Dimulai:{" "}
                        {new Intl.DateTimeFormat("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        }).format(new Date(events.data.start_date))}
                    </p>
                    <Countdown duration={events.data.duration} />
                </div>
            )}
        </div>
    );
}
