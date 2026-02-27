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

export interface DashboardSectionProps {
	voters: DashboardVoterStats;
}

export interface PositionSectionProps {
	positions: DashboardPositionStats;
}

export interface RunningEventCardProps {
	runningEvent: ElectionEvent | null;
}
