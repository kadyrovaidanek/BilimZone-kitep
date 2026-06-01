import type { Publication, PublicationStatus } from "@/shared/api/publications";

export type AdminPublicationFilter = "all" | "pending" | "published" | "rejected";

export const getStatusClass = (status: PublicationStatus) => {
    if (status === "published") {
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (status === "rejected") {
        return "border-rose-200 bg-rose-50 text-rose-700";
    }

    if (status === "draft") {
        return "border-slate-200 bg-slate-50 text-slate-600";
    }

    return "border-amber-200 bg-amber-50 text-amber-700";
};

export const getPublicationFormat = (publication: Publication) => {
    const fileName = publication.file || publication.file_url || "";
    const cleanName = String(fileName).split("?")[0];
    const parts = cleanName.split(".");

    if (parts.length < 2) return "FILE";

    return String(parts.pop() || "FILE").toUpperCase();
};

export const getPublicationFileName = (publication: Publication) => {
    const value = publication.file || publication.file_url || "";

    if (!value) return "Файл не загружен";

    try {
        const cleanValue = String(value).split("?")[0];
        const parts = cleanValue.split("/");
        return decodeURIComponent(parts[parts.length - 1] || "publication");
    } catch {
        return "publication";
    }
};

export const getPublicationPreviewUrl = (publication: Publication) => {
    return (
        publication.preview_file_url ||
        publication.pdf_file_url ||
        (getPublicationFormat(publication) === "PDF"
            ? publication.file_url
            : null)
    );
};

export const canPreviewPublicationInBrowser = (publication: Publication) => {
    const format = getPublicationFormat(publication);
    const previewUrl = getPublicationPreviewUrl(publication);

    if (!previewUrl) return false;

    return (
        ["PDF", "PNG", "JPG", "JPEG", "TXT"].includes(format) ||
        Boolean(publication.preview_file_url)
    );
};