import { Head } from "@inertiajs/react";
import { NavUser } from "@/components/nav-user";
import RunningElectionEvent from "@/components/RunningElectionEvent";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import type { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard Voter",
        href: dashboard().url,
    },
];

export default function Dashboard({ user, roles, runningEvent }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Voter" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <NavUser />
                    </div>
                    <div className="relative overflow-hidden rounded-xl dark:border-sidebar-border">
                        <RunningElectionEvent />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
