export interface TopCandidate {
	id: number;
	nama: string;
	total_votes: number;
	persentase: number;
	filled_rejections: number;
	null_rejections: number;
	position_id: number;
	position_name: string;
	event_id: number;
	rank: number;
}

export interface PositionResult {
	id: number;
	position: string;
	total_votes: number;
	candidates: TopCandidate[];
}

export interface AnalysisIssue {
	candidate_id: number;
	candidate_name: string;
	issue: {
		type: string;
		description: string;
	};
	positions: {
		position_id: number;
		position_name: string;
		rank: number;
		total_votes: number;
		persentase: number;
	}[];
}

export interface TopTwoPerPositionResponse {
	positions: PositionResult[];
	Analisa: AnalysisIssue[];
}
