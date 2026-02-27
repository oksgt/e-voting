import type { ElectionEvent } from "@/types/election_event";

export interface DashboardVoterStats {
	approved: number;
	pending: number;
	rejected: number;
	total: number;
}

export interface DashboardSectionProps {
	voters: DashboardVoterStats;
}

export interface RunningEventCardProps {
	runningEvent: ElectionEvent | null;
}
