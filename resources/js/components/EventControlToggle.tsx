import { useState } from "react"
import { CirclePlay, Square } from "lucide-react"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function EventControlToggle() {
    const [isRunning, setIsRunning] = useState(false)
    const [open, setOpen] = useState(false)

    const handleConfirm = () => {
        setIsRunning(!isRunning)
        setOpen(false)
        // di sini nanti bisa tambahkan action Play/Stop ke backend
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <button
                        onClick={() => setOpen(true)}
                        className={
                            "rounded-full p-6 backdrop-blur-md transition-all duration-300 shadow-lg " +
                            (isRunning
                                ? "bg-red-500/70 hover:bg-red-600/80 text-white shadow-red-200"
                                : "bg-green-500/70 hover:bg-green-600/80 text-white shadow-green-200")
                        }
                    >
                        {isRunning ? (
                            <Square className="h-6 w-6" />
                        ) : (
                            <CirclePlay className="h-6 w-6" />
                        )}
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isRunning ? "Stop Event?" : "Play Event?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isRunning
                                ? "Apakah kamu yakin ingin menghentikan event ini?"
                                : "Apakah kamu yakin ingin memulai event ini?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>
                            {isRunning ? "Stop" : "Play"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <span
                className={
                    "text-sm font-medium transition-colors duration-300 " +
                    (isRunning ? "text-red-600" : "text-green-600")
                }
            >
                {isRunning ? "Stop Event" : "Play Event"}
            </span>
        </div>
    )
}
