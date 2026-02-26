import { useEffect, useState } from "react"
import { RefreshCw, Users2Icon } from "lucide-react"
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
        fetch(`/api/top-2-per-position/${eventId}`)
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
                    <CardTitle>Top 2 penjaringan per posisi</CardTitle>
                    <CardDescription>
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
                {positions.map((pos: any) => (
                    <Item
                        variant="outline"
                        size="sm"
                        className="w-full"
                        key={pos.position}
                    >
                        <ItemMedia variant="icon">
                            <Users2Icon />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle className="text-gray-900 text-lg">
                                {pos.position}
                            </ItemTitle>
                            <ItemDescription>
                                <ol className="list-decimal list-inside space-y-2 text-gray-700 font-medium">
                                    {pos.candidates.map((c: any) => (
                                        <li key={c.id}>
                                            {ucwords(c.name)} ({c.persentase}%)
                                        </li>
                                    ))}
                                </ol>
                            </ItemDescription>
                        </ItemContent>
                    </Item>
                ))}
            </CardContent>
        </Card>
    )
}
