import { Eye, EyeOff } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const PasswordFields = React.memo(({ control, loginMethod }: { control: any; loginMethod: string }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const toggleShowPassword = useCallback(() => setShowPassword((prev) => !prev), []);
    const toggleShowRePassword = useCallback(() => setShowRePassword((prev) => !prev), []);

    if (!["password", "both"].includes(loginMethod)) {
        return null;
    }

    return (
        <>
            <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="input-password">
                            Password <span className="text-muted-foreground text-xs">(optional)</span>
                        </FieldLabel>
                        <div className="relative">
                            <Input
                                {...field}
                                id="input-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password (optional)"
                                aria-invalid={fieldState.invalid}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="password_confirmation"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="input-re-password">Retype Password</FieldLabel>
                        <div className="relative">
                            <Input
                                {...field}
                                id="input-re-password"
                                type={showRePassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                aria-invalid={fieldState.invalid}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={toggleShowRePassword}
                            >
                                {showRePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
        </>
    );
});
