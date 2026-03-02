import { AlertTriangleIcon, Calendar, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import ToggleBerkenan from "./ToggleBerkenan";

export function TopTwoPerPosition({ eventId }: { eventId: number }) {
    const [positions, setPositions] = useState<any[]>([]);
    const [analisa, setAnalisa] = useState<any[]>([]);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const formatTimestamp = (date: Date) => {
        return new Intl.DateTimeFormat("id-ID", {
            dateStyle: "full",
            timeStyle: "medium",
        }).format(date);
    };

    const fetchData = () => {
        setLoading(true);
        fetch(`/api/top-2-per-position/${eventId}/`)
            .then((res) => res.json())
            .then((data) => {
                setPositions(data.positions);
                setAnalisa(data.Analisa);
                setLastUpdated(formatTimestamp(new Date()));
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        // fetch pertama kali
        fetchData();

        // interval setiap 5 menit (300000 ms)
        const interval = setInterval(() => {
            fetchData();
        }, 300000);

        // cleanup saat komponen unmount
        return () => clearInterval(interval);
    }, [eventId]);

    const ucwords = (str: string) => {
        return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <Card className="w-full flex flex-col">
            <CardHeader className="flex items-center justify-between pb-0">
                <div className="flex flex-col">
                    <CardTitle>Hasil penjaringan per posisi</CardTitle>
                    <CardDescription className="mt-2 flex">
                        <Calendar className="mr-2 h-4 w-4" />
                        Data per: {lastUpdated || "Memuat..."}
                    </CardDescription>
                </div>
                <button
                    onClick={fetchData}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Reload data"
                >
                    <RefreshCw className={`h-5 w-5 text-blue-600 transition-transform ${loading ? "animate-spin" : ""}`} />
                </button>
            </CardHeader>
            <CardContent>
                {analisa?.length > 0 && (
                    <Alert className="w-full border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 mb-4">
                        <AlertTriangleIcon />
                        <AlertTitle>Analisa Data</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5 space-y-1">
                                {analisa.map((item, index) => (
                                    <li key={index}>{item.issue.description}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {positions.map((pos: { position: string; candidates: any[] }) => (
                        <Item variant="outline" size="sm" className="w-full" key={pos.position}>
                            <ItemContent className="flex flex-col h-full">
                                <div className="mb-2">
                                    <ItemTitle className="text-gray-900 text-base font-semibold m-0">
                                        Posisi: <strong>{pos.position}</strong>
                                    </ItemTitle>
                                </div>

                                <div className="text-gray-700 font-small">
                                    {/* <table className="table-auto w-full border-collapse border border-gray-300 text-gray-700 text-sm p-0"> */}
                                    <table className="table-auto w-full border-collapse border border-gray-300 text-gray-700 text-sm">
                                        <thead>
                                            <tr className="font-semibold bg-gray-100">
                                                <th className="border border-gray-300 px-2 py-1 text-left">No</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left">Nama</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pos.candidates.map(
                                                (c: { id: number; name: string; persentase: number; total_votes: number }, index: number) => (
                                                    <tr key={c.id} className={`hover:bg-blue-100 ${index < 2 ? "bg-blue-50 font-semibold" : ""}`}>
                                                        <td className="border border-gray-300 px-2 py-1">{index + 1}</td>

                                                        {/* Kolom Nama + Persentase + Total Votes */}
                                                        <td className="border border-gray-300 px-2 py-1">
                                                            <div className="flex flex-col leading-tight">
                                                                <span className="font-semibold text-gray-900">{ucwords(c.nama)}</span>
                                                                <span className="text-xs text-gray-600">
                                                                    {c.persentase} % / {c.total_votes} pemilih
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* Kolom Aksi */}
                                                        <td className="border border-gray-300 px-2 py-1">
                                                            <ToggleBerkenan data={c} />
                                                        </td>
                                                    </tr>
                                                ),
                                            )}

                                            {/* Row akumulasi */}
                                            <tr className="font-semibold bg-gray-100">
                                                <td className="border border-gray-300 px-2 py-1">Total</td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                    <div className="flex flex-col leading-tight">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {Math.round(
                                                                pos.candidates.reduce(
                                                                    (acc: number, c: { persentase: number }) => acc + c.persentase,
                                                                    0,
                                                                ),
                                                            )}
                                                            %
                                                        </span>
                                                        <span className="text-xs text-gray-600">
                                                            {pos.candidates.reduce(
                                                                (acc: number, c: { total_votes: number }) => acc + c.total_votes,
                                                                0,
                                                            )}{" "}
                                                            pemilih
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </ItemContent>
                        </Item>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
