import type { ElectionEvent } from "@/types/election_event";

export interface DashboardVoterStats {
	approved: number;
	pending: number;
	rejected: number;
	total: number;
}

export interface DashboardPositionStats {
	active: number;
	inactive: number;
	total: number;
}

export interface DashboardActivePosition {
	id: number;
	name: string;
	description: string | null;
	status: number;
	created_at: string | null;
	updated_at: string | null;
	deleted_at: string | null;
}

export interface DashboardSectionProps {
	voters: DashboardVoterStats;
}

export interface PositionSectionProps {
	positions: DashboardPositionStats;
	activePositions: DashboardActivePosition[];
}

export interface RunningEventCardProps {
	runningEvent: ElectionEvent | null;
	electionEvents: ElectionEvent[];
}
