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
    return (
        <div className="flex items-center justify-center gap-0">
            {steps.map((s, i) => (
                <Fragment key={s.number}>
                    <div className="flex flex-col items-center gap-1.5">
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
                                "text-xs font-medium whitespace-nowrap",
                                currentStep >= s.number ? "text-foreground" : "text-muted-foreground",
                            )}
                        >
                            {s.label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <Separator
                            className={cn("mb-6 w-12 shrink-0", currentStep > s.number ? "bg-primary" : "bg-muted-foreground/30")}
                        />
                    )}
                </Fragment>
            ))}
        </div>
    );
}
