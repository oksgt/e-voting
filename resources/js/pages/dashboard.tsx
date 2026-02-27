import { Head } from "@inertiajs/react";
import RunningEventCard from "@/components/dashboard/running-event-card";
import type { DashboardVoterStats } from "@/components/dashboard/types";
import VoterStatusDistribution from "@/components/dashboard/voter-status-distribution";
import VoterSummaryCards from "@/components/dashboard/voter-summary-cards";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import type { BreadcrumbItem } from "@/types";
import type { ElectionEvent } from "@/types/election_event";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: dashboard().url,
    },
];

interface DashboardProps {
    runningEvent: ElectionEvent | null;
    voters: DashboardVoterStats;
}

export default function Dashboard({ runningEvent, voters }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <VoterSummaryCards voters={voters} />

                <div className="grid gap-4 lg:grid-cols-3">
                    <VoterStatusDistribution voters={voters} />
                    <RunningEventCard runningEvent={runningEvent} />
                </div>
            </div>
        </AppLayout>
    );
}
