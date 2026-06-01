import axios from "axios";

import { API_BASE_URL } from "@/shared/api/publications";
import type {
    AdminReportData,
    ExportFormat,
    OwnerReportData,
    ReportFilters,
    ReportRole,
} from "../../model/types";

const buildQueryParams = (filters: ReportFilters) => {
    const params = new URLSearchParams();

    if (filters.date_from) {
        params.append("date_from", filters.date_from);
    }

    if (filters.date_to) {
        params.append("date_to", filters.date_to);
    }

    if (filters.category) {
        params.append("category", filters.category);
    }

    if (filters.owner) {
        params.append("owner", filters.owner);
    }

    if (filters.search) {
        params.append("search", filters.search);
    }

    return params.toString();
};

const normalizeHeaderValue = (value: unknown) => {
    if (Array.isArray(value)) {
        return value.join("; ");
    }

    if (value === null || value === undefined) {
        return "";
    }

    return String(value);
};

export const getAdminReport = (filters: ReportFilters) => {
    const query = buildQueryParams(filters);

    return axios.get<AdminReportData>(
        `${API_BASE_URL}/api/reports/admin/analytics/${query ? `?${query}` : ""}`,
    );
};

export const getOwnerReport = (
    userId: number | string,
    filters: ReportFilters,
) => {
    const query = buildQueryParams(filters);

    return axios.get<OwnerReportData>(
        `${API_BASE_URL}/api/reports/owner/${userId}/analytics/${query ? `?${query}` : ""
        }`,
    );
};

type DownloadReportParams = {
    role: ReportRole;
    userId?: number | string | null;
    format: ExportFormat;
    filters: ReportFilters;
};

const getFileName = (role: ReportRole, format: ExportFormat) => {
    const extension = format === "excel" ? "xlsx" : format;

    return role === "admin"
        ? `admin_report.${extension}`
        : `owner_report.${extension}`;
};

const getMimeType = (format: ExportFormat) => {
    if (format === "excel") {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    if (format === "docx") {
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    return "application/pdf";
};

const readBlobAsText = async (blob: Blob) => {
    try {
        return await blob.text();
    } catch {
        return "";
    }
};

const throwBlobError = async (blob: Blob) => {
    const text = await readBlobAsText(blob);

    try {
        const json = JSON.parse(text);

        throw new Error(
            json?.error ||
            json?.detail ||
            json?.message ||
            "Не удалось скачать отчёт",
        );
    } catch (error: any) {
        if (error?.message && error.message !== "Unexpected end of JSON input") {
            throw error;
        }

        throw new Error(text || "Не удалось скачать отчёт");
    }
};

export const downloadReport = async ({
    role,
    userId,
    format,
    filters,
}: DownloadReportParams) => {
    if (role === "owner" && !userId) {
        throw new Error("Пользователь не найден");
    }

    const query = buildQueryParams(filters);

    const url =
        role === "admin"
            ? `${API_BASE_URL}/api/reports/admin/export/${format}/${query ? `?${query}` : ""
            }`
            : `${API_BASE_URL}/api/reports/owner/${userId}/export/${format}/${query ? `?${query}` : ""
            }`;

    const response = await axios.get<Blob>(url, {
        responseType: "blob",
    });

    const contentType = normalizeHeaderValue(response.headers["content-type"]);

    if (
        contentType.includes("application/json") ||
        contentType.includes("text/html")
    ) {
        await throwBlobError(response.data);
    }

    const blob = new Blob([response.data], {
        type: getMimeType(format),
    });

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = getFileName(role, format);

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(blobUrl);
};