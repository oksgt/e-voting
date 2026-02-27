import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type DateTime24PickerProps = {
    id: string;
    value: string;
    onChange: (value: string) => void;
};

const splitDateTime = (value: string) => {
    if (!value || !value.includes("T")) {
        return {
            datePart: "",
            timePart: "00:00",
            isEndOfDay: false,
        };
    }

    const [datePart, rawTimePart] = value.split("T");
    const timePart = (rawTimePart || "00:00").slice(0, 5);

    if (timePart === "24:00") {
        return {
            datePart,
            timePart: "00:00",
            isEndOfDay: true,
        };
    }

    return {
        datePart,
        timePart,
        isEndOfDay: false,
    };
};

export const toIsoDateTime24 = (value: string) => {
    if (!value) return "";

    const endOfDayMatch = value.match(/^(\d{4}-\d{2}-\d{2})T24:00$/);
    if (endOfDayMatch) {
        const date = new Date(`${endOfDayMatch[1]}T00:00:00`);

        if (Number.isNaN(date.getTime())) return value;

        date.setDate(date.getDate() + 1);
        return date.toISOString();
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toISOString();
};

export default function DateTime24Picker({ id, value, onChange }: DateTime24PickerProps) {
    const { datePart, timePart, isEndOfDay } = splitDateTime(value);
    const [hourPart = "00", minutePart = "00"] = timePart.split(":");
    const selectedHour = isEndOfDay ? "24" : hourPart;
    const selectedMinute = isEndOfDay ? "00" : minutePart;

    const hourOptions = Array.from({ length: 25 }, (_, index) => String(index).padStart(2, "0"));
    const minuteOptions = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));

    const updateValue = (nextDate: string, nextTime: string, nextIsEndOfDay: boolean) => {
        if (!nextDate) {
            onChange("");
            return;
        }

        onChange(`${nextDate}T${nextIsEndOfDay ? "24:00" : nextTime}`);
    };

    return (
        <div className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
                <Input
                    id={`${id}-date`}
                    type="date"
                    value={datePart}
                    onChange={(event) => updateValue(event.target.value, timePart, isEndOfDay)}
                />
                <div className="grid grid-cols-2 gap-2">
                    <Select
                        value={selectedHour}
                        onValueChange={(hour) => {
                            if (hour === "24") {
                                updateValue(datePart, "00:00", true);
                                return;
                            }

                            updateValue(datePart, `${hour}:${selectedMinute}`, false);
                        }}
                    >
                        <SelectTrigger id={`${id}-hour`}>
                            <SelectValue placeholder="Jam" />
                        </SelectTrigger>
                        <SelectContent>
                            {hourOptions.map((hour) => (
                                <SelectItem key={`hour-${hour}`} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedMinute}
                        disabled={isEndOfDay}
                        onValueChange={(minute) => updateValue(datePart, `${selectedHour === "24" ? "00" : selectedHour}:${minute}`, false)}
                    >
                        <SelectTrigger id={`${id}-minute`}>
                            <SelectValue placeholder="Menit" />
                        </SelectTrigger>
                        <SelectContent>
                            {minuteOptions.map((minute) => (
                                <SelectItem key={`minute-${minute}`} value={minute}>
                                    {minute}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
                <Switch
                    size="sm"
                    checked={isEndOfDay}
                    onCheckedChange={(checked) => updateValue(datePart, timePart, checked === true)}
                />
                Gunakan 24:00 (akhir hari)
            </div>
        </div>
    );
}
