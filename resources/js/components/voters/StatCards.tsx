import { STAT_CARD_CONFIGS } from "@/components/voters/constants";
import type { VoterStatusCounts } from "@/types/voter";

interface StatCardsProps {
    statusCounts: VoterStatusCounts;
    activeStatus: string | null;
    onStatusFilter: (status: string | null) => void;
}

export default function StatCards({ statusCounts, activeStatus, onStatusFilter }: StatCardsProps) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STAT_CARD_CONFIGS.map((card) => {
                const isActive = activeStatus === card.key;
                const Icon = card.icon;
                const value = statusCounts[card.countKey];

                return (
                    <button
                        key={String(card.key)}
                        type="button"
                        onClick={() => onStatusFilter(card.key)}
                        className={`rounded-xl border-2 p-4 text-left transition-all duration-150 hover:shadow-md focus:outline-none ${card.bg} ${isActive ? card.activeBorder + " shadow-md" : card.border + " hover:border-opacity-60"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className={`text-2xl font-bold ${card.color}`}>{value}</span>
                            <div className={`rounded-full p-2 ${card.bg}`}>
                                <Icon className={`h-5 w-5 ${card.color}`} />
                            </div>
                        </div>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">{card.label}</p>
                        {isActive && (
                            <span
                                className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${card.color} bg-white/70 dark:bg-black/20`}
                            >
                                Filtered
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
