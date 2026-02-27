import { Controller, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { PositionFormValues } from "@/hooks/usePositionForm";
import { FormActions } from "./FormActions";

interface PositionFormProps {
    form: UseFormReturn<PositionFormValues>;
    onSubmit: (values: PositionFormValues) => Promise<void>;
    legend: string;
    submitLabel: string;
}

export const PositionForm = ({ form, onSubmit, legend, submitLabel }: PositionFormProps) => {
    const { control, handleSubmit, formState, reset } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>{legend}</FieldLegend>
                    <div className="flex flex-col gap-6 md:flex-row">
                        <div className="flex-1 space-y-4">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="input-name">Position Name</FieldLabel>
                                        <Input {...field} id="input-name" placeholder="Enter position name" aria-invalid={fieldState.invalid} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="description"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="input-description">Description</FieldLabel>
                                        <Input
                                            {...field}
                                            id="input-description"
                                            placeholder="Enter description"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="status"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="status-switch">Status</FieldLabel>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="status-switch"
                                                checked={field.value === "active"}
                                                onCheckedChange={(checked) => field.onChange(checked ? "active" : "not active")}
                                            />
                                            <span>{field.value === "active" ? "Active" : "Not Active"}</span>
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                    </div>
                </FieldSet>

                <FormActions
                    isSubmitting={formState.isSubmitting}
                    submitLabel={submitLabel}
                    onReset={() => reset()}
                    onBack={() => window.history.back()}
                />
            </FieldGroup>
        </form>
    );
};
