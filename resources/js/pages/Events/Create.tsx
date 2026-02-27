import { Head, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { route } from "ziggy-js";
import DateTime24Picker, { toIsoDateTime24 } from "@/components/commons/date-time-24-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Events",
        href: route("events.index"),
    },
];

export default function Create() {
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        name: "",
        keyword: "",
        description: "",
        started_at: "",
        finished_at: "",
        duration: "",
        is_autorun: false,
        status: "pending",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            started_at: toIsoDateTime24(formData.started_at),
            finished_at: toIsoDateTime24(formData.finished_at),
        }));

        post(route("events.store"), {
            onFinish: () => transform((formData) => formData),
            onSuccess: () => {
                toast.success("Election Event created successfully!", {
                    style: { backgroundColor: "green", color: "white" },
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Election Event Create" />
            <div className="flex justify-center p-4">
                <Card className="w-full">
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend>Form Add Election Event</FieldLegend>
                                    <div className="flex flex-col gap-6 md:flex-row">
                                        <div className="flex-1 space-y-4">
                                            <Field>
                                                <FieldLabel htmlFor="input-name">Event Name</FieldLabel>
                                                <Input
                                                    id="input-name"
                                                    placeholder="Enter event name"
                                                    value={data.name}
                                                    onChange={(e) => setData("name", e.target.value)}
                                                />
                                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="input-keyword">Keyword</FieldLabel>
                                                <Input
                                                    id="input-keyword"
                                                    placeholder="Enter keyword"
                                                    value={data.keyword}
                                                    onChange={(e) => setData("keyword", e.target.value)}
                                                />
                                                {errors.keyword && <p className="text-red-500 text-sm">{errors.keyword}</p>}
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="input-description">Description</FieldLabel>
                                                <Textarea
                                                    id="input-description"
                                                    placeholder="Description"
                                                    value={data.description}
                                                    onChange={(e) => setData("description", e.target.value)}
                                                />
                                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="input-start-date">Start Date</FieldLabel>
                                                <DateTime24Picker
                                                    id="input-start-date"
                                                    value={data.started_at}
                                                    onChange={(value) => setData("started_at", value)}
                                                />
                                                <p className="text-muted-foreground text-xs">
                                                    Mendukung jam 00:00 sampai 24:00 dan akan disimpan konsisten ke server.
                                                </p>
                                                {errors.started_at && <p className="text-red-500 text-sm">{errors.started_at}</p>}
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="input-finish-date">Finish Date</FieldLabel>
                                                <DateTime24Picker
                                                    id="input-finish-date"
                                                    value={data.finished_at}
                                                    onChange={(value) => setData("finished_at", value)}
                                                />
                                                {errors.finished_at && <p className="text-red-500 text-sm">{errors.finished_at}</p>}
                                            </Field>
                                        </div>
                                    </div>
                                </FieldSet>

                                <Field orientation="horizontal" className="mt-6 flex justify-between">
                                    <Button variant="secondary" type="button" onClick={() => window.history.back()}>
                                        Back
                                    </Button>

                                    <div className="flex gap-2">
                                        <Button variant="outline" type="reset" onClick={() => reset()}>
                                            Reset
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? (
                                                <span className="flex items-center gap-2">
                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : (
                                                "Save"
                                            )}
                                        </Button>
                                    </div>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
