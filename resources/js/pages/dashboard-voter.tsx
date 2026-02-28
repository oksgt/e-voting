import { Head } from "@inertiajs/react";
import { NavUser } from "@/components/nav-user";
import RunningElectionEvent from "@/components/RunningElectionEvent";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import type { BreadcrumbItem } from "@/types";
import { RefreshCw } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard Voter",
        href: dashboard().url,
    },
];

export default function Dashboard({ user, roles, runningEvent, userStatus }: any) {

    const handleRefresh = () => {
        window.location.reload(); // reload current tab
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Voter" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <NavUser />
                    </div>
                    <div className="relative overflow-hidden rounded-xl dark:border-sidebar-border">
                        {userStatus === "approved" ? (
                            <RunningElectionEvent />
                        ) : (
                            <div className="flex flex-col items-center text-center space-y-3 mt-10 mb-10">
                                {/* Ikon berwarna dengan gaya Apple */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v2m0 4h.01M12 5a7 7 0 100 14a7 7 0 000-14z"
                                    />
                                </svg>

                                <p className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                                    Akun Anda belum disetujui oleh admin
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
                        )}

                    </div>
                </div>
            </div>
        </AppLayout >
    );
}
