import { CheckCircle2, IdCard, Loader2, XCircle } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";
import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PhoneValidationStatus = "idle" | "validating" | "valid" | "invalid" | "error";

interface StepDataPribadiProps {
    visible: boolean;
    nikInputRef: RefObject<HTMLInputElement | null>;
    nowaInputRef: RefObject<HTMLInputElement | null>;
    phoneValidationStatus: PhoneValidationStatus;
    phoneValidationMessage: string;
    onNikInput: (value: string) => void;
    onNowaChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onNowaInput: (value: string) => void;
    errors: Record<string, string>;
}

function PhoneValidationIcon({ status }: { status: PhoneValidationStatus }) {
    switch (status) {
        case "validating":
            return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
        case "valid":
            return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        case "invalid":
        case "error":
            return <XCircle className="h-4 w-4 text-red-600" />;
        default:
            return null;
    }
}

export function StepDataPribadi({
    visible,
    nikInputRef,
    nowaInputRef,
    phoneValidationStatus,
    phoneValidationMessage,
    onNikInput,
    onNowaChange,
    onNowaInput,
    errors,
}: StepDataPribadiProps) {
    return (
        <div className={cn("grid gap-6", !visible && "hidden")}>
            <div className="grid gap-2">
                <Label htmlFor="nik">NIK</Label>
                <div className="relative">
                    <IdCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        ref={nikInputRef}
                        id="nik"
                        type="text"
                        required
                        autoComplete="off"
                        name="nik"
                        placeholder="16 digit NIK"
                        maxLength={16}
                        inputMode="numeric"
                        className="pl-9"
                        onInput={(e) => onNikInput((e.target as HTMLInputElement).value)}
                    />
                </div>
                <p className="text-xs text-muted-foreground">NIK harus 16 digit angka dan unik.</p>
                <InputError message={errors.nik} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="phone_number">Nomor Whatsapp</Label>
                <div className="relative">
                    <Input
                        ref={nowaInputRef}
                        id="phone_number"
                        type="tel"
                        required
                        autoComplete="tel"
                        name="phone_number"
                        placeholder="Contoh: 628123456789"
                        onChange={(e) => {
                            onNowaInput(e.target.value);
                            onNowaChange(e);
                        }}
                        onInput={(e) => onNowaInput((e.target as HTMLInputElement).value)}
                        className="pr-10"
                    />
                    {phoneValidationStatus !== "idle" && (
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <PhoneValidationIcon status={phoneValidationStatus} />
                        </div>
                    )}
                </div>
                {phoneValidationMessage && (
                    <p
                        className={`text-xs ${
                            phoneValidationStatus === "valid"
                                ? "text-green-600"
                                : phoneValidationStatus === "validating"
                                    ? "text-blue-600"
                                    : "text-red-600"
                        }`}
                    >
                        {phoneValidationMessage}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">Gunakan format internasional yang aktif di WhatsApp.</p>
                <InputError message={errors.phone_number} />
            </div>
        </div>
    );
}
