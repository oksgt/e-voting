import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export function DialogContentNoClose({ className, ...props }) {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
            <DialogPrimitive.Content
                {...props}
                className={cn(
                    "fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg",
                    className
                )}
            >
                {props.children}
                {/* Notice: no <DialogPrimitive.Close /> here */}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
}
