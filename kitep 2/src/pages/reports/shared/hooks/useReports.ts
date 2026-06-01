import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/entities/user/model/useAuth";

import {
    downloadReport,
    getAdminReport,
    getOwnerReport,
} from "../api/reportsApi";
import type {
    ExportFormat,
    ReportData,
    ReportFilters,
    ReportRole,
} from "../../model/types";

const initialFilters: ReportFilters = {
    date_from: "",
    date_to: "",
    category: "",
    owner: "",
    search: "",
};

const getUserId = (user: unknown): number | string | null => {
    if (!user || typeof user !== "object") {
        return null;
    }

    const candidate = user as {
        id?: number | string;
        user_id?: number | string;
    };

    return candidate.id || candidate.user_id || null;
};

export const useReports = (role: ReportRole) => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const userId = getUserId(user);

    const [filters, setFilters] = useState<ReportFilters>(initialFilters);
    const [data, setData] = useState<ReportData | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState("");

    const loadReport = async (nextFilters = filters) => {
        if (role === "owner" && !userId) {
            setError(t("reports.messages.notAuthorized"));
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const response =
                role === "admin"
                    ? await getAdminReport(nextFilters)
                    : await getOwnerReport(userId as number | string, nextFilters);

            setData(response.data);
        } catch (requestError) {
            console.log("REPORT LOAD ERROR:", requestError);
            setError(t("reports.messages.loadError"));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, [role, userId]);

    const handleFilterChange = (field: keyof ReportFilters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleApplyFilters = async () => {
        await loadReport(filters);
    };

    const handleResetFilters = async () => {
        setFilters(initialFilters);
        await loadReport(initialFilters);
    };

    const handleExport = async (format: ExportFormat) => {
        if (role === "owner" && !userId) {
            setError(t("reports.messages.notAuthorized"));
            return;
        }

        try {
            setIsExporting(true);
            setError("");

            await downloadReport({
                role,
                userId,
                format,
                filters,
            });
        } catch (requestError) {
            console.log("REPORT EXPORT ERROR:", requestError);
            setError(t("reports.messages.exportError"));
        } finally {
            setIsExporting(false);
        }
    };

    return {
        data,
        filters,
        isLoading,
        isExporting,
        error,
        handleFilterChange,
        handleApplyFilters,
        handleResetFilters,
        handleExport,
    };
};