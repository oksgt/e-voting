import { FormTahap1 } from '@/components/FormTahap1';
import { NavUser } from '@/components/nav-user';
import RunningElectionEvent from '@/components/RunningElectionEvent';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Voter',
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
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <RunningElectionEvent />
                    </div>
                    <div className="relative  overflow-hidden ">
                        <FormTahap1 event={runningEvent} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
