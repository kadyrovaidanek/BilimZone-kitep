import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useAuth } from "@/entities/user/model/useAuth";

import { getMaterialReport } from "../api/materialReportApi";
import type {
    MaterialReportData,
    MaterialReportFilters,
    MaterialReportRole,
} from "../model/types";

const initialFilters: MaterialReportFilters = {
    date_from: "",
    date_to: "",
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

export const useMaterialReport = (role: MaterialReportRole) => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { user } = useAuth();

    const userId = getUserId(user);

    const [filters, setFilters] =
        useState<MaterialReportFilters>(initialFilters);

    const [data, setData] = useState<MaterialReportData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const loadReport = async (nextFilters = filters) => {
        if (!id) {
            setError(t("materialReport.messages.noMaterial"));
            return;
        }

        if (role === "owner" && !userId) {
            setError(t("materialReport.messages.notAuthorized"));
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const response = await getMaterialReport({
                role,
                publicationId: id,
                userId,
                filters: nextFilters,
            });

            setData(response.data);
        } catch (requestError: any) {
            console.log("MATERIAL REPORT ERROR:", requestError);

            const backendError = requestError?.response?.data?.error;

            setError(
                backendError ||
                t("materialReport.messages.loadError"),
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, [id, userId, role]);

    const handleFilterChange = (
        field: keyof MaterialReportFilters,
        value: string,
    ) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleApplyFilters = async () => {
        await loadReport();
    };

    const handleResetFilters = async () => {
        setFilters(initialFilters);
        await loadReport(initialFilters);
    };

    return {
        data,
        filters,
        isLoading,
        error,
        handleFilterChange,
        handleApplyFilters,
        handleResetFilters,
    };
};