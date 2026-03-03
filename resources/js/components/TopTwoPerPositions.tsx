import { AlertTriangleIcon, Calendar, FileDown, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { ucwords, useTopTwoPerPosition } from "@/hooks/use-top-two-per-position";
import type { PositionResult } from "@/types/top-two-per-position";
import ToggleBerkenan from "./ToggleBerkenan";
import { Button } from "./ui/button";

function PositionCard({ pos }: { pos: PositionResult }) {
    const totalPersentase = Math.round(pos.candidates.reduce((acc, c) => acc + c.persentase, 0));
    const totalVotes = pos.candidates.reduce((acc, c) => acc + c.total_votes, 0);

    return (
        <Item variant="outline" size="sm" className="w-full">
            <ItemContent className="flex flex-col h-full">
                <div className="mb-2">
                    <ItemTitle className="text-gray-900 text-base font-semibold m-0">
                        Posisi: <strong>{pos.position}</strong>
                    </ItemTitle>
                </div>

                <div className="overflow-x-auto -mx-2">
                    <table className="w-full min-w-0 border-collapse border border-gray-300 text-gray-700 text-sm">
                        <thead>
                            <tr className="font-semibold bg-gray-100">
                                <th className="border border-gray-300 px-1.5 py-1 text-left w-8">No</th>
                                <th className="border border-gray-300 px-1.5 py-1 text-left">Nama</th>
                                <th className="border border-gray-300 px-1.5 py-1 text-left w-auto">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pos.candidates.map((c, index) => (
                                <tr key={c.id} className={`hover:bg-blue-100 ${index < 2 ? "bg-blue-50 font-semibold" : ""}`}>
                                    <td className="border border-gray-300 px-1.5 py-1 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 px-1.5 py-1">
                                        <div className="flex flex-col leading-tight min-w-0">
                                            <span className="font-semibold text-gray-900 break-words">{ucwords(c.nama)}</span>
                                            <span className="text-xs text-gray-600 whitespace-nowrap">
                                                {c.persentase}% / {c.total_votes} pemilih
                                            </span>
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 px-1.5 py-1">
                                        <ToggleBerkenan data={c} />
                                    </td>
                                </tr>
                            ))}

                            <tr className="font-semibold bg-gray-100">
                                <td className="border border-gray-300 px-1.5 py-1 text-center" colSpan={1}>
                                    &nbsp;
                                </td>
                                <td className="border border-gray-300 px-1.5 py-1">
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-sm font-semibold text-gray-900">{totalPersentase}%</span>
                                        <span className="text-xs text-gray-600">{totalVotes} pemilih</span>
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-1.5 py-1"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </ItemContent>
        </Item>
    );
}

export function TopTwoPerPosition({ eventId }: { eventId: number }) {
    const { positions, analisa, lastUpdated, loading, refresh, exportPdf } = useTopTwoPerPosition(eventId);

    return (
        <Card className="w-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between gap-2 pb-0">
                <div className="flex flex-col min-w-0 shrink">
                    <CardTitle className="text-sm sm:text-base">Hasil penjaringan per posisi</CardTitle>
                    <CardDescription className="mt-2 flex items-center text-xs sm:text-sm">
                        <Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">Data per: {lastUpdated || "Memuat..."}</span>
                    </CardDescription>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <Button
                        onClick={exportPdf}
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        aria-label="Export PDF"
                        disabled={positions.length === 0}
                    >
                        <FileDown className="h-4 w-4 text-red-600" />
                    </Button>
                    <Button
                        onClick={refresh}
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        aria-label="Reload data"
                    >
                        <RefreshCw className={`h-4 w-4 text-blue-600 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
                {analisa.length > 0 && (
                    <Alert className="w-full border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 mb-4">
                        <AlertTriangleIcon />
                        <AlertTitle>Analisa Data</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                                {analisa.map((item) => (
                                    <li key={item.candidate_id}>{item.issue.description}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {positions.map((pos) => (
                        <PositionCard key={pos.id} pos={pos} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
