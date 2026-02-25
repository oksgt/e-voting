import { Clock, Hourglass } from "lucide-react";
import { useEffect, useState } from "react";

export default function Countdown({ duration }: { duration: number }) {
    const [timeLeft, setTimeLeft] = useState(duration * 60); // konversi menit ke detik

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Format ke jam:menit:detik
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <h2 className="flex items-center space-x-2 text-lg font-semibold text-green-600 dark:text-green-400">
            <Hourglass className="h-6 w-6" />
            <span>{formatTime(timeLeft)}</span>
        </h2>
    );
}
