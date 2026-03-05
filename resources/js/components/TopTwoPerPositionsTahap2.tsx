import { useEffect, useState } from "react"
import { Calendar, RefreshCw, Users2Icon } from "lucide-react"
import {
    Item,
    ItemMedia,
    ItemContent,
    ItemTitle,
    ItemDescription,
} from "@/components/ui/item"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"

export function TopTwoPerPositionTahap2({ eventId }: { eventId: number }) {
    const [positions, setPositions] = useState<any[]>([])
    const [lastUpdated, setLastUpdated] = useState<string>("")
    const [loading, setLoading] = useState(false)

    const formatTimestamp = (date: Date) => {
        return new Intl.DateTimeFormat("id-ID", {
            dateStyle: "full",
            timeStyle: "medium",
        }).format(date)
    }

    const fetchData = () => {
        setLoading(true)
        fetch(`/api/ranking-tahap-2/${eventId}`)
            .then((res) => res.json())
            .then((data) => {
                setPositions(data.positions)
                setLastUpdated(formatTimestamp(new Date()))
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        // fetch pertama kali
        fetchData()

        // interval setiap 5 menit (300000 ms)
        const interval = setInterval(() => {
            fetchData()
        }, 300000)

        // cleanup saat komponen unmount
        return () => clearInterval(interval)
    }, [eventId])

    const ucwords = (str: string) => {
        return str
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())
    }

    return (
        <Card className="w-full flex flex-col">
            <CardHeader className="flex items-center justify-between pb-0">
                <div className="flex flex-col ">
                    <CardTitle>Hasil Perolehan Suara Per Posisi</CardTitle>
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
                    <RefreshCw
                        className={`h-5 w-5 text-blue-600 transition-transform ${loading ? "animate-spin" : ""
                            }`}
                    />
                </button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {positions.length === 0 && !loading ? (
                    <p className="text-gray-500">Belum ada data</p>
                ) : (
                    positions.map((pos) => (
                        <Item
                            key={pos.id}
                            className="rounded-2xl border border-gray-100 bg-white shadow-md p-5 transition hover:shadow-lg"
                        >
                            <ItemMedia>
                                <Users2Icon className="h-6 w-6 text-blue-500" />
                            </ItemMedia>

                            <ItemContent>
                                <ItemTitle className="text-lg font-semibold text-gray-900 tracking-tight">
                                    {ucwords(pos.position)}
                                </ItemTitle>

                                <ItemDescription className="mt-4 space-y-3">
                                    {pos.candidates.slice(0, 2).map((c) => {
                                        const highestVotes = Math.max(...pos.candidates.map((x) => x.total_votes));
                                        const isTop = c.total_votes === highestVotes;

                                        return (
                                            <div
                                                key={c.id}
                                                className={`flex justify-between items-center text-sm rounded-md px-2 py-1 ${isTop
                                                        ? "bg-blue-50 text-blue-600 font-semibold"
                                                        : "text-gray-700"
                                                    }`}
                                            >
                                                <span>{ucwords(c.nama)}</span>
                                                <span className="text-gray-600">
                                                    {c.total_votes} suara ({c.persentase.toFixed(2)}%)
                                                </span>
                                            </div>
                                        );
                                    })}
                                </ItemDescription>

                                <div className="mt-4 text-xs text-gray-500">
                                    Total suara: {pos.total_votes}
                                </div>
                            </ItemContent>
                        </Item>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
