import { Link } from "@inertiajs/react";
import type { PropsWithChildren } from "react";
import AppLogoIcon from "@/components/app-logo-icon";
import { cn } from "@/lib/utils";
import { home } from "@/routes";

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    containerClassName?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
    containerClassName,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4 py-6 sm:p-6 md:p-10">
            <div className={cn("w-full max-w-sm", containerClassName)}>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={home()} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
