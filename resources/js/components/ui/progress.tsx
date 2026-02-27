import * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Progress({ className, value, showPing = false, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root> & { showPing?: boolean }) {
    const safeValue = Math.max(0, Math.min(100, value ?? 0));

    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn("bg-primary/20 relative h-2 w-full overflow-hidden rounded-full", className)}
            value={safeValue}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className="bg-primary h-full w-full flex-1 transition-all"
                style={{ transform: `translateX(-${100 - safeValue}%)` }}
            >
                {showPing && safeValue > 0 && safeValue < 100 ? (
                    <span className="absolute top-1/2 right-0 size-2 -translate-y-1/2 rounded-full bg-white/80 animate-ping" />
                ) : null}
            </ProgressPrimitive.Indicator>
        </ProgressPrimitive.Root>
    );
}

export { Progress };
