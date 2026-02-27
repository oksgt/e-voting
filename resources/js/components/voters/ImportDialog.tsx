import { router } from "@inertiajs/react";
import { LoaderCircle, LucideDownload, LucideFileUp, LucideUpload } from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

type ImportResponse =
    | { success: true; message: string }
    | { success: false; message: string; errors?: Array<{ row_number?: number; messages: string[] }> };

interface ImportDialogProps {
    csrfToken: string;
}

const ImportDialog = memo(({ csrfToken }: ImportDialogProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        setErrorMsg("");
    };

    const resetForm = useCallback(() => {
        setSelectedFile(null);
        setErrorMsg("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!selectedFile) {
                setErrorMsg("Please select a file to import.");
                return;
            }

            setLoading(true);
            setErrorMsg("");

            const formData = new FormData();
            formData.append("file", selectedFile);

            try {
                const response = await fetch(route("voters.import"), {
                    method: "POST",
                    body: formData,
                    headers: {
                        "X-CSRF-TOKEN": csrfToken,
                    },
                });

                const result: ImportResponse = await response.json().catch(() => ({
                    success: false,
                    message: "Invalid JSON response from server",
                }));

                if (!response.ok || !result.success) {
                    if (!result.success && result.errors && result.errors.length > 0) {
                        const errorLines = result.errors
                            .map(
                                (err: { row_number?: number; messages: string[] }) =>
                                    `Row ${err.row_number ?? "?"}: ${err.messages.join(", ")}`,
                            )
                            .join("\n");
                        setErrorMsg(errorLines);
                        toast.error(result.message || "Validation failed");
                    } else {
                        setErrorMsg(result.message || `Server error: ${response.status}`);
                        toast.error(result.message || "Import failed");
                    }
                } else {
                    toast.success(result.message);
                    router.reload();
                    setOpen(false);
                    resetForm();
                }
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "An unknown error occurred";
                setErrorMsg(message);
                toast.error(`Network error: ${message}`);
            } finally {
                setLoading(false);
            }
        },
        [csrfToken, selectedFile, resetForm],
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <LucideFileUp className="h-4 w-4" />
                    <span>Import from file</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Import From File</DialogTitle>
                    <DialogDescription>
                        Import new voter data using CSV. Use the CSV template below as a basic template.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="csv-template">CSV template</Label>
                            <Button id="csv-template" variant="outline" size="sm" className="mt-2 flex items-center gap-2" asChild>
                                <a href={route("download.user-template")} download>
                                    <LucideDownload className="h-4 w-4" />
                                    <span>Download Template</span>
                                </a>
                            </Button>
                        </Field>

                        <Field>
                            <Label htmlFor="csv-upload">File Upload</Label>
                            <input
                                ref={fileInputRef}
                                id="csv-upload"
                                name="file"
                                type="file"
                                accept=".csv"
                                className="mt-2 block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                onChange={handleFileChange}
                                aria-describedby="file-error"
                            />
                            {selectedFile && <div className="mt-1 text-xs text-gray-600">{selectedFile.name}</div>}
                            {errorMsg && (
                                <div id="file-error" className="mt-1 text-xs text-red-600 whitespace-pre-line">
                                    {errorMsg}
                                </div>
                            )}
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="outline" size="sm" onClick={resetForm}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" size="sm" className="flex items-center gap-2" disabled={loading}>
                            {loading ? (
                                <>
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    <span>Processing</span>
                                </>
                            ) : (
                                <>
                                    <LucideUpload className="h-4 w-4" />
                                    <span>Upload</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
});

ImportDialog.displayName = "ImportDialog";

export default ImportDialog;
