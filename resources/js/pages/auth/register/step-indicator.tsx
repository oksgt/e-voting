import { Check } from "lucide-react";
import { Fragment } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Step {
    number: number;
    label: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    const currentStepData = steps.find((s) => s.number === currentStep);

    return (
        <>
            {/* Mobile: hanya tampilkan step aktif */}
            <div className="grid grid-cols-3 items-center justify-center gap-0 sm:hidden">
                <Separator className="my-0 w-4 shrink-0 bg-muted-foreground/30" />
                <div className="flex flex-col items-center gap-1.5 sm:hidden">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary text-sm font-semibold text-primary-foreground">
                        {currentStepData?.number}
                    </div>
                    <span className="text-xs font-medium text-foreground">{currentStepData?.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                        Langkah {currentStep} dari {steps.length}
                    </span>
                </div>
                <Separator className="my-0 w-4 shrink-0 bg-muted-foreground/30" />
            </div>

            {/* Desktop: tampilkan semua step */}
            <div className="hidden items-center justify-center gap-0 sm:flex">
                {steps.map((s, i) => (
                    <Fragment key={s.number}>
                        <div className="flex shrink-0 flex-col items-center gap-1.5">
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                                    currentStep >= s.number
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-muted-foreground/30 text-muted-foreground",
                                )}
                            >
                                {currentStep > s.number ? <Check className="h-4 w-4" /> : s.number}
                            </div>
                            <span
                                className={cn(
                                    "text-center text-xs font-medium leading-tight",
                                    currentStep >= s.number ? "text-foreground" : "text-muted-foreground",
                                )}
                            >
                                {s.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <Separator
                                className={cn(
                                    "mb-6 w-12 shrink-0",
                                    currentStep > s.number ? "bg-primary" : "bg-muted-foreground/30",
                                )}
                            />
                        )}
                    </Fragment>
                ))}
            </div>
        </>
    );
}
