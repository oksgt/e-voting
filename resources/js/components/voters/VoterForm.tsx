import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import RolesGroup from "@/components/RolesGroup";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormValues } from "@/hooks/useVoterForm";
import { FormActions } from "./FormActions";
import { PasswordFields } from "./PasswordFields";

interface VoterFormProps {
    form: UseFormReturn<FormValues>;
    loginMethod: string;
    roles: string[];
    onSubmit: (values: FormValues) => Promise<void>;
    onCheckboxChange: (role: string, checked: boolean) => void;
    onToggleGroup: (rolesList: string[], selectAll: boolean) => void;
    legend?: string;
}

export const VoterForm = ({ form, loginMethod, roles, onSubmit, onCheckboxChange, onToggleGroup, legend = "Form Voter" }: VoterFormProps) => {
    const { control, handleSubmit, formState, reset } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>{legend}</FieldLegend>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Kolom kiri */}
                        <div className="flex-1 space-y-4">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="input-name">Name</FieldLabel>
                                        <Input {...field} id="input-name" placeholder="Enter full name" aria-invalid={fieldState.invalid} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="nik"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="input-nik">NIK</FieldLabel>
                                        <Input
                                            {...field}
                                            id="input-nik"
                                            placeholder="Enter NIK (16 digits)"
                                            maxLength={16}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="bidang"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="input-bidang">Bidang</FieldLabel>
                                        <Input {...field} id="input-bidang" placeholder="Enter bidang" aria-invalid={fieldState.invalid} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="phone_number"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="input-phone">Phone Number</FieldLabel>
                                        <Input
                                            {...field}
                                            id="input-phone"
                                            type="tel"
                                            placeholder="Enter phone number (e.g. 628xxx)"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="email"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="input-email">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id="input-email"
                                            type="email"
                                            placeholder="Enter email"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>

                        {/* Kolom kanan */}
                        <div className="w-full md:w-1/2 space-y-4">
                            <Controller
                                name="login_method"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="login-method">Login Method</FieldLabel>
                                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="login-method" className="w-full" aria-invalid={fieldState.invalid}>
                                                <SelectValue placeholder="Choose login method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="password">Password</SelectItem>
                                                <SelectItem value="magic_link">Magic Link</SelectItem>
                                                <SelectItem value="both">Both</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <PasswordFields control={control} loginMethod={loginMethod} />

                            <Controller
                                name="roles"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Roles</FieldLabel>
                                        <RolesGroup
                                            roles={roles}
                                            selectedRoles={field.value}
                                            onCheckboxChange={onCheckboxChange}
                                            onToggleGroup={onToggleGroup}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                    </div>
                </FieldSet>

                <FormActions
                    isSubmitting={formState.isSubmitting}
                    onReset={() => reset()}
                    onBack={() => window.history.back()}
                />
            </FieldGroup>
        </form>
    );
};
