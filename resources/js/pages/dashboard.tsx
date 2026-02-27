import { Head } from "@inertiajs/react";
import PositionSummaryCards from "@/components/dashboard/position-summary-cards";
import RunningEventCard from "@/components/dashboard/running-event-card";
import type { DashboardActivePosition, DashboardPositionStats, DashboardVoterStats } from "@/components/dashboard/types";
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
    electionEvents: ElectionEvent[];
    voters: DashboardVoterStats;
    positions: DashboardPositionStats;
    activePositions: DashboardActivePosition[];
}

export default function Dashboard({ runningEvent, electionEvents, voters, positions, activePositions }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <VoterSummaryCards voters={voters} />
                <PositionSummaryCards positions={positions} activePositions={activePositions} />
                <RunningEventCard runningEvent={runningEvent} electionEvents={electionEvents} />
            </div>
        </AppLayout>
    );
}
