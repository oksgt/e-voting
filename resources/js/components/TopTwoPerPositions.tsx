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
import ToggleBerkenan from "./ToggleBerkenan"

export function TopTwoPerPosition({ eventId }: { eventId: number }) {
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
        fetch(`/api/top-2-per-position/${eventId}/`)
            .then((res) => res.json())
            .then((data) => {
                setPositions(data)
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
                    <RefreshCw
                        className={`h-5 w-5 text-blue-600 transition-transform ${loading ? "animate-spin" : ""
                            }`}
                    />
                </button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {positions.map((pos: { position: string; candidates: any[] }) => (
                    <Item
                        variant="outline"
                        size="sm"
                        className="w-full"
                        key={pos.position}
                    >
                        <ItemContent>
                            <ItemTitle className="text-gray-900 text-lg">
                                Posisi: <strong>{pos.position}</strong>
                            </ItemTitle>

                            <div className="text-gray-700 font-medium">
                                <div className="text-gray-700 font-medium">
                                    <table className="table-auto w-full border-collapse border border-gray-300 text-gray-700 font-medium">
                                        <thead>
                                            <tr>
                                                <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Nama</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Persentase</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Jumlah Pemilih</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pos.candidates.map(
                                                (c: { id: number; name: string; persentase: number }, index: number) => (
                                                    <tr key={c.id}>
                                                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                                        <td className="border border-gray-300 px-4 py-2">{ucwords(c.name)}</td>
                                                        <td className="border border-gray-300 px-4 py-2">{c.persentase}%</td>
                                                        <td className="border border-gray-300 px-4 py-2">{c.total_votes} pemilih</td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            <ToggleBerkenan data={c} />
                                                        </td>
                                                    </tr>
                                                )
                                            )}

                                            {/* Row akumulasi */}
                                            <tr className="font-semibold bg-gray-100">
                                                <td className="border border-gray-300 px-4 py-2" colSpan={2}>
                                                    Total
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {Math.round(
                                                        pos.candidates.reduce(
                                                            (acc: number, c: { persentase: number }) => acc + c.persentase,
                                                            0
                                                        )
                                                    )}%
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {pos.candidates.reduce( (acc: number, c: { persentase: number }) => acc + c.total_votes, 0 )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </ItemContent>
                    </Item>
                ))}
            </CardContent>
        </Card>
    )
}
