import { router } from "@inertiajs/react";
import { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { route } from "ziggy-js";
import { useTableControls } from "@/hooks/use-table-controls";
import type { Pagination, User } from "@/types";
import type { VoterRequest } from "@/types/voter";

interface UseVoterPageOptions {
	users: Pagination<User>;
	filters: VoterRequest;
}

export function useVoterPage({ users, filters }: UseVoterPageOptions) {
	const { sorting, onSortingChange, pagination, onPaginationChange, searchQuery, setSearchQuery } = useTableControls({
		baseUri: "voters.index",
		filters,
		currentPage: users.meta.current_page,
		perPage: users.meta.per_page,
	});

	const activeStatus = filters?.status ?? null;

	const handleSearchChange = useDebouncedCallback((value: string) => {
		const params: Record<string, string | number> = { ...filters, page: 1 };
		if (value.trim()) {
			params.search = value.trim();
		} else {
			setSearchQuery(value);
			delete params.search;
		}
		router.get(route("voters.index"), params, {
			preserveState: true,
			preserveScroll: true,
			replace: true,
		});
	}, 500);

	const handleStatusFilter = useCallback(
		(status: string | null) => {
			const params: Record<string, string | number> = {
				...filters,
				page: 1,
			};
			if (status) {
				params.status = status;
			} else {
				delete params.status;
			}
			if (searchQuery.trim()) {
				params.search = searchQuery.trim();
			} else {
				delete params.search;
			}
			router.get(route("voters.index"), params, {
				preserveState: true,
				preserveScroll: true,
				replace: true,
			});
		},
		[filters, searchQuery],
	);

	return {
		sorting,
		onSortingChange,
		pagination,
		onPaginationChange,
		searchQuery,
		activeStatus,
		handleSearchChange,
		handleStatusFilter,
	};
}
