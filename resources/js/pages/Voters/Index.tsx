import { Head } from "@inertiajs/react";
import StatCards from "@/components/voters/StatCards";
import VoterTable from "@/components/voters/VoterTable";
import { useVoterPage } from "@/hooks/use-voter-page";
import AppLayout from "@/layouts/app-layout";
import { breadcrumbs } from "@/lib/constants";
import type { VoterComponentProps } from "@/types/voter";

const VoterComponent = ({ users, authUserId, filters, csrfToken, statusCounts }: VoterComponentProps) => {
    const {
        sorting,
        onSortingChange,
        pagination,
        onPaginationChange,
        searchQuery,
        activeStatus,
        handleSearchChange,
        handleStatusFilter,
    } = useVoterPage({ users, filters });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Voter" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <StatCards statusCounts={statusCounts} activeStatus={activeStatus} onStatusFilter={handleStatusFilter} />
                <VoterTable
                    users={users}
                    authUserId={authUserId}
                    csrfToken={csrfToken}
                    statusCounts={statusCounts}
                    activeStatus={activeStatus}
                    onStatusFilterClear={() => handleStatusFilter(null)}
                    sorting={sorting}
                    onSortingChange={onSortingChange}
                    pagination={pagination}
                    onPaginationChange={onPaginationChange}
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                />
            </div>
        </AppLayout>
    );
};

export default VoterComponent;
