import type { BaseFilter, Pagination, User } from ".";

export interface VoterRequest extends BaseFilter {
	status?: string;
}

export interface VoterStatusCounts {
	total: number;
	pending: number;
	approved: number;
	rejected: number;
}

export interface VoterComponentProps {
	users: Pagination<User>;
	authUserId: number;
	filters: VoterRequest;
	csrfToken: string;
	statusCounts: VoterStatusCounts;
}
