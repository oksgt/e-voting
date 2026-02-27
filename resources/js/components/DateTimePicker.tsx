import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

type DateTimePickerProps = {
    id: string
    label: string
    value?: string // datetime string (e.g. "2026-02-27T10:30:00")
    onChange: (val: string) => void
    error?: string
}

export function DateTimePicker({ id, label, value, onChange, error }: DateTimePickerProps) {
    const [open, setOpen] = React.useState(false)
    const initialDate = value ? new Date(value) : undefined
    const [date, setDate] = React.useState<Date | undefined>(initialDate)
    const [time, setTime] = React.useState(
        initialDate ? initialDate.toTimeString().slice(0, 8) : "10:30:00"
    )

    console.log('label', label);
    console.log('value', value);

    React.useEffect(() => {
        if (date && time) {
            const [hours, minutes, seconds] = time.split(":");
            const newDate = new Date(date);
            newDate.setHours(Number(hours), Number(minutes), Number(seconds));

            // Format ke "YYYY-MM-DD HH:MM:SS"
            const pad = (n: number) => n.toString().padStart(2, "0");
            const formatted =
                newDate.getFullYear() + "-" +
                pad(newDate.getMonth() + 1) + "-" +
                pad(newDate.getDate()) + " " +
                pad(newDate.getHours()) + ":" +
                pad(newDate.getMinutes()) + ":" +
                pad(newDate.getSeconds());

            onChange(formatted);
        }
    }, [date, time]);

    return (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <div className="flex gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id={id}
                            className="w-40 justify-between font-normal"
                        >
                            {date ? format(date, "PPP") : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            defaultMonth={date}
                            onSelect={(d) => {
                                setDate(d)
                                setOpen(false)
                            }}
                        />
                    </PopoverContent>
                </Popover>
                <Input
                    type="time"
                    step="1"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-32 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </Field>
    )
}
